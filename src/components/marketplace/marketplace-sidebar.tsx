import React from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Settings, Bell, Archive, ShoppingBag, Plus, ChevronRight, Filter, X, Gift, RefreshCw, CheckCircle, XCircle, Package, Clock } from 'lucide-react';

// Updated enum to match the provided definition
enum ListingStatus {
  Available = 'Available',
  Pending = 'Pending',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

interface MarketplaceSidebarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  title?: string;
  searchPlaceholder?: string;
  // Props for isFree filter
  isFreeFilter?: boolean | null; // null = all, true = free only, false = paid only
  onIsFreeChange?: (isFree: boolean | null) => void;
  // Navigation props
  activeSection?: string; // 'all' | 'notifications' | 'buying' | 'selling'
  onNavigationChange?: (section: string, params?: any) => void;
}

const MarketplaceSidebar: React.FC<MarketplaceSidebarProps> = ({
  searchTerm,
  onSearchChange,
  title = "Marketplace",
  searchPlaceholder = "Tìm kiếm trên Marketplace",
  isFreeFilter = null,
  onIsFreeChange,
  activeSection = 'all',
  onNavigationChange
}) => {
  const router = useRouter();

  // Navigate to create listing page
  const handleCreateListing = () => {
    router.push('/marketplace/create');
  };

  // Clear all filters
  const clearFilters = () => {
    onSearchChange('');
    if (onIsFreeChange) {
      onIsFreeChange(null);
    }
  };

  // Handle navigation click
  const handleNavigationClick = (section: string, params?: any) => {
    if (section === 'notifications') {
      // Thông báo chức năng chưa được triển khai
      alert('Chức năng thông báo đang được phát triển');
      return;
    }
    
    if (onNavigationChange) {
      onNavigationChange(section, params);
    }
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm !== '' || isFreeFilter !== null;

  return (
    <div className="w-80 bg-white shadow-lg border-r border-gray-200 fixed h-full left-0 top-0 flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white z-10 pt-36">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              {title}
            </h1>
            <Settings className="w-6 h-6 text-gray-400 cursor-pointer hover:text-blue-500 transition-colors" />
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Search */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="pl-12 pr-10 py-3 w-full bg-gray-50 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:shadow-md transition-all"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Price Filter - isFree */}
        {onIsFreeChange && (
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Loại sản phẩm
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => onIsFreeChange(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all font-medium flex items-center gap-2 ${
                  isFreeFilter === null
                    ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-sm border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                Tất cả
              </button>
              
              <button
                onClick={() => onIsFreeChange(true)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all font-medium flex items-center gap-2 ${
                  isFreeFilter === true
                    ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 shadow-sm border border-emerald-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Gift className="w-4 h-4 text-emerald-500" />
                Miễn phí
              </button>
              
              <button
                onClick={() => onIsFreeChange(false)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all font-medium flex items-center gap-2 ${
                  isFreeFilter === false
                    ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-sm border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <RefreshCw className="w-4 h-4 text-blue-500" />
                Trao đổi
              </button>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <div className="py-3">
          {/* Lướt xem tất cả */}
          <div className="px-6 py-2">
            <div 
              onClick={() => handleNavigationClick('all')}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                activeSection === 'all'
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 shadow-sm'
                  : 'hover:bg-blue-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all ${
                activeSection === 'all'
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                  : 'bg-gradient-to-br from-gray-100 to-gray-200'
              }`}>
                <Archive className={`w-5 h-5 ${
                  activeSection === 'all' ? 'text-white' : 'text-gray-600'
                }`} />
              </div>
              <span className={`text-sm font-semibold ${
                activeSection === 'all' ? 'text-gray-900' : 'text-gray-700'
              }`}>
                Lướt xem tất cả
              </span>
            </div>
          </div>

          {/* Thông báo - Currently not implemented */}
          <div className="px-6 py-1">
            <div 
              onClick={() => handleNavigationClick('notifications')}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                activeSection === 'notifications'
                  ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500 shadow-sm'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                activeSection === 'notifications'
                  ? 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-md'
                  : 'bg-gradient-to-br from-orange-100 to-orange-200'
              }`}>
                <Bell className={`w-5 h-5 ${
                  activeSection === 'notifications' ? 'text-white' : 'text-orange-600'
                }`} />
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-medium ${
                  activeSection === 'notifications' ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  Thông báo
                </span>
                <span className="text-xs text-gray-400">Đang phát triển</span>
              </div>
            </div>
          </div>

          {/* Đang trao đổi */}
          <div className="px-6 py-1">
            <div 
              onClick={() => handleNavigationClick('buying')}
              className={`flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                activeSection === 'buying'
                  ? 'bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500 shadow-sm'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  activeSection === 'buying'
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-md'
                    : 'bg-gradient-to-br from-purple-100 to-purple-200'
                }`}>
                  <ShoppingBag className={`w-5 h-5 ${
                    activeSection === 'buying' ? 'text-white' : 'text-purple-600'
                  }`} />
                </div>
                <span className={`text-sm font-medium ${
                  activeSection === 'buying' ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  Đang trao đổi
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 ${
                activeSection === 'buying' ? 'text-purple-500' : 'text-gray-400'
              }`} />
            </div>
          </div>

          {/* Bán hàng */}
          <div className="px-6 py-1">
            <div 
              onClick={() => handleNavigationClick('selling', { IsOwnerListings: true })}
              className={`flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                activeSection === 'selling'
                  ? 'bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 shadow-sm'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  activeSection === 'selling'
                    ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-md'
                    : 'bg-gradient-to-br from-red-100 to-red-200'
                }`}>
                  <ShoppingBag className={`w-5 h-5 ${
                    activeSection === 'selling' ? 'text-white' : 'text-red-600'
                  }`} />
                </div>
                <span className={`text-sm font-medium ${
                  activeSection === 'selling' ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  Bán hàng
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 ${
                activeSection === 'selling' ? 'text-red-500' : 'text-gray-400'
              }`} />
            </div>
          </div>
        </div>

        {/* Create New Listing */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button 
            onClick={handleCreateListing}
            className="flex items-center gap-3 w-full p-3 text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-semibold">Tạo bài niêm yết mới</span>
          </button>
        </div>

        {/* Footer spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  );
};

export default MarketplaceSidebar;