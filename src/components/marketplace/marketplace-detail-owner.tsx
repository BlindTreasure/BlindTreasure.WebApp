'use client'
import React, { useState } from 'react';
import { X, Star, ChevronLeft, ChevronRight, Gift, RefreshCw, Clock, Shield, Loader2, Trash2, User, MessageCircle, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface MyListingItem {
  id: string;
  productName: string;
  productImage: string | string[];
  description?: string;
  status: string;
  isFree: boolean;
  requestedAt: string;
  listedAt: string;
  viewCount?: number;
  tradeRequests?: API.TradeRequest[];
}

interface MyListingDetailProps {
  product: MyListingItem;
  onClose: () => void;
  isLoading?: boolean;
  onDeleteListing?: (productId: string) => Promise<void>;
  onAcceptTradeRequest?: (requestId: string) => Promise<void>;
  onRejectTradeRequest?: (requestId: string) => Promise<void>;
  onConfirmTrade?: (requestId: string) => Promise<void>;
  isAcceptingTradeRequest?: boolean;
  isRejectingTradeRequest?: boolean;
}

const MyListingDetail: React.FC<MyListingDetailProps> = ({ 
  product, 
  onClose, 
  isLoading = false,
  onDeleteListing,
  onAcceptTradeRequest,
  onRejectTradeRequest,
  onConfirmTrade,
  isAcceptingTradeRequest = false,
  isRejectingTradeRequest = false
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(new Set());
  const [isDeletingListing, setIsDeletingListing] = useState(false);
  
  
  // Xử lý hình ảnh - có thể là string hoặc array
  const getImages = () => {
    if (!product.productImage) return [];
    
    if (typeof product.productImage === 'string') {
      return [product.productImage];
    }
    
    if (Array.isArray(product.productImage)) {
      return product.productImage;
    }
    
    return [];
  };

  const images = getImages();

  // Format ngày tháng - Fixed for ISO format
  const getTimeSincePosted = (listedAt: string): string => {
    const now = new Date();
    const posted = new Date(listedAt);
    const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa đăng';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} tuần trước`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} tháng trước`;
  };

  // Hiển thị trạng thái
  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'available':
        return 'Đang hoạt động';
      case 'pending':
        return 'Đang chờ';
      case 'completed':
      case 'sold':
        return 'Đã hoàn thành';
      case 'cancelled':
      case 'inactive':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'available':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'completed':
      case 'sold':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'cancelled':
      case 'inactive':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Handle delete listing - Now uses close listing API
  const handleDeleteListing = async () => {
    if (onDeleteListing) {
      setIsDeletingListing(true);
      try {
        await onDeleteListing(product.id);
        setShowDeleteConfirm(false);
        onClose();
      } catch (error) {
        console.error('Error closing listing:', error);
      } finally {
        setIsDeletingListing(false);
      }
    }
  };

  // Handle accept trade request
  const handleAcceptRequest = async (requestId: string) => {
    if (onAcceptTradeRequest) {
      setProcessingRequests(prev => new Set(prev).add(requestId));
      try {
        await onAcceptTradeRequest(requestId);
      } catch (error) {
        console.error('Error accepting trade request:', error);
      } finally {
        setProcessingRequests(prev => {
          const newSet = new Set(prev);
          newSet.delete(requestId);
          return newSet;
        });
      }
    }
  };

  // Handle reject trade request
  const handleRejectRequest = async (requestId: string) => {
    if (onRejectTradeRequest) {
      setProcessingRequests(prev => new Set(prev).add(requestId));
      try {
        await onRejectTradeRequest(requestId);
      } catch (error) {
        console.error('Error rejecting trade request:', error);
      } finally {
        setProcessingRequests(prev => {
          const newSet = new Set(prev);
          newSet.delete(requestId);
          return newSet;
        });
      }
    }
  };

  // Get trade request status
  const getTradeRequestStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'completed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending':
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getTradeRequestStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'Đã chấp nhận';
      case 'rejected':
        return 'Đã từ chối';
      case 'completed':
        return 'Đã hoàn thành';
      case 'pending':
      default:
        return 'Đang chờ';
    }
  };

  // Get trade requests from props, fallback to empty array
  const tradeRequests = product.tradeRequests || [];

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
        <div className="w-full max-w-md bg-white ml-auto h-full overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <h2 className="text-lg font-semibold text-gray-900">Tin đăng của tôi</h2>
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
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
        <div className="w-full max-w-md bg-white ml-auto h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <h2 className="text-lg font-semibold text-gray-900">Tin đăng của tôi</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Hình ảnh sản phẩm */}
          <div className="relative">
            {images.length > 0 ? (
              <>
                <div className="aspect-square bg-gray-100">
                  <img
                    src={images[currentImageIndex]}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-image.jpg';
                    }}
                  />
                  
                  {/* Navigation arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all disabled:opacity-50"
                        disabled={currentImageIndex === 0}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex(Math.min(images.length - 1, currentImageIndex + 1))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all disabled:opacity-50"
                        disabled={currentImageIndex === images.length - 1}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Image counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                      {currentImageIndex + 1}/{images.length}
                    </div>
                  )}

                  {/* Free/Paid indicator */}
                  <div className="absolute top-3 left-3">
                    {product.isFree ? (
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                        <Gift className="w-3 h-3" />
                        Tặng Free
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                        <RefreshCw className="w-3 h-3" />
                        Đổi chác
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnail images */}
                {images.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto bg-gray-50">
                    {images.map((img, index) => (
                      <button
                        key={`thumbnail-${index}-${img}`}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Không có hình ảnh</p>
                </div>
              </div>
            )}
          </div>

          {/* Thông tin sản phẩm */}
          <div className="p-4">
            {/* Trạng thái và view count */}
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(product.status)}`}>
                <Shield className="w-3 h-3" />
                {getStatusText(product.status)}
              </span>
              
              {product.viewCount !== undefined && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star className="w-4 h-4" />
                  {product.viewCount} lượt xem
                </div>
              )}
            </div>

            {/* Tiêu đề và loại giao dịch */}
            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                {product.productName}
              </h1>
              
              <div className="mb-2">
                {product.isFree ? (
                  <div className="text-2xl font-bold text-emerald-600">
                    Cho tặng miễn phí
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-blue-600">
                    Trao đổi
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Đăng {getTimeSincePosted(product.listedAt)}
              </p>
            </div>

            {/* Action Buttons - Delete/Close */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Quản lý tin đăng</h3>
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeletingListing}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeletingListing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Xóa tin đăng
                  </>
                )}
              </button>
            </div>

            {/* Trade Requests */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Yêu cầu trao đổi ({tradeRequests.length})
              </h3>
              
              {tradeRequests.length > 0 ? (
                <div className="space-y-3">
                  {tradeRequests.map((request) => (
                    <div key={`trade-request-${request.id}`} className="bg-white border border-gray-200 rounded-xl p-4">
                      {/* Requester info */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">
                              {request.requesterName}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTradeRequestStatusColor(request.status)}`}>
                              {getTradeRequestStatusText(request.status)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">
                            {getTimeSincePosted(request.requestedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Lock status */}
                      <div className="mb-3">
                          {(request.ownerLocked || request.requesterLocked) && (
                            <div className="flex items-center gap-2 mt-2">
                              {request.ownerLocked && (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                  <Shield className="w-3 h-3" />
                                  Chủ sở hữu đã khóa
                                </span>
                              )}
                              {request.requesterLocked && (
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                  <Shield className="w-3 h-3" />
                                  Người yêu cầu đã khóa
                                </span>
                              )}
                            </div>
                          )}
                      </div>

                      {/* Offered items */}
                      {request.offeredItems && request.offeredItems.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-600 mb-2 font-medium">Đề nghị trao đổi ({request.offeredItems.length} món):</p>
                          <div className="grid grid-cols-3 gap-2">
                            {request.offeredItems.map((item) => (
                              <div key={`offered-item-${request.id}-${item.inventoryItemId}`} className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                                <div className="aspect-square bg-white rounded-md overflow-hidden mb-2 border border-gray-100">
                                  <img
                                    src={item.imageUrl}
                                    alt={item.itemName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = '/placeholder-image.jpg';
                                    }}
                                  />
                                </div>
                                <p className="text-xs text-gray-700 text-center font-medium leading-tight" title={item.itemName}>
                                  {item.itemName}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action buttons - Updated logic with Accept/Reject */}
                      <div className="space-y-2">
                        {/* Pending status - Show Accept/Reject buttons */}
                        {request.status?.toLowerCase() === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAcceptRequest(request.id)}
                              disabled={processingRequests.has(request.id) || isAcceptingTradeRequest}
                              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                            >
                              {(processingRequests.has(request.id) || isAcceptingTradeRequest) ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4" />
                                  Chấp nhận
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request.id)}
                              disabled={processingRequests.has(request.id) || isRejectingTradeRequest}
                              className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                            >
                              {(processingRequests.has(request.id) || isRejectingTradeRequest) ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4" />
                                  Từ chối
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {/* Completed or Rejected status - Show info only */}
                        {(request.status?.toLowerCase() === 'completed' || request.status?.toLowerCase() === 'rejected') && (
                          <div className={`border rounded-lg p-3 ${
                            request.status?.toLowerCase() === 'completed' 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'bg-red-50 border-red-200'
                          }`}>
                            <p className={`text-xs flex items-center gap-1 ${
                              request.status?.toLowerCase() === 'completed' 
                                ? 'text-blue-700' 
                                : 'text-red-700'
                            }`}>
                              {request.status?.toLowerCase() === 'completed' ? (
                                <>
                                  <CheckCircle className="w-3 h-3" />
                                  Giao dịch đã hoàn thành
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3" />
                                  Yêu cầu đã bị từ chối
                                </>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">Chưa có yêu cầu trao đổi nào</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Yêu cầu trao đổi sẽ hiển thị ở đây khi có người quan tâm đến sản phẩm của bạn
                  </p>
                </div>
              )}
            </div>

            {/* Mô tả */}
            {product.description && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Mô tả chi tiết
                </h3>
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              </div>
            )}

            {/* Thông tin bổ sung */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">Thông tin chi tiết</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600">Loại giao dịch:</span>
                  <span className="font-medium text-gray-900">
                    {product.isFree ? 'Tặng miễn phí' : 'Trao đổi'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600">Ngày đăng:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(product.listedAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="font-medium text-gray-900">
                    {getStatusText(product.status)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-600">Yêu cầu trao đổi:</span>
                  <span className="font-medium text-gray-900">
                    {tradeRequests.length} yêu cầu
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Xóa tin đăng?
              </h3>
              <p className="text-sm text-gray-600">
                Bạn có chắc chắn muốn xóa tin đăng "{product.productName}"? Tin đăng sẽ không còn hiển thị công khai.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeletingListing}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteListing}
                disabled={isDeletingListing}
                className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeletingListing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Xóa tin đăng'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyListingDetail;