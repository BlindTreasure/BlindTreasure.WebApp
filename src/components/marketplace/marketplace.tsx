import React from 'react';
import { Heart, Clock, Gift, RefreshCw } from 'lucide-react';
import MarketplaceSidebar from '../marketplace/marketplace-sidebar'; // Import sidebar component

enum ListingStatus {
  Available = 'Available',
  Pending = 'Pending',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

interface Product {
  id: string;
  productName: string;
  description?: string;
  productImage: string;
  isFree: boolean;
  desiredItemName?: string;
  status: ListingStatus;
  listedAt: string;
  ownerName: string;
  category: string;
  seller: {
    name: string;
    avatar?: string;
    isVerified?: boolean;
    yearsActive?: number;
  };
}

interface MarketplaceUIProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  filteredProducts: Product[];
  likedItems: Set<string>;
  onToggleLike: (productId: string) => void;
  onProductClick: (product: Product) => void;
  title?: string;
  searchPlaceholder?: string;
}

const MarketplaceUI: React.FC<MarketplaceUIProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  filteredProducts,
  likedItems,
  onToggleLike,
  onProductClick,
  title = "Marketplace",
  searchPlaceholder = "Tìm kiếm trên Marketplace"
}) => {
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

  return (
    <div className="flex min-h-screen bg-gray-50 pt-32">
      {/* Sidebar Component */}
      <MarketplaceSidebar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        categories={categories}
        title={title}
        searchPlaceholder={searchPlaceholder}
      />

      {/* Main Content */}
      <div className="flex-1 ml-80">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Lựa chọn hôm nay</h2>
            <p className="text-gray-500 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Cập nhật gần đây
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:-translate-y-1 relative"
                onClick={() => onProductClick(product)}
              >
                <div className="relative aspect-square">
                  <img
                    src={product.productImage}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Free/Paid indicator */}
                  <div className="absolute top-3 left-3">
                    {product.isFree ? (
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
                        <Gift className="w-3 h-3" />
                        Tặng Free
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
                        <RefreshCw className="w-3 h-3" />
                        Đổi chác
                      </div>
                    )}
                  </div>

                  {/* Heart button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLike(product.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        likedItems.has(product.id)
                          ? 'text-red-500 fill-red-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="p-4">
                  {/* Price/Exchange info */}
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {product.isFree ? (
                      <span className="text-emerald-600">Cho tặng</span>
                    ) : (
                      <span className="text-blue-600">
                        {product.desiredItemName || 'Trao đổi'}
                      </span>
                    )}
                  </div>
                  
                  {/* Product name */}
                  <h3 className="text-sm text-gray-700 mb-3 line-clamp-2 leading-relaxed">
                    {product.productName}
                  </h3>
                  
                  {/* Owner and time */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="truncate">{product.ownerName}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getTimeSincePosted(product.listedAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No results message */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
              <p className="text-gray-400 text-sm mt-2">Thử thay đổi từ khóa tìm kiếm hoặc danh mục</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceUI;