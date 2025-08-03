import React, { useState } from 'react';
import { X, Search, Package, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { API } from "@/services/listing/typings"

interface TradeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProduct: {
    id: string;
    productName: string;
    ownerName: string;
    productImage: string | string[];
  };
  userItems?: API.AvailableItem[];
  onSubmitTradeRequest: (data: {
    targetProductId: string;
    offeredItemIds: string[];
    message?: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

const TradeRequestModal: React.FC<TradeRequestModalProps> = ({
  isOpen,
  onClose,
  targetProduct,
  userItems = [],
  onSubmitTradeRequest,
  isLoading = false
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isOpen) return null;

  // Filter user items based on search
  const filteredItems = userItems.filter(item =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get image URL helper
  const getImageUrl = (image: string | string[]): string => {
    if (Array.isArray(image)) {
      return image[0] || '/placeholder-image.jpg';
    }
    return image || '/placeholder-image.jpg';
  };

  // Toggle item selection
  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Handle submit
  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để trao đổi');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitTradeRequest({
        targetProductId: targetProduct.id,
        offeredItemIds: selectedItems
      });
      setSubmitSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
        setSelectedItems([]);
        setSearchTerm('');
      }, 2000);
    } catch (error) {
      console.error('Trade request failed:', error);
      alert('Có lỗi xảy ra khi gửi yêu cầu trao đổi. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset state when closing
  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedItems([]);
      setSearchTerm('');
      setSubmitSuccess(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Tạo yêu cầu trao đổi</h2>
            <p className="text-sm text-gray-600 mt-1">
              Chọn sản phẩm của bạn để trao đổi với "{targetProduct.productName}"
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-white/50 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {submitSuccess && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Yêu cầu trao đổi đã được gửi!
            </h3>
            <p className="text-gray-600">
              Chúng tôi sẽ thông báo cho bạn khi có phản hồi từ {targetProduct.ownerName}
            </p>
          </div>
        )}

        {/* Main Content */}
        {!submitSuccess && (
          <>
            {/* Target Product Info */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm">
                  <img
                    src={getImageUrl(targetProduct.productImage)}
                    alt={targetProduct.productName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{targetProduct.productName}</h3>
                  <p className="text-sm text-gray-600">Của {targetProduct.ownerName}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* User Items Selection */}
            <div className="p-6 flex-1 overflow-hidden flex flex-col">
              {/* Items List */}
              <div className="flex-1 flex flex-col mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">
                    Sản phẩm của bạn ({filteredItems.length})
                  </h4>
                  {selectedItems.length > 0 && (
                    <span className="text-sm text-blue-600 font-medium">
                      Đã chọn {selectedItems.length}
                    </span>
                  )}
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    <span className="ml-2 text-gray-600">Đang tải sản phẩm...</span>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">
                      {searchTerm ? 'Không tìm thấy sản phẩm nào' : 'Bạn chưa có sản phẩm nào để trao đổi'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 overflow-y-auto">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleItemSelection(item.id)}
                        className={`relative p-3 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md h-fit ${
                          selectedItems.includes(item.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-image.jpg';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900 truncate">
                              {item.productName}
                            </h5>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-600 truncate">
                                {item.location}
                              </p>
                              {item.isFromBlindBox && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                  Blind Box
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Selection indicator */}
                        {selectedItems.includes(item.id) && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Info warning when no items selected */}
              {selectedItems.length === 0 && !isLoading && filteredItems.length > 0 && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-700">
                    Vui lòng chọn ít nhất một sản phẩm để trao đổi
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-auto">
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={selectedItems.length === 0 || isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      Gửi yêu cầu trao đổi
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TradeRequestModal;