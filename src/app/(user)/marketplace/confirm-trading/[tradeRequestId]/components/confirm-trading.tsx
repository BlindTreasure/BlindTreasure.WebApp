'use client'
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  
  const { lockState, lockDeal, setLockState, isLocking, lockError } = useTradeRequestLock(tradeRequestId);
  
  const serverTimeRef = useRef<number>(0);
  const localStartTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const componentStartTimeRef = useRef<number>(Date.now());
  
  const [hasStableTime, setHasStableTime] = useState(false);
  const [consecutiveStableSync, setConsecutiveStableSync] = useState(0);
  const initialSyncCountRef = useRef(0);
  const maxInitialSyncs = 5;
  
  const lastSyncDataRef = useRef<string>('');
  const syncInProgressRef = useRef<boolean>(false);
  const lastUserActivityRef = useRef<number>(Date.now());
  const lastSignalRUpdateRef = useRef<number>(Date.now());
  const [isPageVisible, setIsPageVisible] = useState(true);

  const userSlice = useSelector((state: any) => state.userSlice);
  const userAvatar = userSlice?.user.avatarUrl || '/default-avatar.png';
  const userId = userSlice?.user.userId || '';

  const calculateTimeLeft = useCallback(() => {
    if (serverTimeRef.current === 0 || localStartTimeRef.current === 0) return 0;
    
    const now = Date.now();
    const elapsed = Math.floor((now - localStartTimeRef.current) / 1000);
    const remaining = Math.max(0, serverTimeRef.current - elapsed);
    
    return remaining;
  }, []);

  const calculateProgress = useCallback(() => {
    if (lockState.isCompleted) return 100;
    if (lockState.ownerLocked && lockState.requesterLocked) return 100;
    if (lockState.ownerLocked || lockState.requesterLocked) return 50;
    return 0;
  }, [lockState.ownerLocked, lockState.requesterLocked, lockState.isCompleted]);

  const trackUserActivity = useCallback(() => {
    lastUserActivityRef.current = Date.now();
  }, []);

  const shouldSync = useCallback(() => {
    const now = Date.now();
    const timeSinceComponentStart = now - componentStartTimeRef.current;
    
    if (lockState.isCompleted) return false;
    if (!isPageVisible) return false;
    
    // Sync aggressive hơn trong 45s đầu hoặc chưa stable
    if ((timeSinceComponentStart < 45000 && initialSyncCountRef.current < 5) || 
        (!hasStableTime && initialSyncCountRef.current < 5)) {
      return true;
    }
    
    const timeSinceLastSignalR = now - lastSignalRUpdateRef.current;
    const timeSinceLastActivity = now - lastUserActivityRef.current;
    
    if (timeSinceLastSignalR < 5000) return true;
    if (timeSinceLastActivity > 120000) return true;
    
    return false;
  }, [lockState.isCompleted, isPageVisible, hasStableTime]);

  const syncWithServer = useCallback(async (force = false) => {
    if (!tradeRequestId || (syncInProgressRef.current && !force)) return;
    
    syncInProgressRef.current = true;
    initialSyncCountRef.current++;
    
    try {
      const response = await getTradeRequestDetailApi(tradeRequestId);
      
      if (response?.value?.data) {
        const data = response.value.data as API.TradeRequest;
        const serverTime = data.timeRemaining || 0;
        const currentCalculatedTime = calculateTimeLeft();
        const timeDifference = Math.abs(currentCalculatedTime - serverTime);
        
        if (!hasStableTime) {
          if (timeDifference <= 0.5) {  // Chặt hơn: <= 0.5s
            setConsecutiveStableSync(prev => prev + 1);
            if (consecutiveStableSync >= 0) { // Chỉ cần 1 lần stable
              setHasStableTime(true);
            }
          } else {
            setConsecutiveStableSync(0);
          }
        }
        
        const shouldUpdateTime = timeDifference > 2 || serverTimeRef.current === 0;
        const shouldUpdateLockState = 
          (data.ownerLocked || false) !== lockState.ownerLocked ||
          (data.requesterLocked || false) !== lockState.requesterLocked;
        
        const currentDataHash = JSON.stringify({
          timeRemaining: data.timeRemaining,
          ownerLocked: data.ownerLocked || false,
          requesterLocked: data.requesterLocked || false,
          listingItemName: data.listingItemName,
          requesterName: data.requesterName,
          offeredItemsCount: data.offeredItems?.length || 0
        });
        
        if (shouldUpdateTime || shouldUpdateLockState || force || lastSyncDataRef.current !== currentDataHash) {
          lastSyncDataRef.current = currentDataHash;
          setTradeData(data);
          
          if (shouldUpdateTime) {
            serverTimeRef.current = serverTime;
            localStartTimeRef.current = Date.now();
            setTimeLeft(serverTime);
          }
          
          if (shouldUpdateLockState) {
            const serverOwnerLocked = data.ownerLocked || false;
            const serverRequesterLocked = data.requesterLocked || false;
            const serverIsCompleted = serverOwnerLocked && serverRequesterLocked;
            
            setLockState(prevState => {
              if (prevState.ownerLocked === serverOwnerLocked && 
                  prevState.requesterLocked === serverRequesterLocked && 
                  prevState.isCompleted === serverIsCompleted) {
                return prevState;
              }
              
              const newProgress = serverIsCompleted ? 100 : 
                                 (serverOwnerLocked || serverRequesterLocked ? 50 : 0);
              
              return {
                ownerLocked: serverOwnerLocked,
                requesterLocked: serverRequesterLocked,
                isCompleted: serverIsCompleted,
                progress: newProgress
              };
            });
          }
        }
      }
    } catch (error) {
    } finally {
      syncInProgressRef.current = false;
    }
  }, [tradeRequestId, getTradeRequestDetailApi, calculateTimeLeft, lockState.ownerLocked, lockState.requesterLocked, hasStableTime, consecutiveStableSync]);

  useEffect(() => {
    syncWithServer(true);
  }, []);

  useEffect(() => {
    lastSignalRUpdateRef.current = Date.now();
    
    if (hasStableTime && initialSyncCountRef.current >= maxInitialSyncs) {
      setTimeout(() => syncWithServer(), 500);
    }
  }, [lockState.ownerLocked, lockState.requesterLocked, hasStableTime, syncWithServer]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsPageVisible(isVisible);
      
      if (isVisible) {
        syncWithServer(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [syncWithServer]);

  useEffect(() => {
    const newProgress = calculateProgress();
    
    if (lockState.progress !== newProgress) {
      setLockState(prev => ({
        ...prev,
        progress: newProgress,
        isCompleted: newProgress === 100
      }));
    }
  }, [lockState.ownerLocked, lockState.requesterLocked, calculateProgress, lockState.progress]);

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

    const getSyncInterval = () => {
      if (!hasStableTime && initialSyncCountRef.current < maxInitialSyncs) {
        return 5000;
      }
      return 30000;
    };

    syncIntervalRef.current = setInterval(() => {
      if (shouldSync()) {
        syncWithServer();
      }
    }, getSyncInterval());

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [lockState.isCompleted, shouldSync, syncWithServer, hasStableTime]);

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

  useEffect(() => {
    if (lockState.isCompleted && lockState.ownerLocked && lockState.requesterLocked) {
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

  useEffect(() => {
    const handleTradeCompleted = (event: Event) => {
      const data = (event as CustomEvent).detail;
      if (data.tradeRequestId === tradeRequestId) {
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

  const handleLockToggle = useCallback(async () => {
    if (lockState.isCompleted || isLocking) return;
    
    try {
      const isRequester = userId === tradeData?.requesterId;
      const newLockState = {
        ...lockState,
        ownerLocked: isRequester ? lockState.ownerLocked : true,
        requesterLocked: isRequester ? true : lockState.requesterLocked
      };
      
      const newProgress = (newLockState.ownerLocked && newLockState.requesterLocked) ? 100 : 
                         (newLockState.ownerLocked || newLockState.requesterLocked) ? 50 : 0;
      
      newLockState.progress = newProgress;
      newLockState.isCompleted = newProgress === 100;
      
      setLockState(newLockState);
      
      const success = await lockDeal(tradeRequestId);
      if (success) {
        setTimeout(() => {
          syncWithServer(true);
        }, 1000);
      } else {
        setLockState(lockState);
        syncWithServer(true);
      }
    } catch (error) {
      setLockState(lockState);
      syncWithServer(true);
    }
  }, [lockState, isLocking, userId, tradeData?.requesterId, lockDeal, tradeRequestId, syncWithServer]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getRarityColor = useCallback((rarity: string) => {
    const colors = {
      common: 'bg-gray-100 text-gray-800 border-gray-300',
      rare: 'bg-blue-100 text-blue-800 border-blue-300',
      epic: 'bg-purple-100 text-purple-800 border-purple-300',
      legendary: 'bg-orange-100 text-orange-800 border-orange-300'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  }, []);

  const { currentUser, otherUser, isRequester } = useMemo(() => {
    if (!tradeData) return { currentUser: null, otherUser: null, isRequester: false };
    
    const isReq = userId === tradeData.requesterId;
    
    const current: TradeUser = {
      id: userId,
      name: isReq ? tradeData.requesterName : (tradeData.listingOwnerName || "Chủ sở hữu"),
      avatar: isReq ? (tradeData.requesterAvatarUrl || userAvatar) : (tradeData.listingOwnerAvatarUrl || userAvatar),
      items: isReq ? 
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
    
    const other: TradeUser = {
      id: isReq ? 'owner' : tradeData.requesterId,
      name: isReq ? (tradeData.listingOwnerName || 'Chủ sở hữu') : tradeData.requesterName,
      avatar: isReq ? (tradeData.listingOwnerAvatarUrl || '/default-avatar.png') : (tradeData.requesterAvatarUrl || '/default-avatar.png'),
      items: isReq ? 
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

    return { currentUser: current, otherUser: other, isRequester: isReq };
  }, [tradeData, userId, userAvatar]);

  const { currentUserLocked, otherUserLocked } = useMemo(() => ({
    currentUserLocked: isRequester ? lockState.requesterLocked : lockState.ownerLocked,
    otherUserLocked: isRequester ? lockState.ownerLocked : lockState.requesterLocked
  }), [isRequester, lockState.requesterLocked, lockState.ownerLocked]);

  const statusMessage = useMemo(() => {
    if (lockState.isCompleted) return "Đang xử lý giao dịch...";
    if (!currentUserLocked && !otherUserLocked) return "Cả hai bên cần khóa để hoàn tất giao dịch";
    if (currentUserLocked && !otherUserLocked) return "Đang chờ bên kia khóa giao dịch...";
    if (!currentUserLocked && otherUserLocked) return "Bạn cần khóa để hoàn tất giao dịch";
    return "";
  }, [lockState.isCompleted, currentUserLocked, otherUserLocked]);

  if (isPending || !tradeData || !currentUser || !otherUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin giao dịch...</p>
        </div>
      </div>
    );
  }

  if (lockState.isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
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
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Xác nhận giao dịch</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-orange-600">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">{formatTime(timeLeft)}</span>
              </div>
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
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
            <div className="flex items-center justify-center p-6 bg-gray-50">
              <div className={`bg-white rounded-full p-4 shadow-lg transition-all duration-500 ${lockState.progress > 0 ? 'animate-pulse' : ''}`}>
                <ArrowLeftRight className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className={`p-6 border-l border-gray-200 transition-all duration-300 ${otherUserLocked ? 'bg-green-50' : ''}`}>
              <div className="flex items-center space-x-3 mb-6">
                <img src={otherUser.avatar} alt={otherUser.name} className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
                  <div className="flex items-center space-x-2">
                    {otherUserLocked ? (
                      <><Lock className="w-4 h-4 text-green-600 animate-pulse" /><span className="text-sm text-green-600">Đã khóa</span></>
                    ) : (
                      <><Unlock className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-400">Đang chờ khóa</span></>
                    )}
                  </div>
                </div>
              </div>
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
          <div className="bg-gray-50 p-6 border-t">
            <div className="text-center text-sm text-gray-600">
              {statusMessage}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeConfirmationPage;