'use client'
import React, { useState, useEffect } from 'react';
import { X, Heart, Star, MessageCircle, ChevronLeft, ChevronRight, Gift, RefreshCw, Clock, Shield, Loader2, ArrowRightLeft } from 'lucide-react';
import { API } from "@/services/listing/typings";
import TradeRequestModal from '@/components/trading/trading-modal';
import useGetAllAvailableItem from '@/app/(user)/marketplace/create/hooks/useGetAllAvailableItem';

interface ProductDetailProps {
  product: API.ListingItem;
  onClose: () => void;
  isLiked: boolean;
  onToggleLike: () => void;
  isLoading?: boolean;
  onCreateTradeRequest?: (offeredInventoryIds: string[]) => Promise<void>;
  isCreatingTradeRequest?: boolean;
}

const ProductMarketplaceDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  onClose, 
  isLiked, 
  onToggleLike,
  isLoading = false,
  onCreateTradeRequest,
  isCreatingTradeRequest = false
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [userItems, setUserItems] = useState<API.AvailableItem[]>([]);
  const [isSubmittingFreeRequest, setIsSubmittingFreeRequest] = useState(false);
    
  // Sử dụng hook để lấy available items
  const { isPending: isLoadingUserItems, getAllAvailableItemApi } = useGetAllAvailableItem();
  
  // Fetch user items khi component mount hoặc khi mở trade modal
  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        const response = await getAllAvailableItemApi();
        if (response && response.value.data) {
          setUserItems(response.value.data);
        }
      } catch (error) {
        console.error('Error fetching user items:', error);
        setUserItems([]);
      }
    };

    // Chỉ fetch khi cần thiết (khi mở trade modal)
    if (showTradeModal) {
      fetchUserItems();
    }
  }, [showTradeModal, getAllAvailableItemApi]);
  
  // Xử lý hình ảnh - có thể là string hoặc array
  const getImages = () => {
    if (!product.productImage) return [];
    
    // Nếu productImage là string, convert thành array
    if (typeof product.productImage === 'string') {
      return [product.productImage];
    }
    
    // Nếu đã là array
    if (Array.isArray(product.productImage)) {
      return product.productImage;
    }
    
    return [];
  };

  const images = getImages();

  // Format ngày tháng
  const getTimeSincePosted = (listedAt: string): string => {
    try {
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
    } catch (error) {
      return 'Không xác định';
    }
  };

  // Hiển thị trạng thái
  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'available':
        return 'Còn hàng';
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

  // Handle trade request
  const handleTradeRequest = async () => {
    if (product.isFree) {
      // Xử lý yêu cầu nhận miễn phí - gửi array rỗng cho free items
      if (onCreateTradeRequest) {
        setIsSubmittingFreeRequest(true);
        try {
          await onCreateTradeRequest([]);
          // Thông báo thành công sẽ được xử lý bởi hook trong parent component
        } catch (error) {
          console.error('Error requesting free item:', error);
          // Error toast sẽ được xử lý bởi hook trong parent component
        } finally {
          setIsSubmittingFreeRequest(false);
        }
      }
    } else {
      // Mở modal trade request cho item trao đổi
      setShowTradeModal(true);
    }
  };

  // Handle trade request submission từ modal
  const handleSubmitTradeRequest = async (data: {
    targetProductId: string;
    offeredItemIds?: string[];
    message?: string;
  }) => {
    if (onCreateTradeRequest && data.offeredItemIds) {
      try {
        await onCreateTradeRequest(data.offeredItemIds);
        setShowTradeModal(false); // Đóng modal sau khi submit thành công
        // Success toast sẽ được xử lý bởi hook trong parent component
      } catch (error) {
        console.error('Error creating trade request:', error);
        // Error toast sẽ được xử lý bởi hook trong parent component
        // Không đóng modal để user có thể thử lại
      }
    }
  };

  // Determine if any request is in progress
  const isAnyRequestInProgress = isSubmittingFreeRequest || isCreatingTradeRequest;

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
        <div className="w-full max-w-md bg-white ml-auto h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <h2 className="text-lg font-semibold text-gray-900">Chi tiết sản phẩm</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Loading content */}
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
        {/* Sidebar chi tiết sản phẩm */}
        <div className="w-full max-w-md bg-white ml-auto h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <h2 className="text-lg font-semibold text-gray-900">Chi tiết sản phẩm</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isAnyRequestInProgress}
            >
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
                      e.currentTarget.src = '/placeholder-image.jpg'; // Fallback image
                    }}
                  />
                  
                  {/* Navigation arrows for multiple images */}
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
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt="" 
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
            {/* Action buttons và trạng thái */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-1">
                <button
                  onClick={onToggleLike}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={isAnyRequestInProgress}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>
              
              {/* Trạng thái */}
              <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(product.status)}`}>
                <Shield className="w-3 h-3" />
                {getStatusText(product.status)}
              </span>
            </div>

            {/* Tiêu đề và loại giao dịch */}
            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                {product.productName}
              </h1>
              
              {/* Loại giao dịch */}
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
            </div>

            {/* Thông tin người bán */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center overflow-hidden">
                  {product.avatarUrl ? (
                    <img
                      src={product.avatarUrl}
                      alt={product.ownerName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initial when avatar fails to load
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <span 
                    className="text-lg font-bold text-blue-600 w-full h-full flex items-center justify-center"
                    style={{ display: product.avatarUrl ? 'none' : 'flex' }}
                  >
                    {product.ownerName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {product.ownerName || 'Người dùng'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getTimeSincePosted(product.listedAt)}
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-2">
                <button 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isAnyRequestInProgress}
                >
                  <MessageCircle className="w-4 h-4" />
                  Gửi tin nhắn cho {product.ownerName || 'người bán'}
                </button>
                
                {/* Trade Request Button */}
                <button 
                  onClick={handleTradeRequest}
                  disabled={isAnyRequestInProgress || (isLoadingUserItems && !product.isFree)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    product.isFree 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                  }`}
                >
                  {isAnyRequestInProgress ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {product.isFree ? 'Đang gửi yêu cầu...' : 'Đang xử lý...'}
                    </>
                  ) : (isLoadingUserItems && !product.isFree) ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang tải...
                    </>
                  ) : product.isFree ? (
                    <>
                      <Gift className="w-4 h-4" />
                      Yêu cầu nhận miễn phí
                    </>
                  ) : (
                    <>
                      <ArrowRightLeft className="w-4 h-4" />
                      Tạo yêu cầu trao đổi
                    </>
                  )}
                </button>
              </div>
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
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Request Modal */}
      {showTradeModal && !product.isFree && (
        <TradeRequestModal
          isOpen={showTradeModal}
          onClose={() => setShowTradeModal(false)}
          targetProduct={{
            id: product.id,
            productName: product.productName,
            ownerName: product.ownerName || 'Người dùng',
            productImage: product.productImage
          }}
          userItems={userItems}
          onSubmitTradeRequest={handleSubmitTradeRequest}
          isLoading={isLoadingUserItems || isCreatingTradeRequest}
        />
      )}
    </>
  );
};

export default ProductMarketplaceDetail;