'use client'
import React, { useState } from 'react';
import { X, Heart, Star, MapPin, MessageCircle, Bookmark, Share2, MoreHorizontal, CheckCircle } from 'lucide-react';

enum ListingStatus {
  Available = 'Available',
  Pending = 'Pending',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

interface Product {
  id: string;
  productName: string; // Đổi từ 'name' thành 'productName'
  description?: string; // Thêm optional
  productImage: string; // Đổi từ 'image' thành 'productImage'
  images?: string[];
  isFree: boolean; // Thêm thuộc tính này
  desiredItemName?: string; // Thêm thuộc tính này
  status: ListingStatus; // Thêm thuộc tính này
  listedAt: string; // Thêm thuộc tính này - ISO date string
  ownerName: string; // Thêm thuộc tính này
  category: string;
  seller: {
    name: string;
    avatar?: string;
    isVerified?: boolean;
    yearsActive?: number;
  };
  condition?: string;
  features?: string[];
}

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  isLiked: boolean;
  onToggleLike: () => void;
}

const ProductMarketplaceDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  onClose, 
  isLiked, 
  onToggleLike 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images || [product.productImage]; // Sử dụng productImage thay vì image

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.ceil(diffDays / 7);
    
    if (diffWeeks < 1) {
      return `${diffDays} ngày trước`;
    }
    return `${diffWeeks} tuần trước`;
  };

  // Hiển thị trạng thái
  const getStatusText = (status: ListingStatus) => {
    switch (status) {
      case ListingStatus.Available:
        return 'Còn hàng';
      case ListingStatus.Pending:
        return 'Đang chờ';
      case ListingStatus.Completed:
        return 'Đã hoàn thành';
      case ListingStatus.Cancelled:
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status: ListingStatus) => {
    switch (status) {
      case ListingStatus.Available:
        return 'text-green-600 bg-green-50';
      case ListingStatus.Pending:
        return 'text-yellow-600 bg-yellow-50';
      case ListingStatus.Completed:
        return 'text-blue-600 bg-blue-50';
      case ListingStatus.Cancelled:
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      {/* Sidebar chi tiết sản phẩm */}
      <div className="w-full max-w-md bg-white ml-auto h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Chi tiết sản phẩm</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hình ảnh sản phẩm */}
        <div className="relative">
          <div className="aspect-square bg-gray-100">
            <img
              src={images[currentImageIndex]}
              alt={product.productName}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
                  disabled={currentImageIndex === 0}
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentImageIndex(Math.min(images.length - 1, currentImageIndex + 1))}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
                  disabled={currentImageIndex === images.length - 1}
                >
                  →
                </button>
              </>
            )}
          </div>

          {/* Thumbnail images */}
          {images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Thông tin sản phẩm */}
        <div className="p-4">
          {/* Action buttons */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <button
                onClick={onToggleLike}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'
                  }`}
                />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Bookmark className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Share2 className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            {/* Trạng thái */}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
              {getStatusText(product.status)}
            </span>
          </div>

          {/* Tiêu đề */}
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {product.productName}
          </h1>

          {/* Loại giao dịch */}
          <div className="mb-3">
            {product.isFree ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Miễn phí
              </span>
            ) : (
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Trao đổi
                </span>
                {product.desiredItemName && (
                  <p className="text-sm text-gray-600 mt-1">
                    Mong muốn: {product.desiredItemName}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Thông tin người bán */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                {product.seller.avatar ? (
                  <img
                    src={product.seller.avatar}
                    alt={product.seller.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium">
                    {product.seller.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{product.seller.name}</span>
                  {product.seller.isVerified && (
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  Đã đăng {formatDate(product.listedAt)}
                  {product.seller.yearsActive && ` • Hoạt động ${product.seller.yearsActive} năm`}
                </p>
              </div>
            </div>
            
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Gửi tin nhắn cho {product.ownerName}
            </button>
          </div>

          {/* Mô tả */}
          {product.description && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Mô tả chi tiết</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {product.description}
                {product.features && product.features.length > 0 && (
                  <span>
                    {' '}Đặc điểm nổi bật: {product.features.join(', ')}.
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Thông tin bổ sung */}
          <div className="space-y-2 text-sm border-t pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Danh mục:</span>
              <span className="font-medium">{product.category}</span>
            </div>
            {product.condition && (
              <div className="flex justify-between">
                <span className="text-gray-600">Tình trạng:</span>
                <span className="font-medium">{product.condition}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày đăng:</span>
              <span className="font-medium">{new Date(product.listedAt).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ID sản phẩm:</span>
              <span className="font-mono text-xs">{product.id}</span>
            </div>
          </div>

          {/* Safety notice */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Lời khuyên an toàn:</strong> Luôn gặp mặt trực tiếp tại nơi công cộng và kiểm tra kỹ sản phẩm trước khi giao dịch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMarketplaceDetail;