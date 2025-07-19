'use client'
import React, { useState } from 'react';
import { Search, Filter, Heart, Star, MapPin, X, MessageCircle, Bookmark, Share2, MoreHorizontal, CheckCircle } from 'lucide-react';

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
  price?: string;
  seller: {
    name: string;
    avatar?: string;
    isVerified?: boolean;
    yearsActive?: number;
  };
  condition?: string;
  features?: string[];
}

// Component hiển thị chi tiết sản phẩm
const ProductDetail: React.FC<{ 
  product: Product; 
  onClose: () => void;
  isLiked: boolean;
  onToggleLike: () => void;
}> = ({ product, onClose, isLiked, onToggleLike }) => {
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
            <div className="text-2xl font-bold text-red-600">
              {product.price || '750.000.000 đ'}
            </div>
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

const sampleProducts: Product[] = [
  {
    id: '1',
    name: '2018 Toyota Camry 2.5Q full option vàng cát cao cấp về chỉ sử dụng có hỗ trợ trả góp/ trao đổi các dòng xe',
    description: 'Toyota Camry 2.5Q sản xuất 2018, hỗ trợ trả góp thủ tục đơn giản nhanh gọn, Trao đổi tất cả các dòng xe. Xe trong tình trạng rất tốt, bảo dưỡng định kỳ.',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop'
    ],
    category: 'Ô tô',
    rating: 4.8,
    reviewCount: 124,
    location: 'Quận Gò Vấp',
    price: '750.000.000 đ',
    seller: {
      name: 'Nguyễn Văn A',
      isVerified: true,
      yearsActive: 3
    },
    condition: 'Đã qua sử dụng',
    features: ['Full option', 'Hỗ trợ trả góp', 'Trao đổi xe cũ']
  },
  {
    id: '2',
    name: 'Smartphone Gaming Pro',
    description: 'Điện thoại gaming chuyên nghiệp với chip xử lý mạnh mẽ, RAM 12GB, bộ nhớ trong 256GB. Tối ưu cho game thủ.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    category: 'Điện tử',
    rating: 4.6,
    reviewCount: 89,
    location: 'Hà Nội',
    price: '15.000.000 đ',
    seller: {
      name: 'Tech Store HN',
      isVerified: true,
      yearsActive: 2
    },
    condition: 'Mới 100%'
  },
  {
    id: '3',
    name: 'Cà Phê Arabica Đặc Biệt',
    description: 'Cà phê Arabica rang xay thủ công, hương vị đậm đà, thơm ngon. Nguồn gốc từ cao nguyên Đà Lạt.',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop',
    category: 'Thực phẩm',
    rating: 4.9,
    reviewCount: 156,
    location: 'Đà Lạt',
    price: '200.000 đ',
    seller: {
      name: 'Coffee Dalat Farm',
      isVerified: true,
      yearsActive: 5
    },
    condition: 'Mới'
  },
  {
    id: '4',
    name: 'Tai Nghe Bluetooth Premium',
    description: 'Tai nghe không dây chất lượng cao, âm thanh sống động, pin kéo dài 30 giờ. Chống ồn chủ động.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    category: 'Điện tử',
    rating: 4.7,
    reviewCount: 203,
    location: 'TP. Hồ Chí Minh',
    price: '2.500.000 đ',
    seller: {
      name: 'Audio Store',
      isVerified: false,
      yearsActive: 1
    }
  },
  {
    id: '5',
    name: 'Túi Xách Da Thật',
    description: 'Túi xách da bò thật 100%, thiết kế sang trọng, phù hợp với phong cách công sở và dạo phố.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop',
    category: 'Thời trang',
    rating: 4.5,
    reviewCount: 67,
    location: 'Hà Nội',
    price: '1.200.000 đ',
    seller: {
      name: 'Fashion House',
      isVerified: true
    }
  },
  {
    id: '6',
    name: 'Laptop Văn Phòng Cao Cấp',
    description: 'Laptop mỏng nhẹ, hiệu suất cao cho công việc văn phòng. Intel Core i7, RAM 16GB, SSD 512GB.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    category: 'Điện tử',
    rating: 4.8,
    reviewCount: 145,
    location: 'TP. Hồ Chí Minh',
    price: '25.000.000 đ',
    seller: {
      name: 'Laptop Center',
      isVerified: true
    }
  },
  {
    id: '7',
    name: 'Đồng Hồ Thông Minh',
    description: 'Smartwatch theo dõi sức khỏe, GPS, chống nước, pin 7 ngày. Kết nối với smartphone.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    category: 'Điện tử',
    rating: 4.4,
    reviewCount: 98,
    location: 'Đà Nẵng',
    price: '3.500.000 đ',
    seller: {
      name: 'Smart Tech',
      isVerified: false
    }
  },
  {
    id: '8',
    name: 'Giày Sneaker Limited',
    description: 'Giày thể thao phiên bản giới hạn, thiết kế độc đáo, chất liệu cao cấp. Thoải mái cho mọi hoạt động.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
    category: 'Thời trang',
    rating: 4.6,
    reviewCount: 178,
    location: 'TP. Hồ Chí Minh',
    price: '2.800.000 đ',
    seller: {
      name: 'Sneaker World',
      isVerified: true
    }
  },
  {
    id: '9',
    name: 'Máy Ảnh Mirrorless',
    description: 'Máy ảnh không gương lật, cảm biến APS-C, quay video 4K. Phù hợp cho nhiếp ảnh gia.',
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
    category: 'Điện tử',
    rating: 4.9,
    reviewCount: 87,
    location: 'Hà Nội',
    price: '18.000.000 đ',
    seller: {
      name: 'Camera Pro',
      isVerified: true
    }
  },
  {
    id: '10',
    name: 'Balo Du Lịch Chống Thấm',
    description: 'Balo du lịch chống thấm nước, nhiều ngăn tiện lợi, phù hợp cho các chuyến đi dài.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    category: 'Du lịch',
    rating: 4.3,
    reviewCount: 134,
    location: 'Cần Thơ',
    price: '850.000 đ',
    seller: {
      name: 'Travel Gear',
      isVerified: false
    }
  }
];

const categories = ['Tất cả', 'Thời trang', 'Điện tử', 'Thực phẩm', 'Du lịch', 'Ô tô'];

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleLike = (productId: string) => {
    const newLikedItems = new Set(likedItems);
    if (newLikedItems.has(productId)) {
      newLikedItems.delete(productId);
    } else {
      newLikedItems.add(productId);
    }
    setLikedItems(newLikedItems);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-28">
      <div className="pt-8 container mx-auto px-4 sm:px-6 lg:px-20 xl:px-20 2xl:px-20">
        {/* Search Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
            <div className="w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Danh mục:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => handleProductClick(product)}
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
                    toggleLike(product.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
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
              
              <div className="p-3">
                <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2 leading-tight">
                  {product.name}
                </h3>
                
                <p className="text-gray-600 text-xs mb-2 line-clamp-2 leading-tight">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 font-medium">
                      {product.rating}
                    </span>
                    <span className="ml-1">
                      ({product.reviewCount})
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{product.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-500">
              Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc của bạn
            </p>
          </div>
        )}

        {/* Pagination placeholder */}
        {filteredProducts.length > 0 && (
          <div className="mt-8 mb-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                Trước
              </button>
              <span className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg">1</span>
              <button className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Detail Sidebar */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          isLiked={likedItems.has(selectedProduct.id)}
          onToggleLike={() => toggleLike(selectedProduct.id)}
        />
      )}
    </div>
  );
}