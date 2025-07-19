import React from 'react';
import { Heart, MapPin } from 'lucide-react';
import MarketplaceSidebar from '../marketplace/marketplace-sidebar'; // Import sidebar component

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  location: string;
  price?: string;
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
              <MapPin className="w-4 h-4" />
              Dĩ An · 65 km
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:-translate-y-1"
                onClick={() => onProductClick(product)}
              >
                <div className="relative aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
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
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {product.price || 'Liên hệ'}
                  </div>
                  
                  <h3 className="text-sm text-gray-700 mb-3 line-clamp-2 leading-relaxed">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{product.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceUI;