'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import useGetCartByCustomer from '../hooks/useGetCartByCustomer';
import useUpdateCartQuantity from "../hooks/useUpdateQuantityItemCart";
import useDeleteCartItem from "../hooks/useDeleteCartItem";
import useClearAllCartItem from "../hooks/useClearAllCartItem";
import useDebounce from '@/hooks/use-debounce';
import Image from 'next/image';
import { SlHandbag } from "react-icons/sl";

const QuantitySelector = ({
  value,
  onChange,
  min = 1,
  max = 999,
  className = ""
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) => {
  const handleDecrement = useCallback(() => {
    if (value > min) {
      onChange(value - 1);
    }
  }, [value, min, onChange]);

  const handleIncrement = useCallback(() => {
    if (value < max) {
      onChange(value + 1);
    }
  }, [value, max, onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === '') {
      onChange(min);
      return;
    }

    const numericValue = parseInt(inputValue, 10);
    if (!isNaN(numericValue)) {
      const clampedValue = Math.max(min, Math.min(max, numericValue));
      onChange(clampedValue);
    }
  }, [min, max, onChange]);

  return (
    <div className={`flex items-center border rounded bg-white ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDecrement}
        disabled={value <= min}
        className="h-6 w-6 p-0 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-none border-r"
        type="button"
      >
        <Minus className="h-2.5 w-2.5" />
      </Button>

      <Input
        type="text"
        value={value.toString()}
        onChange={handleInputChange}
        className="h-6 w-10 text-center text-xs border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent px-1"
        min={min}
        max={max}
      />

      <Button
        variant="ghost"
        size="sm"
        onClick={handleIncrement}
        disabled={value >= max}
        className="h-6 w-6 p-0 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-none border-l"
        type="button"
      >
        <Plus className="h-2.5 w-2.5" />
      </Button>
    </div>
  );
};

const Cart: React.FC = () => {
  // Lấy dữ liệu từ Redux thông qua hook
  const { isPending, data } = useGetCartByCustomer();
  const cartItems = data?.items || [];

  const { isPending: isDeleting, deleteCartItemApi } = useDeleteCartItem();
  const { isPending: isClearing, clearAllCartItemApi } = useClearAllCartItem();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Khởi tạo selectedItems và quantities khi cartItems thay đổi
  useEffect(() => {
    if (cartItems.length > 0) {
      // Chọn tất cả items mặc định
      setSelectedItems(cartItems.map((item: API.CartItem) => item.id));

      // Khởi tạo quantities từ dữ liệu Redux
      const initialQuantities: Record<string, number> = {};
      cartItems.forEach((item: API.CartItem) => {
        initialQuantities[item.id] = item.quantity;
      });
      setQuantities(initialQuantities);
    } else {
      // Reset khi cart trống
      setSelectedItems([]);
      setQuantities({});
    }
  }, [cartItems]);

  const debouncedQuantities = useDebounce(quantities, 500);

  // API update quantity effect
  const { updateCartItemApi } = useUpdateCartQuantity();
  useEffect(() => {
    const updateQuantity = async (): Promise<void> => {
      for (const id in debouncedQuantities) {
        const quantity = debouncedQuantities[id];
        const originalItem = cartItems.find(item => item.id === id);

        // Chỉ update nếu quantity thay đổi so với dữ liệu gốc
        if (originalItem && originalItem.quantity !== quantity) {
          await updateCartItemApi({ cartItemId: id, quantity });
        }
      }
    };

    if (Object.keys(debouncedQuantities).length > 0) {
      updateQuantity();
    }
  }, [debouncedQuantities, updateCartItemApi, cartItems]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  }, [selectedItems.length, cartItems]);

  const handleRemove = useCallback(async (id: string) => {
    const res = await deleteCartItemApi(id);
    if (res) {
      // Sau khi xóa thành công, Redux sẽ tự động cập nhật
      // Chỉ cần cleanup local state
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
      setQuantities(prev => {
        const newQuantities = { ...prev };
        delete newQuantities[id];
        return newQuantities;
      });
    }
  }, [deleteCartItemApi]);

  const handleClearCart = useCallback(async () => {
    try {
      const res = await clearAllCartItemApi();
      if (res) {
        // Redux sẽ tự động cập nhật, cleanup local state
        setSelectedItems([]);
        setQuantities({});
        setShowClearConfirm(false);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }, [clearAllCartItemApi]);

  const handleQuantityChange = useCallback((id: string, newQuantity: number) => {
    setQuantities((prev) => ({ ...prev, [id]: newQuantity }));
  }, []);

  const total: number = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((acc, item) => {
      const quantity = quantities[item.id] ?? item.quantity;
      return acc + quantity * item.unitPrice;
    }, 0);

  const handleCheckout = useCallback(async () => {
    try {
      console.log('Proceeding to checkout with total:', total);
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  }, [total]);

  const handleContinueShopping = useCallback(() => {
    console.log('Continue shopping');
  }, []);

  const isAllSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < cartItems.length;

  // Chỉ hiển thị loading khi thực sự cần thiết (nếu hook trả về isPending = true)
  if (isPending) {
    return (
      <div className="mt-36 p-4 sm:px-8 lg:px-20">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Đang tải giỏ hàng...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-36 p-4 sm:px-8 lg:px-20">
      {cartItems.length > 0 && (
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Tổng sản phẩm ({cartItems.length} sản phẩm)
        </h2>
      )}


      {cartItems.length === 0 ? (
        <div className="text-center pb-12 space-y-8">
          <Image
            src="/images/cart-empty.jpg"
            alt="Empty cart"
            width={300}
            height={300}
            className="mx-auto mb-4"
          />
          <div className="text-gray-500 mb-4 text-4xl">Giỏ hàng đang <span className='text-red-600'>Trống!</span></div>
          <p className='text-gray-400'>Bạn phải thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
          <Button className="py-6" onClick={handleContinueShopping} ><SlHandbag />Trở lại mua sắm</Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <Card className="w-full lg:flex-1">
            <CardContent className="p-4 sm:p-6 relative">
              {/* Nút Clear All ở góc phải trên */}
              <div className="absolute top-4 right-4 z-10">
                {!showClearConfirm ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowClearConfirm(true)}
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                    disabled={isClearing}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Xóa tất cả</span>
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg shadow-lg">
                    <span className="text-sm text-red-700 whitespace-nowrap">
                      Xóa tất cả?
                    </span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleClearCart}
                        disabled={isClearing}
                        className="h-7 px-2 text-xs"
                      >
                        {isClearing ? 'Xóa...' : 'OK'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowClearConfirm(false)}
                        className="h-7 px-2 text-xs"
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Header với checkbox chọn tất cả */}
              <div className="flex items-center gap-3 pb-4 border-b mb-4 pr-20">
                <Checkbox
                  checked={isAllSelected}
                  // @ts-ignore - shadcn checkbox hỗ trợ indeterminate
                  indeterminate={isIndeterminate}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Chọn tất cả sản phẩm"
                />
                <span className="text-sm font-medium">
                  Chọn tất cả ({selectedItems.length}/{cartItems.length})
                </span>
              </div>

              {cartItems.map((item) => {
                const isProduct = Boolean(item.productId);
                const name = isProduct ? item.productName : item.blindBoxName;
                const image = isProduct
                  ? item.productImages?.[0]
                  : item.blindBoxImage;
                const variant = isProduct ? 'Product' : 'Blindbox';
                const quantity = quantities[item.id] ?? item.quantity;

                return (
                  <div
                    key={item.id}
                    className="relative flex flex-col sm:flex-row gap-4 py-4 pr-8 border-b last:border-none"
                  >
                    <div className="absolute top-2 right-2 z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(item.id)}
                        className="p-1 hover:bg-red-50"
                        type="button"
                        aria-label={`Xóa ${name}`}
                      >
                        <X className="w-4 h-4 text-[#d02a2a]" />
                      </Button>
                    </div>

                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => toggleSelect(item.id)}
                        aria-label={`Chọn ${name}`}
                      />
                      <img
                        src={image || '/images/placeholder.jpg'}
                        alt={name || 'Sản phẩm'}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded"
                      />
                    </div>

                    <div className="flex-1 text-sm space-y-2">
                      <div className="font-semibold leading-tight">{name}</div>
                      <div className="text-xs px-2 py-0.5 bg-gray-200 w-fit rounded">
                        {variant}
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 text-xs">
                        <span className="min-w-[50px]">Số lượng:</span>
                        <QuantitySelector
                          value={quantity}
                          onChange={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
                          min={1}
                          max={999}
                          className="shadow-sm"
                        />
                      </div>

                      <div className="text-gray-600 text-xs">
                        Đơn giá: <span className="font-medium">{item.unitPrice.toLocaleString('vi-VN')}₫</span>
                      </div>
                      <div className="text-[#d02a2a] font-semibold text-sm">
                        Thành tiền: {(quantity * item.unitPrice).toLocaleString('vi-VN')}₫
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="w-full lg:w-80 h-fit sticky top-40">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Số sản phẩm đã chọn:</span>
                  <span>{selectedItems.length}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t pt-2">
                  <span>Tổng tiền:</span>
                  <span className="text-[#d02a2a]">
                    {total.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0 || total === 0}
                >
                  Thanh toán ({selectedItems.length} sản phẩm)
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleContinueShopping}
                >
                  Tiếp tục mua sắm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};  

export default Cart;