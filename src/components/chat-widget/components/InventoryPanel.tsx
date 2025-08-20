import { ShoppingBag, Package, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/services/inventory-item/typings";

interface InventoryPanelProps {
  inventoryItems: InventoryItem[];
  inventoryLoading: boolean;
  isSending: boolean;
  onSendProduct: (item: InventoryItem) => void;
  onClose: () => void;
}

export default function InventoryPanel({
  inventoryItems,
  inventoryLoading,
  isSending,
  onSendProduct,
  onClose
}: InventoryPanelProps) {
  return (
    <div className="w-96 border-l bg-gray-50 hidden md:flex flex-col">
      <div className="p-4 border-b text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#d02a2a]">
            <ShoppingBag className="w-5 h-5" />
            <h3 className="font-semibold">Kho hàng của tôi</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-[#d02a2a] hover:bg-green-600 p-1 h-auto rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {inventoryLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : inventoryItems.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Không có sản phẩm nào</p>
          </div>
        ) : (
          inventoryItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg p-3 border hover:shadow-md transition-shadow cursor-pointer ${
                isSending ? 'opacity-50 pointer-events-none' : ''
              }`}
              onClick={() => !isSending && onSendProduct(item)}
            >
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.imageUrls?.[0] ? (
                    <img
                      src={item.product.imageUrls[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.product.realSellingPrice.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>
              <div className="mt-2 text-xs text-center text-blue-600 font-medium">
                {isSending ? 'Đang gửi...' : 'Click để gửi'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}