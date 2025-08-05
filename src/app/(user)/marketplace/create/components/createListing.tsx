'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import {X, Camera, Search, Package, User } from 'lucide-react';
import useGetAllAvailableItem from "../hooks/useGetAllAvailableItem";
import { useServiceCreateListing } from "@/services/listing/services";
import {API} from "@/services/listing/typings";

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: API.AvailableItem) => void;
  items: API.AvailableItem[];
  isLoading: boolean;
}

const InventoryModal: React.FC<InventoryModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectItem, 
  items,
  isLoading 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredInventory = items.filter(item =>
    item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.productId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Chọn sản phẩm từ kho</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-96">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Đang tải...</span>
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              {searchTerm ? 'Không tìm thấy sản phẩm phù hợp' : 'Chưa có sản phẩm nào trong kho'}
            </div>
          ) : (
            filteredInventory.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.productName || 'Product'}
                      className="w-16 h-16 object-cover rounded-lg"
                      onLoad={() => console.log('✅ Image loaded successfully for:', item.productName)}
                      onError={(e) => {
                        console.error('❌ Image failed to load for:', item.productName, 'URL:', item.image);
                        console.error('Error details:', e);
                      }}
                    />
                  ) : (
                    <>
                      <Package className="text-gray-400" size={24} />
                      {console.log('📦 No image for item:', item.productName, 'Image value:', item.image)}
                    </>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {item.productName || `Product ${item.productId.slice(0, 8)}...`}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.isFromBlindBox ? 'Từ Blind Box' : item.location || 'Sản phẩm'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    {item.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const MarketplaceListing: React.FC = () => {
  const router = useRouter();
  
  // Get user info from Redux store
  const { avatarUrl, fullName } = useSelector((state : any) => state.userSlice.user);
  
  const [selectedItem, setSelectedItem] = useState<API.AvailableItem | null>(null);
  const [description, setDescription] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [desiredItemName, setDesiredItemName] = useState('');
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [availableItems, setAvailableItems] = useState<API.AvailableItem[]>([]);

  const { isPending, getAllAvailableItemApi } = useGetAllAvailableItem();
  const createListingMutation = useServiceCreateListing();

  // Load available items when component mounts
  useEffect(() => {
    const loadAvailableItems = async () => {
      const response = await getAllAvailableItemApi();
      
      if (response?.value.data) {
        // Transform API data to match our interfaces - no transformation needed now
        const transformedItems: API.AvailableItem[] = response.value.data;
        setAvailableItems(transformedItems);
      }
    };

    loadAvailableItems();
  }, []);

  const handleSelectItem = (item: API.AvailableItem) => {
    setSelectedItem(item);
    setShowInventoryModal(false);
  };

  // Function to generate combined description
  const getCombinedDescription = () => {
    let combinedDesc = description.trim();
    
    if (!isFree && desiredItemName.trim()) {
      if (combinedDesc) {
        combinedDesc += '\n\nTôi muốn các item sau: ' + desiredItemName.trim();
      } else {
        combinedDesc = 'Tôi muốn các item sau: ' + desiredItemName.trim();
      }
    }
    
    return combinedDesc;
  };

  const handleSubmit = async () => {
    if (!selectedItem || !description.trim()) {
      alert('Vui lòng chọn sản phẩm và nhập mô tả');
      return;
    }
    
    if (!isFree && !desiredItemName.trim()) {
      alert('Vui lòng nhập tên món đồ muốn trao đổi');
      return;
    }
    
    const listingData = {
      inventoryId: selectedItem.id,
      isFree,
      description: getCombinedDescription(),
    };
    
    try {
      await createListingMutation.mutateAsync(listingData);
      // Navigation will happen automatically after successful creation due to the success handler
      router.push('/marketplace');
    } catch (error) {
      // Error handling is already done in the hook
      console.error('Failed to create listing:', error);
    }
  };

  const handleReset = () => {
    setSelectedItem(null);
    setDescription('');
    setIsFree(true);
    setDesiredItemName('');
  };

  // Helper function to get user initials for fallback
  const getUserInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isSubmitting = createListingMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-100 mt-32">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Marketplace</h1>
            <div className="text-sm text-gray-500">Tạo tin đăng</div>
          </div>
          <p className="text-gray-600 text-sm mt-1">Mặt hàng cần bán</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              {/* Select Product Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Sản phẩm</h3>
                {!selectedItem ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Package className="mx-auto mb-3 text-gray-400" size={40} />
                    <p className="text-gray-600 mb-3">Chưa chọn sản phẩm</p>
                    <button
                      onClick={() => setShowInventoryModal(true)}
                      disabled={isSubmitting}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Chọn từ kho ({availableItems.length} sản phẩm)
                    </button>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        {selectedItem.image ? (
                          <img
                            src={selectedItem.image}
                            alt={selectedItem.productName}
                            className="w-12 h-12 object-cover rounded"
                            onLoad={() => console.log('✅ Selected item image loaded')}
                            onError={() => console.error('❌ Selected item image failed to load:', selectedItem.image)}
                          />
                        ) : (
                          <>
                            <Package className="text-gray-400" size={20} />
                            {console.log('📦 Selected item has no image:', selectedItem.image)}
                          </>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{selectedItem.productName}</p>
                        <p className="text-xs text-gray-500">
                          {selectedItem.isFromBlindBox ? 'Từ Blind Box' : selectedItem.location}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowInventoryModal(true)}
                      disabled={isSubmitting}
                      className="text-blue-600 text-xs mt-2 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      Thay đổi
                    </button>
                  </div>
                )}
              </div>

              {/* Listing Type Toggle */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Trao đổi</span>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsFree(!isFree)}
                      disabled={isSubmitting}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        !isFree ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          !isFree ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Desired Item (only show when not free) */}
              {!isFree && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Món đồ muốn trao đổi
                  </label>
                  <input
                    type="text"
                    value={desiredItemName}
                    onChange={(e) => setDesiredItemName(e.target.value)}
                    placeholder="Ví dụ: iPhone 13, Giày Nike size 42..."
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Thông tin này sẽ được gộp vào phần mô tả
                  </p>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả chi tiết về sản phẩm..."
                  rows={6}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Seller Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Thông tin người bán</h3>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={fullName || 'User'}
                        className="w-8 h-8 object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <User className="text-white" size={16} />
                    )}
                    {/* Fallback initials - hidden by default, shown if image fails */}
                    <span className={`text-white text-xs font-semibold ${avatarUrl ? 'hidden' : ''}`}>
                      {getUserInitials(fullName)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{fullName || 'Người dùng'}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={!selectedItem || !description.trim() || (!isFree && !desiredItemName.trim()) || isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang đăng tin...
                    </>
                  ) : (
                    'Đăng tin'
                  )}
                </button>
                
                <button
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="w-full border border-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 text-sm text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  Xóa tất cả
                </button>
              </div>
            </div>
          </div>

          {/* Right Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Preview Header */}
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Xem trước</h2>
                <p className="text-sm text-gray-600">
                  Bản xem trước bài niêm yết. Trong khi tạo, bạn có thể xem trước để biết bài niêm yết sẽ hiển thị thế nào với mọi người trên Marketplace.
                </p>
              </div>

              {/* Preview Content */}
              <div className="p-6">
                {!selectedItem ? (
                  <div className="text-center py-12">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <Camera className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-400">Tiêu đề</h3>
                    <p className="text-gray-400">Mô tả sản phẩm sẽ hiển thị ở đây...</p>
                  </div>
                ) : (
                  <div>
                    {/* Product Image */}
                    <div className="mb-6">
                      <div className="w-full max-w-md mx-auto bg-gray-200 rounded-lg flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
                        {selectedItem.image ? (
                          <img
                            src={selectedItem.image}
                            alt={selectedItem.productName}
                            className="w-full h-full rounded-lg object-cover"
                            onLoad={() => console.log('✅ Preview image loaded successfully')}
                            onError={() => {
                              console.error('❌ Preview image failed to load');
                              console.error('Image URL:', selectedItem.image);
                              console.error('Image type:', typeof selectedItem.image);
                              console.error('Image length:', selectedItem.image?.length);
                            }}
                          />
                        ) : (
                          <>
                            <Package className="text-gray-400" size={64} />
                            {console.log('📦 Preview: No image available for:', selectedItem.productName)}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Product Title */}
                    <h2 className="text-2xl font-bold mb-4">{selectedItem.productName}</h2>

                    {/* Listing Type Info */}
                    <div className="mb-6">
                      <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                        {isFree ? '🎁 Bằng tiền' : '🔄 Trao đổi'}
                      </div>
                      {selectedItem.isFromBlindBox && (
                        <div className="bg-purple-50 p-3 rounded-lg mb-3">
                          <p className="text-sm text-purple-700">
                            <strong>✨ Từ Blind Box</strong>
                          </p>
                        </div>
                      )}
                      {selectedItem.location && (
                        <div className="bg-blue-50 p-3 rounded-lg mb-3">
                          <p className="text-sm text-blue-700">
                            <strong>📍 Vị trí:</strong> {selectedItem.location}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Product Description */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Chi tiết</h3>
                      {getCombinedDescription() ? (
                        <p className="text-gray-700 whitespace-pre-wrap">{getCombinedDescription()}</p>
                      ) : (
                        <p className="text-gray-400 italic">Phần mô tả sẽ hiển thị ở đây...</p>
                      )}
                    </div>

                    {/* Seller Info in Preview */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-3">Thông tin người bán</h3>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={fullName || 'User'}
                              className="w-12 h-12 object-cover"
                              onError={(e) => {
                                // Fallback to initials if image fails to load
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : (
                            <User className="text-white" size={20} />
                          )}
                          {/* Fallback initials - hidden by default, shown if image fails */}
                          <span className={`text-white font-semibold ${avatarUrl ? 'hidden' : ''}`}>
                            {getUserInitials(fullName)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold">{fullName || 'Người dùng'}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium text-sm hover:bg-gray-200">
                          Nhắn tin
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Modal */}
      <InventoryModal
        isOpen={showInventoryModal}
        onClose={() => setShowInventoryModal(false)}
        onSelectItem={handleSelectItem}
        items={availableItems}
        isLoading={isPending}
      />
    </div>
  );
};

export default MarketplaceListing;