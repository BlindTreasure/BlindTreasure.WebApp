import React from 'react';
import { Clock, Gift, RefreshCw, Loader2, ChevronLeft, ChevronRight, CheckCircle, XCircle, Package, History } from 'lucide-react';
import MarketplaceSidebar from '../marketplace/marketplace-sidebar';
import {API} from "@/services/listing/typings"
import { ListingStatus } from "@/const/listing"

interface MarketplaceUIProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filteredProducts: API.ListingItem[];
  likedItems: Set<string>;
  onToggleLike: (productId: string) => void;
  onProductClick: (product: API.ListingItem) => void;
  title?: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
  totalItems?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  // New props for isFree filter
  isFreeFilter?: boolean | null;
  onIsFreeChange?: (isFree: boolean | null) => void;
  // Navigation props
  activeSection?: string; // 'all' | 'transaction-history' | 'buying' | 'selling'
  onNavigationChange?: (section: string, params?: any) => void;
  onOpenGuideDialog?: () => void;
}

const MarketplaceUI: React.FC<MarketplaceUIProps> = ({
  searchTerm,
  onSearchChange,
  filteredProducts,
  likedItems,
  onToggleLike,
  onProductClick,
  title = "Marketplace",
  searchPlaceholder = "Tìm kiếm trên Marketplace",
  isLoading = false,
  totalItems = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  isFreeFilter = null,
  onIsFreeChange,
  activeSection = 'all',
  onNavigationChange,
  onOpenGuideDialog,
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

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'active':
      case ListingStatus.Active:
        return { text: 'Có sẵn', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
      case 'sold':
      case ListingStatus.Sold:
        return { text: 'Đã bán', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: XCircle };
      case 'pending':
      case ListingStatus.Expired:
        return { text: 'Hết hạn', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Package };
      case ListingStatus.Cancelled:
        return { text: 'Đã hủy', color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle };
      default:
        return { text: status, color: 'text-gray-600', bgColor: 'bg-gray-100', icon: Package };
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  // Get filter description for header
  const getFilterDescription = () => {
    const filters = [];
    
    // Add section-specific description
    if (activeSection === 'selling') {
      filters.push('Sản phẩm của tôi');
    } else if (activeSection === 'buying') {
      filters.push('Đang trao đổi');
    } else if (activeSection === 'transaction-history') {
      filters.push('Lịch sử giao dịch');
    } else if (activeSection === 'inbox') {
      filters.push('Hộp thư');
    }
    
    if (isFreeFilter === true) {
      filters.push('Miễn phí');
    } else if (isFreeFilter === false) {
      filters.push('Trao đổi');
    }
    
    if (searchTerm) {
      filters.push(`Tìm kiếm: "${searchTerm}"`);
    }
    
    return filters.length > 0 ? ` - ${filters.join(', ')}` : '';
  };

  // Get header title based on active section
  const getHeaderTitle = () => {
    switch (activeSection) {
      case 'selling':
        return 'Sản phẩm của tôi';
      case 'buying':
        return 'Đang trao đổi';
      case 'transaction-history':
        return 'Lịch sử giao dịch';
      case 'inbox':
        return 'Hộp thư';
      default:
        return 'Lựa chọn hôm nay';
    }
  };

  // Show transaction history placeholder when in transaction-history section
  const showTransactionHistoryPlaceholder = activeSection === 'transaction-history' && filteredProducts.length === 0 && !isLoading;

  return (
    <div className="flex min-h-screen bg-gray-50 pt-32">
      {/* Sidebar Component */}
      <MarketplaceSidebar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        title={title}
        searchPlaceholder={searchPlaceholder}
        isFreeFilter={isFreeFilter}
        onIsFreeChange={onIsFreeChange}
        activeSection={activeSection}
        onNavigationChange={onNavigationChange}
        onOpenGuideDialog={onOpenGuideDialog}
      />

      {/* Main Content */}
      <div className="flex-1 ml-80">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {getHeaderTitle()}{getFilterDescription()}
            </h2>
            <div className="flex items-center justify-between">
              <p className="text-gray-500 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {activeSection === 'transaction-history' ? 'Giao dịch gần đây' : 'Cập nhật gần đây'}
              </p>
              {totalItems > 0 && (
                <p className="text-sm text-gray-500">
                  Hiển thị {startItem}-{endItem} của {totalItems} {activeSection === 'transaction-history' ? 'giao dịch' : 'sản phẩm'}
                </p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          {!isLoading && totalItems > 0 && activeSection !== 'transaction-history' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trao đổi</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {filteredProducts.filter(p => !p.isFree).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Gift className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Miễn phí</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {filteredProducts.filter(p => p.isFree).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transaction History Stats - Special stats for transaction history */}
          {!isLoading && totalItems > 0 && activeSection === 'transaction-history' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hoàn thành</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {filteredProducts.filter(p => p.status === 'completed' || p.status === 'sold').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Đang xử lý</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {filteredProducts.filter(p => p.status === 'pending' || p.status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <History className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tổng giao dịch</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {totalItems}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600">Đang tải...</span>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && !showTransactionHistoryPlaceholder && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map((product) => {
                const statusDisplay = getStatusDisplay(product.status);
                const StatusIcon = statusDisplay.icon;

                return (
                  <div 
                    key={product.inventoryId} 
                    className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:-translate-y-1 relative"
                    onClick={() => onProductClick(product)}
                  >
                    <div className="relative aspect-square">
                      <img
                        src={product.productImage}
                        alt={product.productName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      
                      {/* Free/Paid indicator */}
                      <div className="absolute top-3 left-3">
                        {product.isFree ? (
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
                            <Gift className="w-3 h-3" />
                            Miễn phí
                          </div>
                        ) : (
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm">
                            <RefreshCw className="w-3 h-3" />
                            Trao đổi
                          </div>
                        )}
                      </div>

                      {/* Status indicator */}
                      <div className="absolute bottom-3 left-3">
                        <div className={`${statusDisplay.bgColor} ${statusDisplay.color} px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusDisplay.text}
                        </div>
                      </div>
            
                      {/* Transaction History specific info */}
                      {activeSection === 'transaction-history' && (
                        <div className="absolute top-3 right-3">
                          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                            <History className="w-3 h-3 inline mr-1" />
                            Giao dịch
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
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
                );
              })}
            </div>
          )}

          {/* Transaction History Placeholder */}
          {showTransactionHistoryPlaceholder && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-12 h-12 text-green-600" />
              </div>
              <p className="text-gray-500 text-lg">Chưa có giao dịch nào</p>
              <p className="text-gray-400 text-sm mt-2">
                Lịch sử giao dịch của bạn sẽ hiển thị tại đây khi bạn có giao dịch
              </p>
            </div>
          )}

          {/* No results message for other sections */}
          {!isLoading && filteredProducts.length === 0 && activeSection !== 'transaction-history' && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
              <p className="text-gray-400 text-sm mt-2">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && onPageChange && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Trước
              </button>

              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    pageNum === currentPage
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceUI;