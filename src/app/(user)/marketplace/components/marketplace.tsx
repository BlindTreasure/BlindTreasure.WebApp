'use client'
import React, { useState } from 'react';
import MarketplaceUI from '@/components/marketplace/marketplace'; // Import component UI
import ProductMarketplaceDetail from '@/components/marketplace/martketplace-detail'; // Import component ProductDetail

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
  images?: string[];
  isFree: boolean;
  desiredItemName?: string;
  status: ListingStatus;
  listedAt: string; // ISO date string
  ownerName: string;
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

// Sample data với structure mới
const sampleProducts: Product[] = [
  {
    id: '1',
    productName: '2018 Toyota Camry 2.5Q full option vàng cát cao cấp',
    description: 'Toyota Camry 2.5Q sản xuất 2018, hỗ trợ trả góp thủ tục đơn giản nhanh gọn, Trao đổi tất cả các dòng xe. Xe trong tình trạng rất tốt, bảo dưỡng định kỳ.',
    productImage: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop'
    ],
    isFree: false,
    desiredItemName: 'Tiền mặt hoặc xe đời mới',
    category: 'Ô tô',
    status: ListingStatus.Available,
    listedAt: '2024-01-15T10:30:00Z',
    ownerName: 'Nguyễn Văn A',
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
    productName: 'Smartphone Gaming Pro',
    description: 'Điện thoại gaming chuyên nghiệp với chip xử lý mạnh mẽ, RAM 12GB, bộ nhớ trong 256GB. Tối ưu cho game thủ.',
    productImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    isFree: true,
    category: 'Điện tử',
    status: ListingStatus.Available,
    listedAt: '2024-01-20T14:15:00Z',
    ownerName: 'Tech Store HN',
    seller: {
      name: 'Tech Store HN',
      isVerified: true,
      yearsActive: 2
    },
    condition: 'Mới 100%'
  },
  {
    id: '3',
    productName: 'Cà Phê Arabica Đặc Biệt',
    description: 'Cà phê Arabica rang xay thủ công, hương vị đậm đà, thơm ngon. Nguồn gốc từ cao nguyên Đà Lạt.',
    productImage: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop',
    isFree: false,
    desiredItemName: 'Trà xanh chất lượng cao',
    category: 'Thực phẩm',
    status: ListingStatus.Available,
    listedAt: '2024-01-18T09:00:00Z',
    ownerName: 'Coffee Dalat Farm',
    seller: {
      name: 'Coffee Dalat Farm',
      isVerified: true,
      yearsActive: 5
    },
    condition: 'Mới'
  },
  {
    id: '4',
    productName: 'Tai Nghe Bluetooth Premium',
    description: 'Tai nghe không dây chất lượng cao, âm thanh sống động, pin kéo dài 30 giờ. Chống ồn chủ động.',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    isFree: true,
    category: 'Điện tử',
    status: ListingStatus.Pending,
    listedAt: '2024-01-22T16:45:00Z',
    ownerName: 'Audio Store',
    seller: {
      name: 'Audio Store',
      isVerified: false,
      yearsActive: 1
    }
  },
  {
    id: '5',
    productName: 'Túi Xách Da Thật',
    description: 'Túi xách da bò thật 100%, thiết kế sang trọng, phù hợp với phong cách công sở và dạo phố.',
    productImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop',
    isFree: false,
    desiredItemName: 'Giày cao gót thời trang',
    category: 'Thời trang',
    status: ListingStatus.Available,
    listedAt: '2024-01-10T11:20:00Z',
    ownerName: 'Fashion House',
    seller: {
      name: 'Fashion House',
      isVerified: true
    }
  },
  {
    id: '6',
    productName: 'Laptop Văn Phòng Cao Cấp',
    description: 'Laptop mỏng nhẹ, hiệu suất cao cho công việc văn phòng. Intel Core i7, RAM 16GB, SSD 512GB.',
    productImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    isFree: true,
    category: 'Điện tử',
    status: ListingStatus.Available,
    listedAt: '2024-01-25T13:30:00Z',
    ownerName: 'Laptop Center',
    seller: {
      name: 'Laptop Center',
      isVerified: true
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
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
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