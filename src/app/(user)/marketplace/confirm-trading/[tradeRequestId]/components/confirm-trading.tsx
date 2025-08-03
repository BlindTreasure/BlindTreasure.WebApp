'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Lock, Unlock, Clock, CheckCircle, AlertTriangle, ArrowLeftRight, Loader2 } from 'lucide-react';
import useGetTradeRequestDetail from '../hooks/useGetTradeRequestDetail';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useTradeRequestLock } from '@/hooks/use-signalR-lock';

interface TradeItem {
  id: string;
  name: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description?: string;
}

interface TradeUser {
  id: string;
  name: string;
  avatar: string;
  items: TradeItem[];
}

const TradeConfirmationPage: React.FC = () => {
  const params = useParams();
  const tradeRequestId = params?.tradeRequestId as string;
  
  const { isPending, getTradeRequestDetailApi } = useGetTradeRequestDetail();
  const [tradeData, setTradeData] = useState<API.TradeRequest | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // Sử dụng hook SignalR đã được update với React Query
  const { lockState, lockDeal, setLockState, isLocking, lockError } = useTradeRequestLock(tradeRequestId);
  
  // Refs để tracking thời gian chính xác
  const serverTimeRef = useRef<number>(0);
  const localStartTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get user data from Redux
  const userSlice = useSelector((state: any) => state.userSlice);
  const userAvatar = userSlice?.user.avatarUrl || '/default-avatar.png';
  const userId = userSlice?.user.userId || '';

  // Hàm tính toán thời gian còn lại chính xác
  const calculateTimeLeft = useCallback(() => {
    if (serverTimeRef.current === 0 || localStartTimeRef.current === 0) return 0;
    
    const now = Date.now();
    const elapsed = Math.floor((now - localStartTimeRef.current) / 1000);
    const remaining = Math.max(0, serverTimeRef.current - elapsed);
    
    return remaining;
  }, []);

  // Hàm tính toán progress từ lockState
  const calculateProgress = useCallback(() => {
    if (lockState.isCompleted) return 100;
    if (lockState.ownerLocked && lockState.requesterLocked) return 100;
    if (lockState.ownerLocked || lockState.requesterLocked) return 50;
    return 0;
  }, [lockState.ownerLocked, lockState.requesterLocked, lockState.isCompleted]);

  // Hàm sync với server để lấy data và update thời gian
  const syncWithServer = useCallback(async () => {
    if (!tradeRequestId) return;
    
    try {
      const response = await getTradeRequestDetailApi(tradeRequestId);
      
      if (response?.value?.data) {
        const data = response.value.data as API.TradeRequest;
        
        // Update trade data
        setTradeData(data);
        
        // Update thời gian từ server
        if (data.timeRemaining !== undefined) {
          serverTimeRef.current = data.timeRemaining;
          localStartTimeRef.current = Date.now();
          setTimeLeft(data.timeRemaining);
        }
        
        // Update lock state từ server data (fallback nếu SignalR chưa update)
        const serverOwnerLocked = data.ownerLocked || false;
        const serverRequesterLocked = data.requesterLocked || false;
        const serverIsCompleted = serverOwnerLocked && serverRequesterLocked;
        
        // Chỉ update nếu có sự khác biệt với state hiện tại
        if (lockState.ownerLocked !== serverOwnerLocked || 
            lockState.requesterLocked !== serverRequesterLocked || 
            lockState.isCompleted !== serverIsCompleted) {
          setLockState({
            ownerLocked: serverOwnerLocked,
            requesterLocked: serverRequesterLocked,
            isCompleted: serverIsCompleted,
            progress: serverIsCompleted ? 100 : (serverOwnerLocked || serverRequesterLocked ? 50 : 0)
          });
        }
      }
    } catch (error) {
      console.error('Error syncing with server:', error);
    }
  }, [tradeRequestId, getTradeRequestDetailApi, lockState, setLockState]);

  // Fetch initial data
  useEffect(() => {
    syncWithServer();
  }, []);

  // Update progress khi lockState thay đổi
  useEffect(() => {
    const newProgress = calculateProgress();
    if (lockState.progress !== newProgress) {
      setLockState(prev => ({
        ...prev,
        progress: newProgress,
        isCompleted: newProgress === 100
      }));
    }
  }, [lockState.ownerLocked, lockState.requesterLocked, calculateProgress]);

  // Setup timer để cập nhật UI mỗi giây
  useEffect(() => {
    if (lockState.isCompleted || timeLeft <= 0) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    timerIntervalRef.current = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft <= 0) {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      }
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [lockState.isCompleted, timeLeft, calculateTimeLeft]);

  // Setup sync định kỳ để đảm bảo consistency
  useEffect(() => {
    if (lockState.isCompleted) {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
      return;
    }

    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }

    // Sync mỗi 15 giây để update thời gian và check consistency (giảm từ 30s)
    syncIntervalRef.current = setInterval(() => {
      syncWithServer();
    }, 15000);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [lockState.isCompleted, syncWithServer]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, []);

  // Handle trade completion - chỉ cleanup timers, không tự động chuyển trang
  useEffect(() => {
    if (lockState.isCompleted && lockState.ownerLocked && lockState.requesterLocked) {
      // Clear all timers
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    }
  }, [lockState.isCompleted, lockState.ownerLocked, lockState.requesterLocked, tradeRequestId]);

  // Handle trade completion redirect (backup từ custom event) - chỉ cleanup timers
  useEffect(() => {
    const handleTradeCompleted = (event: Event) => {
      const data = (event as CustomEvent).detail;
      if (data.tradeRequestId === tradeRequestId) {
        // Clear all timers
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        if (syncIntervalRef.current) {
          clearInterval(syncIntervalRef.current);
          syncIntervalRef.current = null;
        }
      }
    };

    window.addEventListener('trade-completed', handleTradeCompleted);
    return () => window.removeEventListener('trade-completed', handleTradeCompleted);
  }, [tradeRequestId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-100 text-gray-800 border-gray-300',
      rare: 'bg-blue-100 text-blue-800 border-blue-300',
      epic: 'bg-purple-100 text-purple-800 border-purple-300',
      legendary: 'bg-orange-100 text-orange-800 border-orange-300'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const handleLockToggle = async () => {
    if (lockState.isCompleted || isLocking) return;
    
    try {
      // Optimistic update - update UI ngay lập tức
      const isRequester = userId === tradeData?.requesterId;
      const newLockState = {
        ...lockState,
        ownerLocked: isRequester ? lockState.ownerLocked : true,
        requesterLocked: isRequester ? true : lockState.requesterLocked
      };
      
      // Update progress ngay
      const newProgress = (newLockState.ownerLocked && newLockState.requesterLocked) ? 100 : 
                         (newLockState.ownerLocked || newLockState.requesterLocked) ? 50 : 0;
      
      newLockState.progress = newProgress;
      newLockState.isCompleted = newProgress === 100;
      
      // Set optimistic state
      setLockState(newLockState);
      
      const success = await lockDeal(tradeRequestId);
      if (success) {
        console.log('Lock deal successful, optimistic update applied');
        // Sync lại với server để đảm bảo consistency
        setTimeout(() => {
          syncWithServer();
        }, 1000);
      } else {
        // Revert optimistic update nếu thất bại
        setLockState(lockState);
      }
    } catch (error) {
      console.error('Failed to lock trade:', error);
      // Revert optimistic update nếu có lỗi
      setLockState(lockState);
    }
  };

  // Loading state
  if (isPending || !tradeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin giao dịch...</p>
        </div>
      </div>
    );
  }

  // Xác định role của user hiện tại
  const isRequester = userId === tradeData.requesterId;
  const isOwner = !isRequester;

  const currentUserLocked = isRequester ? lockState.requesterLocked : lockState.ownerLocked;
  const otherUserLocked = isRequester ? lockState.ownerLocked : lockState.requesterLocked;

  // Prepare user data
  const currentUser: TradeUser = {
    id: userId,
    name: "Bạn",
    avatar: userAvatar,
    items: isRequester ? 
      tradeData.offeredItems?.map(item => ({
        id: item.inventoryItemId,
        name: item.itemName,
        image: item.imageUrl || '/default-item.png',
        rarity: (item.tier?.toLowerCase() as any) || 'common',
        description: 'Item đề xuất'
      })) || [] : 
      [{
        id: tradeData.listingId,
        name: tradeData.listingItemName,
        image: tradeData.listingItemImgUrl || '/default-item.png',
        rarity: tradeData.listingItemTier.toLowerCase() as any,
        description: 'Item listing'
      }]
  };
  
  const otherUser: TradeUser = {
    id: isRequester ? 'owner' : tradeData.requesterId,
    name: isRequester ? 'Chủ sở hữu' : 'Người yêu cầu',
    avatar: '/default-avatar.png',
    items: isRequester ? 
      [{
        id: tradeData.listingId,
        name: tradeData.listingItemName,
        image: tradeData.listingItemImgUrl || '/default-item.png',
        rarity: tradeData.listingItemTier.toLowerCase() as any,
        description: 'Item listing'
      }] :
      tradeData.offeredItems?.map(item => ({
        id: item.inventoryItemId,
        name: item.itemName,
        image: item.imageUrl || '/default-item.png',
        rarity: (item.tier?.toLowerCase() as any) || 'common',
        description: 'Item đề xuất'
      })) || []
  };

  const getStatusMessage = () => {
    if (lockState.isCompleted) return "Đang xử lý giao dịch...";
    if (!currentUserLocked && !otherUserLocked) return "Cả hai bên cần khóa để hoàn tất giao dịch";
    if (currentUserLocked && !otherUserLocked) return "Đang chờ bên kia khóa giao dịch...";
    if (!currentUserLocked && otherUserLocked) return "Bạn cần khóa để hoàn tất giao dịch";
    return "";
  };

  // Success screen với animation - chỉ hiển thị nút, không tự động chuyển trang
  if (lockState.isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all duration-500 scale-100 animate-pulse">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Giao dịch thành công!</h2>
          <p className="text-gray-600 mb-6">
            Các item đã được chuyển đổi thành công giữa hai bên.
          </p>
          <button 
            onClick={() => window.location.href = '/marketplace'}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Quay về Marketplace
          </button>
        </div>
      </div>
    );
  }

  // Timeout screen
  if (timeLeft === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Giao dịch đã hủy</h2>
          <p className="text-gray-600 mb-6">
            Giao dịch đã bị hủy do hết thời gian.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pt-36">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Xác nhận giao dịch</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-orange-600">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">{formatTime(timeLeft)}</span>
              </div>

              {/* Progress với animation */}
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${lockState.progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">{lockState.progress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trade Window với animations */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Current User Side */}
            <div className={`p-6 border-r border-gray-200 transition-all duration-300 ${currentUserLocked ? 'bg-green-50' : ''}`}>
              <div className="flex items-center space-x-3 mb-6">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="font-semibold text-gray-900">{currentUser.name}</h3>
                  <div className="flex items-center space-x-2">
                    {currentUserLocked ? (
                      <><Lock className="w-4 h-4 text-green-600 animate-pulse" /><span className="text-sm text-green-600">Đã khóa</span></>
                    ) : (
                      <><Unlock className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-400">Chưa khóa</span></>
                    )}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {currentUser.items.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-3 flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(item.rarity)}`}>
                          {item.rarity}
                        </span>
                        {item.description && (
                          <span className="text-xs text-gray-500">{item.description}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Lock Button */}
              <button
                onClick={handleLockToggle}
                disabled={currentUserLocked || isLocking || lockState.isCompleted}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  currentUserLocked
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } ${(currentUserLocked || isLocking || lockState.isCompleted) ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`}
              >
                {isLocking ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Đang xử lý...
                  </div>
                ) : currentUserLocked ? (
                  <><Lock className="w-4 h-4 inline mr-2" />Đã khóa</>
                ) : (
                  <><Unlock className="w-4 h-4 inline mr-2" />Khóa giao dịch</>
                )}
              </button>
            </div>

            {/* Center Arrow với animation */}
            <div className="flex items-center justify-center p-6 bg-gray-50">
              <div className={`bg-white rounded-full p-4 shadow-lg transition-all duration-500 ${lockState.progress > 0 ? 'animate-pulse' : ''}`}>
                <ArrowLeftRight className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            {/* Other User Side */}
            <div className={`p-6 border-l border-gray-200 transition-all duration-300 ${otherUserLocked ? 'bg-green-50' : ''}`}>
              <div className="flex items-center space-x-3 mb-6">
                <img src={otherUser.avatar} alt={otherUser.name} className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
                  <div className="flex items-center space-x-2">
                    {otherUserLocked ? (
                      <><Lock className="w-4 h-4 text-green-600 animate-pulse" /><span className="text-sm text-green-600">Đã khóa</span></>
                    ) : (
                      <><Unlock className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-400">Chưa khóa</span></>
                    )}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {otherUser.items.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-3 flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(item.rarity)}`}>
                          {item.rarity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Other User Status */}
              <div className={`w-full py-3 px-4 rounded-lg font-semibold text-center border-2 transition-all duration-300 ${
                otherUserLocked
                  ? 'bg-green-100 text-green-700 border-green-300'
                  : 'bg-gray-100 text-gray-500 border-gray-300'
              }`}>
                {otherUserLocked ? (
                  <><Lock className="w-4 h-4 inline mr-2" />Đã khóa</>
                ) : (
                  <><Unlock className="w-4 h-4 inline mr-2" />Đang chờ khóa</>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Status */}
          <div className="bg-gray-50 p-6 border-t">
            <div className="text-center text-sm text-gray-600">
              {getStatusMessage()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeConfirmationPage;