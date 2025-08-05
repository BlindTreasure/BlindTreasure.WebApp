import { ShoppingBag, Package, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/services/inventory-item/typings";

interface MobileInventoryModalProps {
  inventoryItems: InventoryItem[];
  inventoryLoading: boolean;
  onSendProduct: (item: InventoryItem) => void;
  onClose: () => void;
}

export default function MobileInventoryModal({
  inventoryItems,
  inventoryLoading,
  onSendProduct,
  onClose
}: MobileInventoryModalProps) {
  const handleSendProduct = (item: InventoryItem) => {
    onSendProduct(item);
    onClose();
  };

  return (
    <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full h-2/3 rounded-t-lg flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-4 border-b bg-green-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <h3 className="font-semibold">Kho hàng của tôi</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-green-600 p-1 h-auto rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                className="bg-white rounded-lg p-3 border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleSendProduct(item)}
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
                      {item.product.price.toLocaleString('vi-VN')}đ
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-center text-blue-600 font-medium">
                  Click để gửi
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
