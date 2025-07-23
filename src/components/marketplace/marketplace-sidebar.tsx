import React from 'react';
import { Search, Heart, MapPin, Settings, Bell, Archive, Shield, ShoppingBag, Plus, ChevronRight } from 'lucide-react';

interface MarketplaceSidebarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  title?: string;
  searchPlaceholder?: string;
}

const MarketplaceSidebar: React.FC<MarketplaceSidebarProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  title = "Marketplace",
  searchPlaceholder = "Tìm kiếm trên Marketplace"
}) => {
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
              className="pl-12 pr-4 py-3 w-full bg-gray-50 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:shadow-md transition-all"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="py-3">
          <div className="px-6 py-2">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 cursor-pointer bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <Archive className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Lướt xem tất cả</span>
            </div>
          </div>

          <div className="px-6 py-1">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-sm text-gray-700 font-medium">Thông báo</span>
            </div>
          </div>

          <div className="px-6 py-1">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <Archive className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-700 font-medium">Hộp thư</span>
            </div>
          </div>

          <div className="px-6 py-1">
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium">Đang mua</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="px-6 py-1">
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium">Bán hàng</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Create New Listing */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button className="flex items-center gap-3 w-full p-3 text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl transition-all shadow-md hover:shadow-lg">
            <Plus className="w-5 h-5" />
            <span className="text-sm font-semibold">Tạo bài niêm yết mới</span>
          </button>
        </div>

        {/* Categories */}
        <div className="px-6 py-4 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Hạng mục</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(  category)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all font-medium ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-sm border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceSidebar;