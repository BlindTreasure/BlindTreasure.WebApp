'use client'
import React, { useState, useEffect, useRef } from 'react';
import { X, Star, ChevronLeft, ChevronRight, Gift, RefreshCw, Clock, Shield, Loader2, User, MessageCircle, CheckCircle, XCircle, AlertTriangle, Handshake, Eye, Package, Lock, Unlock, History, Calendar } from 'lucide-react';
import { Progress } from "@/components/ui/progress"

// History item type
interface HistoryItem {
  id: string;
  listingId?: string;
  listingItemName?: string;
  listingItemTier?: string;
  listingItemImgUrl?: string;
  listingOwnerName?: string;
  requesterId?: string;
  requesterName?: string;
  offeredItems?: API.OfferedItem[];
  status?: string;
  finalStatus?: string;
  requestedAt?: string;
  completedAt?: string;
  createdAt?: string;
  timeRemaining?: number;
  ownerLocked?: boolean;
  requesterLocked?: boolean;
}

// Updated interface to match the props being passed from parent
interface MyTradeRequestDetailProps {
  tradeRequest: API.TradeRequest | HistoryItem;
  onClose: () => void;
  isLoading?: boolean;
  isHistoryView?: boolean;
}


const MyTradeRequestDetail: React.FC<MyTradeRequestDetailProps> = ({ 
  tradeRequest, 
  onClose, 
  isLoading = false,
  isHistoryView = false
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentOfferedIndex, setCurrentOfferedIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !contentRef.current?.contains(event.target as Node)) {
        onClose();
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleEscKey);
    
    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  // Determine if this is an ongoing trade based on status
  const currentStatus = isHistoryView ? ((tradeRequest as HistoryItem).finalStatus || tradeRequest.status) : tradeRequest.status;
  const isOngoingTrade = !isHistoryView && ['accepted', 'in_progress', 'locked'].includes(currentStatus?.toLowerCase() || '');
  
  // For trade requests, the current user is always the requester
  const isCurrentUserRequester = true;

  // Get the appropriate data based on view type
  const getItemName = (): string => {
    return tradeRequest.listingItemName || 'Không xác định';
  };

  const getItemImage = (): string => {
    return tradeRequest.listingItemImgUrl || '';
  };

  const getItemTier = (): string => {
    return tradeRequest.listingItemTier || '';
  };

  const getOwnerName = (): string => {
    return tradeRequest.listingOwnerName || tradeRequest.requesterName || 'Không xác định';
  };

  const getDateTime = (): string => {
    if (isHistoryView) {
      return (tradeRequest as HistoryItem).completedAt || (tradeRequest as HistoryItem).createdAt || tradeRequest.requestedAt || '';
    }
    return tradeRequest.requestedAt || '';
  };

  const calculateProgress = (ownerLocked?: boolean, requesterLocked?: boolean): number => {
    if (ownerLocked && requesterLocked) return 100;
    if (ownerLocked || requesterLocked) return 50;
    return 0;
  };

  // Format ngày tháng
  const getTimeSincePosted = (dateString: string): string => {
    if (!dateString) return 'Không xác định';
    
    const now = new Date();
    const posted = new Date(dateString);
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
  const getStatusText = (status?: string): string => {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
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

  const getStatusColor = (status?: string): string => {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
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
  const getTimeRemainingText = (): string | null => {
    if (!tradeRequest.timeRemaining) return null;
    
    const hours = Math.floor(tradeRequest.timeRemaining / 3600);
    const minutes = Math.floor((tradeRequest.timeRemaining % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} giờ ${minutes} phút`;
    }
    return `${minutes} phút`;
  };

  // Get header title based on view type
  const getHeaderTitle = (): string => {
    if (isHistoryView) {
      return 'Lịch sử giao dịch';
    }
    return isOngoingTrade ? 'Đang trao đổi' : 'Yêu cầu trao đổi';
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div ref={modalRef} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
        <div ref={contentRef} className="w-full max-w-md bg-white ml-auto h-full overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <h2 className="text-lg font-semibold text-gray-900">
              {getHeaderTitle()}
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
    <div ref={modalRef} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      <div ref={contentRef} className="w-full max-w-md bg-white ml-auto h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            {isHistoryView && <History className="w-5 h-5" />}
            {getHeaderTitle()}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {/* Status and Time */}
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(currentStatus)}`}>
              {isHistoryView ? <History className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
              {getStatusText(currentStatus)}
            </span>
            
            {!isHistoryView && tradeRequest.timeRemaining && (currentStatus?.toLowerCase() || '') === 'accepted' && (
              <div className="flex items-center gap-1 text-sm text-red-600 font-medium animate-pulse">
                <Clock className="w-4 h-4" />
                <span>Còn {getTimeRemainingText()}</span>
              </div>
            )}
          </div>

          {/* Trade Request Info */}
          <div className={`${isHistoryView ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200' : 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200'} rounded-xl p-4 mb-4 border`}>
            <div className="flex items-center gap-2 mb-2">
              {isHistoryView ? <Calendar className="w-5 h-5 text-gray-600" /> : <Handshake className="w-5 h-5 text-blue-600" />}
              <h3 className={`font-semibold ${isHistoryView ? 'text-gray-900' : 'text-blue-900'}`}>
                {isHistoryView ? 'Thông tin lịch sử' : (isOngoingTrade ? 'Thông tin trao đổi' : 'Thông tin yêu cầu')}
              </h3>
            </div>
            <p className={`text-sm ${isHistoryView ? 'text-gray-800' : 'text-blue-800'} mb-1`}>
              <span className="font-medium">
                {isHistoryView ? 'Đối tác:' : 'Người bán:'}
              </span> {getOwnerName()}
            </p>
            <p className={`text-sm ${isHistoryView ? 'text-gray-700' : 'text-blue-700'}`}>
              <span className="font-medium">
                {isHistoryView ? ((tradeRequest as HistoryItem).completedAt ? 'Hoàn thành:' : 'Thời gian:') : 'Thời gian:'}
              </span> {getTimeSincePosted(getDateTime())}
            </p>
          </div>

          {/* Lock Status - Only show for ongoing trades */}
          {!isHistoryView && isOngoingTrade && (currentStatus?.toLowerCase() || '') === 'accepted' && (
            <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Trạng thái khóa giao dịch
              </h3>
              <Progress value={calculateProgress(tradeRequest.ownerLocked, tradeRequest.requesterLocked)} className="w-full mb-3" />
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {tradeRequest.ownerLocked ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-gray-400" />}
                  <span className={tradeRequest.ownerLocked ? "text-gray-800" : "text-gray-500"}>
                    Chủ sở hữu đã khóa
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {tradeRequest.requesterLocked ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-gray-400" />}
                  <span className={tradeRequest.requesterLocked ? "text-gray-800" : "text-gray-500"}>
                    Bạn đã khóa
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Target Item (What you want) */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {isHistoryView ? 'Sản phẩm đã giao dịch' : 'Sản phẩm bạn muốn'}
            </h3>
            
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                <img
                  src={getItemImage()}
                  alt={getItemName()}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Prevent infinite loop by checking if already using fallback
                    if (e.currentTarget.src !== window.location.origin + '/placeholder-image.jpg') {
                      e.currentTarget.src = '/placeholder-image.jpg';
                    }
                  }}
                />
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-1">
                {getItemName()}
              </h4>
              
              {getItemTier() && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-xs font-medium">
                  <Star className="w-3 h-3" />
                  {getItemTier()}
                </div>
              )}
            </div>
          </div>

          {/* Offered Items (What you're offering) - Only show if not history view or if data exists */}
          {(!isHistoryView || (tradeRequest.offeredItems && tradeRequest.offeredItems.length > 0)) && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                {isHistoryView ? 'Sản phẩm đã đề nghị' : 'Sản phẩm bạn đề nghị'} ({tradeRequest.offeredItems?.length || 0} món)
              </h3>
              
              {tradeRequest.offeredItems && tradeRequest.offeredItems.length > 0 ? (
                <div className="space-y-3">
                  {tradeRequest.offeredItems.map((item: API.OfferedItem, index: number) => (
                    <div key={`offered-${item.inventoryItemId}-${index}`} className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex gap-3">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.itemName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Prevent infinite loop by checking if already using fallback
                              const target = e.currentTarget as HTMLImageElement;
                              if (target.src !== window.location.origin + '/placeholder-image.jpg') {
                                target.src = '/placeholder-image.jpg';
                              }
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
                  <p className="text-gray-600 text-sm">
                    {isHistoryView ? 'Không có thông tin sản phẩm đề nghị' : 'Không có sản phẩm đề nghị'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Status Information - Removed ID field */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Thông tin chi tiết</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Trạng thái:</span>
                <span className="font-medium text-gray-900">
                  {getStatusText(currentStatus)}
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">
                  {isHistoryView ? ((tradeRequest as HistoryItem).completedAt ? 'Hoàn thành:' : 'Thời gian tạo:') : 'Thời gian tạo:'}
                </span>
                <span className="font-medium text-gray-900">
                  {getDateTime() ? new Date(getDateTime()).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Không xác định'}
                </span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Đối tác:</span>
                <span className="font-medium text-gray-900">
                  {getOwnerName()}
                </span>
              </div>
            </div>
          </div>

          {/* Status-based Information - Only show for non-history views */}
          {!isHistoryView && (
            <>
              {(currentStatus?.toLowerCase() || '') === 'pending' && !isOngoingTrade && (
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

              {(currentStatus?.toLowerCase() || '') === 'accepted' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Yêu cầu đã được chấp nhận
                    </span>
                  </div>
                  <p className="text-xs text-blue-700">
                    {isOngoingTrade 
                      ? 'Giao dịch đang được thực hiện. Vui lòng theo dõi trạng thái khóa giao dịch.'
                      : 'Yêu cầu trao đổi đã được chấp nhận. Giao dịch sẽ được bắt đầu.'
                    }
                  </p>
                </div>
              )}

              {(currentStatus?.toLowerCase() || '') === 'rejected' && (
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
            </>
          )}

          {/* History-specific or completed status information */}
          {(isHistoryView || (currentStatus?.toLowerCase() || '') === 'completed') && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {isHistoryView ? 'Giao dịch trong lịch sử' : 'Giao dịch hoàn thành'}
                </span>
              </div>
              <p className="text-xs text-green-700">
                {isHistoryView 
                  ? 'Đây là một giao dịch đã hoàn thành trong quá khứ.'
                  : 'Giao dịch đã được hoàn thành thành công. Cảm ơn bạn đã sử dụng dịch vụ!'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTradeRequestDetail;