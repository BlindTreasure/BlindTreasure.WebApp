'use client'
import React, { useState, useEffect } from 'react';
import { X, Star, ChevronLeft, ChevronRight, Gift, RefreshCw, Clock, Shield, Loader2, User, MessageCircle, CheckCircle, XCircle, AlertTriangle, Handshake, Eye, Package, Lock, Unlock } from 'lucide-react';
import { useTradeRequestLock } from '@/hooks/use-signalR-lock';
import useToast from '@/hooks/use-toast';
import { useAppSelector } from '@/stores/store';
import { Progress } from "@/components/ui/progress"


interface MyTradeRequestDetailProps {
  tradeRequest: API.TradeRequest;
  onClose: () => void;
  isLoading?: boolean;
  isOngoingTrade?: boolean;
  onLockDeal: (tradeRequestId: string) => Promise<boolean>;
  onCancelDeal: (tradeRequestId: string) => void;
  isCurrentUserRequester: boolean;
}

const MyTradeRequestDetail: React.FC<MyTradeRequestDetailProps> = ({ 
  tradeRequest, 
  onClose, 
  isLoading = false,
  isOngoingTrade = false,
  onLockDeal,
  onCancelDeal,
  isCurrentUserRequester
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentOfferedIndex, setCurrentOfferedIndex] = useState(0);

  const { addToast } = useToast();
  const { lockState, setLockState, isLocking, lockError } = useTradeRequestLock(tradeRequest.id);
  const user = useAppSelector((state) => state.userSlice.user);

  useEffect(() => {
    // Set initial lock state from API data when component mounts or tradeRequest changes
    setLockState({
      ownerLocked: tradeRequest.ownerLocked,
      requesterLocked: tradeRequest.requesterLocked,
      isCompleted: tradeRequest.status.toLowerCase() === 'completed',
      progress: calculateProgress(tradeRequest.ownerLocked, tradeRequest.requesterLocked)
    });
  }, [tradeRequest, setLockState]);

  const calculateProgress = (ownerLocked: boolean, requesterLocked: boolean): number => {
    if (ownerLocked && requesterLocked) return 100;
    if (ownerLocked || requesterLocked) return 50;
    return 0;
  };
  
  const handleLockDeal = async () => {
    if (!tradeRequest.id) return;
    
    // addToast({ description: "Đang xử lý khóa giao dịch...", type: "default" }); // Tạm thời comment lại để sửa lỗi
    const success = await onLockDeal(tradeRequest.id);

    if (success) {
      addToast({ description: "Khóa giao dịch thành công!", type: "success" });
    } else {
      addToast({ description: (lockError as any)?.message || "Khóa giao dịch thất bại.", type: "error" });
    }
  };

  const handleCancel = () => {
    onCancelDeal(tradeRequest.id);
    onClose();
  }

  // Determine if the current user has locked
  const currentUserHasLocked = (isCurrentUserRequester && lockState.requesterLocked) || (!isCurrentUserRequester && lockState.ownerLocked);

  // Format ngày tháng
  const getTimeSincePosted = (requestedAt: string): string => {
    const now = new Date();
    const posted = new Date(requestedAt);
    const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa tạo';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} tuần trước`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} tháng trước`;
  };

  // Get status text and color
  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return isOngoingTrade ? 'Đang chờ xử lý' : 'Đang chờ phản hồi';
      case 'accepted':
        return isOngoingTrade ? 'Đang trao đổi' : 'Đã chấp nhận';
      case 'rejected':
        return 'Đã bị từ chối';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      case 'expired':
        return 'Đã hết hạn';
      case 'in_progress':
        return 'Đang thực hiện';
      case 'locked':
        return 'Đã khóa';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'accepted':
      case 'in_progress':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'rejected':
      case 'cancelled':
      case 'expired':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'locked':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Get time remaining text
  const getTimeRemainingText = () => {
    if (!tradeRequest.timeRemaining) return null;
    
    const hours = Math.floor(tradeRequest.timeRemaining / 3600);
    const minutes = Math.floor((tradeRequest.timeRemaining % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} giờ ${minutes} phút`;
    }
    return `${minutes} phút`;
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
        <div className="w-full max-w-md bg-white ml-auto h-full overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <h2 className="text-lg font-semibold text-gray-900">
              {isOngoingTrade ? 'Đang trao đổi' : 'Yêu cầu trao đổi'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600">Đang tải thông tin chi tiết...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      <div className="w-full max-w-md bg-white ml-auto h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-900">
            {isOngoingTrade ? 'Đang trao đổi' : 'Yêu cầu trao đổi'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {/* Status and Time */}
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(tradeRequest.status)}`}>
              <Shield className="w-3 h-3" />
              {getStatusText(tradeRequest.status)}
            </span>
            
            {tradeRequest.timeRemaining && tradeRequest.status.toLowerCase() === 'accepted' && (
              <div className="flex items-center gap-1 text-sm text-red-600 font-medium animate-pulse">
                <Clock className="w-4 h-4" />
                <span>Còn {getTimeRemainingText()}</span>
              </div>
            )}
          </div>

          {/* Trade Request Info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 mb-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Handshake className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">
                {isOngoingTrade ? 'Thông tin trao đổi' : 'Thông tin yêu cầu'}
              </h3>
            </div>
            <p className="text-sm text-blue-800 mb-1">
              <span className="font-medium">Người nhận:</span> {tradeRequest.requesterName}
            </p>
            <p className="text-sm text-blue-700">
              <span className="font-medium">Thời gian:</span> {getTimeSincePosted(tradeRequest.requestedAt)}
            </p>
          </div>

          {/* Lock Status */}
          {tradeRequest.status.toLowerCase() === 'accepted' && (
            <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Trạng thái khóa giao dịch
              </h3>
              <Progress value={lockState.progress} className="w-full mb-3" />
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {lockState.ownerLocked ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-gray-400" />}
                  <span className={lockState.ownerLocked ? "text-gray-800" : "text-gray-500"}>
                    {isCurrentUserRequester ? 'Chủ sở hữu đã khóa' : 'Bạn đã khóa'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {lockState.requesterLocked ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-gray-400" />}
                  <span className={lockState.requesterLocked ? "text-gray-800" : "text-gray-500"}>
                    {isCurrentUserRequester ? 'Bạn đã khóa' : 'Người yêu cầu đã khóa'}
                  </span>
                </div>
              </div>
            </div>
          )}


          {/* Target Item (What you want) */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Sản phẩm bạn muốn
            </h3>
            
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                <img
                  src={tradeRequest.listingItemImgUrl}
                  alt={tradeRequest.listingItemName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-image.jpg';
                  }}
                />
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-1">
                {tradeRequest.listingItemName}
              </h4>
              
              {tradeRequest.listingItemTier && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-xs font-medium">
                  <Star className="w-3 h-3" />
                  {tradeRequest.listingItemTier}
                </div>
              )}
            </div>
          </div>

          {/* Offered Items (What you're offering) */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Sản phẩm bạn đề nghị ({tradeRequest.offeredItems?.length || 0} món)
            </h3>
            
            {tradeRequest.offeredItems && tradeRequest.offeredItems.length > 0 ? (
              <div className="space-y-3">
                {tradeRequest.offeredItems.map((item, index) => (
                  <div key={`offered-${item.inventoryItemId}-${index}`} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex gap-3">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.itemName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-1 truncate">
                          {item.itemName}
                        </h4>
                        
                        {item.tier && (
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-xs font-medium mb-2">
                            <Star className="w-3 h-3" />
                            {item.tier}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">Không có sản phẩm đề nghị</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {tradeRequest.status.toLowerCase() === 'accepted' && !lockState.isCompleted && (
            <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 space-y-2">
               <button
                onClick={handleLockDeal}
                disabled={currentUserHasLocked || isLocking || lockState.isCompleted}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isLocking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {currentUserHasLocked ? "Đã khóa" : "Khóa giao dịch"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isLocking || lockState.isCompleted}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                Hủy giao dịch
              </button>
            </div>
          )}

          {/* Status Information */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Thông tin chi tiết</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Trạng thái:</span>
                <span className="font-medium text-gray-900">
                  {getStatusText(tradeRequest.status)}
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Thời gian tạo:</span>
                <span className="font-medium text-gray-900">
                  {new Date(tradeRequest.requestedAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Đối tác:</span>
                <span className="font-medium text-gray-900">
                  {isCurrentUserRequester ? tradeRequest.listingOwnerName : tradeRequest.requesterName}
                </span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-gray-600">ID Giao dịch:</span>
                <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {tradeRequest.id}
                </span>
              </div>
              
            </div>
          </div>

          {/* Status-based Information */}
          {tradeRequest.status?.toLowerCase() === 'pending' && !isOngoingTrade && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Đang chờ phản hồi
                </span>
              </div>
              <p className="text-xs text-yellow-700">
                Yêu cầu trao đổi của bạn đã được gửi và đang chờ chủ sở hữu sản phẩm phản hồi.
              </p>
            </div>
          )}

          {tradeRequest.status?.toLowerCase() === 'accepted' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Yêu cầu đã được chấp nhận
                </span>
              </div>
              <p className="text-xs text-blue-700">
                {isOngoingTrade 
                  ? 'Giao dịch đang được thực hiện. Vui lòng làm theo hướng dẫn để hoàn tất.'
                  : 'Chủ sở hữu đã chấp nhận yêu cầu trao đổi của bạn. Giao dịch sẽ được bắt đầu.'
                }
              </p>
            </div>
          )}

          {tradeRequest.status?.toLowerCase() === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  Yêu cầu đã bị từ chối
                </span>
              </div>
              <p className="text-xs text-red-700">
                Chủ sở hữu đã từ chối yêu cầu trao đổi của bạn. Bạn có thể thử tạo yêu cầu khác.
              </p>
            </div>
          )}

          {tradeRequest.status?.toLowerCase() === 'completed' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Giao dịch hoàn thành
                </span>
              </div>
              <p className="text-xs text-green-700">
                Giao dịch đã được hoàn thành thành công. Cảm ơn bạn đã sử dụng dịch vụ!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTradeRequestDetail;