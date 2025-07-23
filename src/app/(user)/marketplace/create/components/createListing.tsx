'use client'
import React, { useState } from 'react';
import {X, Camera, Search, Package } from 'lucide-react';

// Mock inventory data - thay thế bằng data thực của bạn
const mockInventory = [
  {
    id: 1,
    name: "iPhone 14 Pro Max 256GB",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop",
    category: "Electronics"
  },
  {
    id: 2,
    name: "Nike Air Jordan 1 High",
    image: "https://images.unsplash.com/photo-1551107696-a4b537c892db?w=300&h=300&fit=crop",
    category: "Shoes"
  },
  {
    id: 3,
    name: "MacBook Pro 16 inch M2",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop",
    category: "Electronics"
  },
  {
    id: 4,
    name: "Gucci Dionysus Bag",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    category: "Fashion"
  },
  {
    id: 5,
    name: "Sony WH-1000XM4 Headphones",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&h=300&fit=crop",
    category: "Electronics"
  }
];

interface InventoryItem {
  id: number;
  name: string;
  image: string;
  category: string;
}

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: InventoryItem) => void;
}

const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose, onSelectItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredInventory = mockInventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          {filteredInventory.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MarketplaceListing: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [description, setDescription] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [desiredItemName, setDesiredItemName] = useState('');
  const [showInventoryModal, setShowInventoryModal] = useState(false);

  const handleSelectItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowInventoryModal(false);
  };

  const handleSubmit = () => {
    if (!selectedItem || !description.trim()) {
      alert('Vui lòng chọn sản phẩm và nhập mô tả');
      return;
    }
    
    if (!isFree && !desiredItemName.trim()) {
      alert('Vui lòng nhập tên món đồ muốn trao đổi');
      return;
    }
    
    const listingData = {
      productName: selectedItem.name,
      productImage: selectedItem.image,
      isFree,
      desiredItemName: isFree ? null : desiredItemName.trim(),
      description: description.trim(),
      ownerName: 'Nhat Quang'
    };
    
    console.log('Publishing listing:', listingData);
    alert('Đăng tin thành công!');
    
    // Reset form after successful submit
    handleReset();
  };

  const handleSaveDraft = () => {
    if (!selectedItem) {
      alert('Vui lòng chọn sản phẩm trước khi lưu bản nháp');
      return;
    }
    
    const draftData = {
      productName: selectedItem.name,
      productImage: selectedItem.image,
      isFree,
      desiredItemName: isFree ? null : desiredItemName.trim(),
      description: description.trim(),
      ownerName: 'Nhat Quang'
    };
    
    console.log('Saving draft:', draftData);
    alert('Đã lưu bản nháp!');
  };

  const handleReset = () => {
    setSelectedItem(null);
    setDescription('');
    setIsFree(true);
    setDesiredItemName('');
  };

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
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      Chọn từ kho
                    </button>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedItem.image}
                        alt={selectedItem.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{selectedItem.name}</p>
                        <p className="text-xs text-gray-500">{selectedItem.category}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowInventoryModal(true)}
                      className="text-blue-600 text-xs mt-2 hover:underline"
                    >
                      Thay đổi
                    </button>
                  </div>
                )}
              </div>

              {/* Listing Type */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Loại giao dịch</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="listingType"
                      checked={isFree}
                      onChange={() => setIsFree(true)}
                      className="mr-2"
                    />
                    <span className="text-sm">Miễn phí</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="listingType"
                      checked={!isFree}
                      onChange={() => setIsFree(false)}
                      className="mr-2"
                    />
                    <span className="text-sm">Trao đổi</span>
                  </label>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </div>

              {/* Seller Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Thông tin người bán</h3>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">NQ</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Nhat Quang</p>
                    <p className="text-xs text-gray-500">Đã niêm yết về giấy trước</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={!selectedItem || !description.trim() || (!isFree && !desiredItemName.trim())}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                >
                  Đăng tin
                </button>
                
                <button
                  onClick={handleSaveDraft}
                  disabled={!selectedItem}
                  className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                >
                  Lưu bản nháp
                </button>
                
                <button
                  onClick={handleReset}
                  className="w-full border border-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 text-sm text-gray-700"
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
                      <img
                        src={selectedItem.image}
                        alt={selectedItem.name}
                        className="w-full max-w-md mx-auto rounded-lg object-cover"
                        style={{ aspectRatio: '1/1' }}
                      />
                    </div>

                    {/* Product Title */}
                    <h2 className="text-2xl font-bold mb-4">{selectedItem.name}</h2>

                    {/* Listing Type Info */}
                    <div className="mb-6">
                      <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                        {isFree ? '🎁 Miễn phí' : '🔄 Trao đổi'}
                      </div>
                      {!isFree && desiredItemName && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <strong>Muốn trao đổi lấy:</strong> {desiredItemName}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Product Description */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Chi tiết</h3>
                      {description ? (
                        <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
                      ) : (
                        <p className="text-gray-400 italic">Phần mô tả sẽ hiển thị ở đây...</p>
                      )}
                    </div>

                    {/* Seller Info in Preview */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-3">Thông tin người bán</h3>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">NQ</span>
                        </div>
                        <div>
                          <p className="font-semibold">Nhat Quang</p>
                          <p className="text-sm text-gray-600">Đã niêm yết về giấy trước tại Singapore</p>
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
      />
    </div>
  );
};

export default MarketplaceListing;