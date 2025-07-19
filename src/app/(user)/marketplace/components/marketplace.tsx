'use client'
import React, { useState } from 'react';
import MarketplaceUI from '@/components/marketplace/marketplace'; // Import component UI
import ProductMarketplaceDetail from '@/components/marketplace/martketplace-detail'; // Import component ProductDetail

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

// Sample data
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
    seller: {
      name: 'Travel Gear',
      isVerified: false
    }
  }
];

const categories = ['Tất cả', 'Thời trang', 'Điện tử', 'Thực phẩm', 'Du lịch', 'Ô tô'];

interface MarketplaceProps {
  // Props tùy chỉnh có thể truyền từ bên ngoài
  customTitle?: string;
  customCategories?: string[];
  customProducts?: Product[];
  onProductSelect?: (product: Product) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({
  customTitle,
  customCategories,
  customProducts,
  onProductSelect
}) => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sử dụng dữ liệu tùy chỉnh hoặc mặc định
  const products = customProducts || sampleProducts;
  const categoryList = customCategories || categories;

  // Logic xử lý
  const filteredProducts = products.filter(product => {
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
    // Callback để component cha có thể xử lý thêm
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <>
      {/* Sử dụng component UI đã tách */}
      <MarketplaceUI
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categories={categoryList}
        filteredProducts={filteredProducts}
        likedItems={likedItems}
        onToggleLike={toggleLike}
        onProductClick={handleProductClick}
        title={customTitle || "Marketplace"}
        searchPlaceholder="Tìm kiếm sản phẩm..."
      />

      {/* Product Detail Sidebar */}
      {selectedProduct && (
        <ProductMarketplaceDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          isLiked={likedItems.has(selectedProduct.id)}
          onToggleLike={() => toggleLike(selectedProduct.id)}
        />
      )}
    </>
  );
};

export default Marketplace;