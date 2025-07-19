'use client'
import React, { useState } from 'react';
import { X, Heart, Star, MapPin, MessageCircle, Bookmark, Share2, MoreHorizontal, CheckCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviewCount: number;
  location: string;
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
  const images = product.images || [product.image];

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
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                  disabled={currentImageIndex === 0}
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentImageIndex(Math.min(images.length - 1, currentImageIndex + 1))}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
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
          {/* Giá và action buttons */}
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
          </div>

          {/* Tiêu đề */}
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {product.name}
          </h1>

          {/* Đánh giá và vị trí */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-medium">{product.rating}</span>
              <span className="ml-1 text-gray-500">({product.reviewCount})</span>
            </div>
            <div className="flex items-center text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{product.location}</span>
            </div>
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
                {product.seller.yearsActive && (
                  <p className="text-sm text-gray-500">
                    Đã niêm yết 5 tuần trước tại {product.location}
                  </p>
                )}
              </div>
            </div>
            
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Gửi tin nhắn cho người bán
            </button>
          </div>

          {/* Mô tả */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">Mô tả của người bán</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {product.description}
              {product.features && (
                <span>
                  {' '}Các tính năng nổi bật: {product.features.join(', ')}.
                </span>
              )}
            </p>
            <button className="text-blue-600 text-sm mt-1 hover:underline">
              Xem thêm
            </button>
          </div>

          {/* Thông tin bổ sung */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Danh mục:</span>
              <span>{product.category}</span>
            </div>
            {product.condition && (
              <div className="flex justify-between">
                <span className="text-gray-600">Tình trạng:</span>
                <span>{product.condition}</span>
              </div>
            )}
          </div>

          {/* Map placeholder */}
          <div className="mt-6">
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 text-center">{product.location}</p>
          </div>

          {/* Safety notice */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Mặt hàng này còn chưa?</strong> Hãy hỏi người bán trước khi đến xem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMarketplaceDetail;