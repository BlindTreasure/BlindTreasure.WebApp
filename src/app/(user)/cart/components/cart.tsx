'use client';
import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Minus, Trash2, Truck } from 'lucide-react';
import useGetCartByCustomer from '../hooks/useGetCartByCustomer';
import useUpdateCartQuantity from "../hooks/useUpdateQuantityItemCart";
import useDeleteCartItem from "../hooks/useDeleteCartItem";
import useClearAllCartItem from "../hooks/useClearAllCartItem";
import usePreviewShipping from '../hooks/usePreviewShipping';
import useDebounce from '@/hooks/use-debounce';
import Image from 'next/image';
import { SlHandbag } from "react-icons/sl";

import useCreateOrder from '../hooks/useCreateOrder';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { AlertDialogHeader } from '@/components/ui/alert-dialog';
import useToast from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

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

  // Memoize sellerItems to prevent unnecessary re-renders
  const sellerItems = useMemo(() => data?.sellerItems || [], [data?.sellerItems]);

  // Flatten all items from all sellers for easier processing - memoize to prevent unnecessary re-renders
  const cartItems = useMemo(() =>
    sellerItems.flatMap(sellerGroup => sellerGroup.items),
    [sellerItems]
  );

  const { isPending: isDeleting, deleteCartItemApi } = useDeleteCartItem();
  const { isPending: isClearing, clearAllCartItemApi } = useClearAllCartItem();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [promotionId, setPromotionId] = useState<string | null>(null);
  const isInitializedRef = useRef(false);
  const cartItemsRef = useRef<API.CartItem[]>([]);

  const { createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const [orderItems, setOrderItems] = useState<REQUEST.CreateOrderItem[]>([]);
  const [pendingOrderData, setPendingOrderData] = useState<REQUEST.CreateOrderList | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();
  const [isShip, setIsShip] = useState(false);
  const [shippingData, setShippingData] = useState<API.ShipmentPreview[] | null>(null);
  const { previewShipping, isPending: isLoadingShipping } = usePreviewShipping();

  // Fetch shipping preview only when isShip changes to true
  useEffect(() => {
    const fetchShippingPreview = async () => {
      if (!isShip || selectedItems.length === 0) {
        setShippingData(null);
        return;
      }

      const orderSellerItems: REQUEST.CreateOrderSellerGroup[] = sellerItems
        .map(sellerGroup => {
          const filteredItems = sellerGroup.items
            .filter(item => selectedItems.includes(item.id))
            .map(item => ({
              id: item.id,
              productId: item.productId ?? "",
              productName: item.productName ?? "",
              productImages: item.productImages,
              blindBoxId: item.blindBoxId ?? "",
              blindBoxName: item.blindBoxName ?? "",
              blindBoxImage: item.blindBoxImage,
              quantity: quantities[item.id] ?? item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: (quantities[item.id] ?? item.quantity) * item.unitPrice,
              createdAt: item.createdAt,
            }));

          return {
            sellerId: sellerGroup.sellerId,
            sellerName: sellerGroup.sellerName,
            items: filteredItems,
            ...(promotionId && { promotionId }),
          };
        })
        .filter(sellerGroup => sellerGroup.items.length > 0);

      const payload: REQUEST.CreateOrderList = {
        sellerItems: orderSellerItems,
        isShip: true,
      };

      try {
        const result = await previewShipping(payload);
        setShippingData(result);
      } catch (error) {
        console.error('Error fetching shipping preview:', error);
        setShippingData(null);
      }
    };

    // Only fetch when isShip is true
    if (isShip) {
      fetchShippingPreview();
    } else {
      setShippingData(null);
    }
  }, [isShip]); // Only depend on isShip to avoid infinite loops

  // Khởi tạo selectedItems và quantities khi cartItems thay đổi
  useEffect(() => {
    cartItemsRef.current = cartItems;

    if (cartItems.length > 0) {
      // Chỉ khởi tạo khi chưa được khởi tạo hoặc có items mới
      const currentItemIds = new Set(cartItems.map((item: API.CartItem) => item.id));
      const existingItemIds = new Set(Object.keys(quantities));

      // Check if we need to initialize or if there are new items
      const hasNewItems = cartItems.some(item => !existingItemIds.has(item.id));
      const hasRemovedItems = Array.from(existingItemIds).some(id => !currentItemIds.has(id));

      const shouldInitialize = !isInitializedRef.current || hasNewItems || hasRemovedItems;

      if (shouldInitialize) {
        // Only update if there's actually a change
        setSelectedItems(prev => {
          const newSelected = cartItems.map((item: API.CartItem) => item.id);
          if (JSON.stringify(prev.sort()) !== JSON.stringify(newSelected.sort())) {
            return newSelected;
          }
          return prev;
        });

        // Khởi tạo quantities từ dữ liệu Redux, preserve existing quantities for unchanged items
        setQuantities(prev => {
          const newQuantities: Record<string, number> = {};
          cartItems.forEach((item: API.CartItem) => {
            newQuantities[item.id] = prev[item.id] ?? item.quantity;
          });

          // Only update if there's actually a change
          if (JSON.stringify(prev) !== JSON.stringify(newQuantities)) {
            return newQuantities;
          }
          return prev;
        });

        isInitializedRef.current = true;
      }
    } else {
      // Reset khi cart trống
      if (isInitializedRef.current) {
        setSelectedItems([]);
        setQuantities({});
        isInitializedRef.current = false;
      }
    }
  }, [cartItems]); // Only depend on cartItems

  const debouncedQuantities = useDebounce(quantities, 500);

  // API update quantity effect
  const { updateCartItemApi } = useUpdateCartQuantity();
  useEffect(() => {
    const updateQuantity = async (): Promise<void> => {
      for (const id in debouncedQuantities) {
        const quantity = debouncedQuantities[id];
        const originalItem = cartItemsRef.current.find(item => item.id === id);

        // Chỉ update nếu quantity thay đổi so với dữ liệu gốc
        if (originalItem && originalItem.quantity !== quantity) {
          await updateCartItemApi({ cartItemId: id, quantity });
        }
      }
    };

    if (Object.keys(debouncedQuantities).length > 0 && isInitializedRef.current) {
      updateQuantity();
    }
  }, [debouncedQuantities, updateCartItemApi]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item: API.CartItem) => item.id));
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

  const subtotal: number = useMemo(() =>
    cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((acc, item) => {
        const quantity = quantities[item.id] ?? item.quantity;
        return acc + quantity * item.unitPrice;
      }, 0),
    [cartItems, selectedItems, quantities]
  );

  const totalShippingFee: number = useMemo(() =>
    isShip && shippingData
      ? shippingData.reduce((acc, shipment) => acc + shipment.ghnPreviewResponse.totalFee, 0)
      : 0,
    [isShip, shippingData]
  );

  const total: number = useMemo(() => subtotal + totalShippingFee, [subtotal, totalShippingFee]);

  const handlePreviewOrder = useCallback(() => {
    const orderSellerItems: REQUEST.CreateOrderSellerGroup[] = sellerItems
      .map(sellerGroup => {
        const filteredItems = sellerGroup.items
          .filter(item => selectedItems.includes(item.id))
          .map(item => ({
            id: item.id,
            productId: item.productId ?? "",
            productName: item.productName ?? "",
            productImages: item.productImages,
            blindBoxId: item.blindBoxId ?? "",
            blindBoxName: item.blindBoxName ?? "",
            blindBoxImage: item.blindBoxImage,
            quantity: quantities[item.id] ?? item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: (quantities[item.id] ?? item.quantity) * item.unitPrice,
            createdAt: item.createdAt,
          }));

        return {
          sellerId: sellerGroup.sellerId,
          sellerName: sellerGroup.sellerName,
          items: filteredItems,
          ...(promotionId && { promotionId }),
        };
      })
      .filter(sellerGroup => sellerGroup.items.length > 0);

    const payload: REQUEST.CreateOrderList = {
      sellerItems: orderSellerItems,
      isShip,
    };

    setPendingOrderData(payload);
    setShowConfirmModal(true);
  }, [sellerItems, selectedItems, promotionId, quantities, isShip]);

  const handleCheckout = useCallback(async () => {
    // Convert sellerItems to new format
    const orderSellerItems: REQUEST.CreateOrderSellerGroup[] = sellerItems
      .map(sellerGroup => {
        const filteredItems = sellerGroup.items
          .filter(item => selectedItems.includes(item.id))
          .map(item => ({
            id: item.id,
            productId: item.productId ?? "",
            productName: item.productName ?? "",
            productImages: item.productImages,
            blindBoxId: item.blindBoxId ?? "",
            blindBoxName: item.blindBoxName ?? "",
            blindBoxImage: item.blindBoxImage,
            quantity: quantities[item.id] ?? item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: (quantities[item.id] ?? item.quantity) * item.unitPrice,
            createdAt: item.createdAt,
          }));

        return {
          sellerId: sellerGroup.sellerId,
          sellerName: sellerGroup.sellerName,
          items: filteredItems,
          ...(promotionId && { promotionId }),
        };
      })
      .filter(sellerGroup => sellerGroup.items.length > 0);

    const payload: REQUEST.CreateOrderList = {
      sellerItems: orderSellerItems,
      isShip,
    };

    const url = await createOrder(payload);
    if (url) {
      window.location.href = url;
    }
  }, [selectedItems, sellerItems, quantities, promotionId, createOrder, isShip]);


  const handleContinueShopping = () => {
    router.push("/allproduct");
  };

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
          Tổng sản phẩm ({data?.totalQuantity || 0} sản phẩm từ {sellerItems.length} cửa hàng)
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
          <Button className="py-6 bg-red-600 hover:bg-red-400" onClick={handleContinueShopping} ><SlHandbag />Trở lại mua sắm</Button>
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
                  indeterminate={isIndeterminate || undefined}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Chọn tất cả sản phẩm"
                />
                <span className="text-sm font-medium">
                  Chọn tất cả ({selectedItems.length}/{cartItems.length})
                </span>
              </div>

              {sellerItems.map((sellerGroup) => (
                <div key={sellerGroup.sellerId} className="mb-6">
                  {/* Header của seller */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-800">
                        🏪 {sellerGroup.sellerName}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {sellerGroup.items.length} sản phẩm • Tổng: {sellerGroup.sellerTotalPrice.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                  </div>

                  {/* Items của seller */}
                  {sellerGroup.items.map((item) => {
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
                        className="relative flex flex-col sm:flex-row gap-4 py-4 pr-8 border-b last:border-none ml-4"
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
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="w-full lg:w-80 h-fit sticky top-40">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>

              <div className="mb-4 p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id="shipping-option"
                    checked={isShip}
                    onCheckedChange={(checked) => setIsShip(checked as boolean)}
                  />
                  <label htmlFor="shipping-option" className="text-sm font-medium flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Giao hàng tận nơi
                  </label>
                </div>
                {isShip && isLoadingShipping && (
                  <p className="text-xs text-gray-500 ml-6">
                    Đang tính phí vận chuyển...
                  </p>
                )}

                {isShip && cartItems.some(item => selectedItems.includes(item.id) && !Boolean(item.productId)) && (
                  <div className="text-xs px-2 py-1 bg-amber-50 border border-amber-200 rounded text-amber-700 flex items-center gap-1 ml-6 mt-2">
                    <span>⚠️</span>
                    <span>Lưu ý: Sản phẩm blindbox chỉ được giao sau khi bạn mở hộp và nhận sản phẩm cụ thể.</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Số sản phẩm đã chọn:</span>
                  <span>{selectedItems.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tạm tính:</span>
                  <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                {sellerItems.length > 1 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Từ {sellerItems.length} cửa hàng khác nhau
                  </div>
                )}
                {isShip && (
                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển:</span>
                    <span>
                      {isLoadingShipping ? (
                        "Đang tính..."
                      ) : totalShippingFee > 0 ? (
                        `${totalShippingFee.toLocaleString('vi-VN')}₫`
                      ) : (
                        "0₫"
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-semibold border-t pt-2">
                  <span>Tổng tiền:</span>
                  <span className="text-[#d02a2a]">
                    {total.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={handlePreviewOrder}
                  disabled={selectedItems.length === 0 || total === 0}
                  className="w-full sm:w-auto"
                >
                  Xem trước đơn hàng
                </Button>
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
      <Dialog open={showConfirmModal} onOpenChange={() => setShowConfirmModal(false)}>
        <DialogContent className="max-w-lg">
          <AlertDialogHeader>
            <DialogTitle>Xác nhận đơn hàng</DialogTitle>
          </AlertDialogHeader>

          <div className="max-h-[300px] overflow-auto space-y-4">
            {pendingOrderData?.sellerItems.map((sellerGroup, sellerIndex) => (
              <div key={sellerIndex} className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">🏪 {sellerGroup.sellerName}</h4>
                {sellerGroup.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between text-sm ml-4">
                    <div>
                      <p className="font-medium">{item.productName || item.blindBoxName}</p>
                      <p>Số lượng: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p>₫{item.unitPrice.toLocaleString()}</p>
                      <p className="text-muted-foreground">Tổng: ₫{item.totalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>₫{pendingOrderData?.sellerItems
                .flatMap(sellerGroup => sellerGroup.items)
                .reduce((sum, item) => sum + item.totalPrice, 0)
                .toLocaleString()}</span>
            </div>
            {pendingOrderData?.isShip && (
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>₫{totalShippingFee.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-base border-t pt-2">
              <span>Tổng cộng:</span>
              <span className="text-[#d02a2a]">
                ₫{(
                  (pendingOrderData?.sellerItems
                    .flatMap(sellerGroup => sellerGroup.items)
                    .reduce((sum, item) => sum + item.totalPrice, 0) || 0) +
                  (pendingOrderData?.isShip ? totalShippingFee : 0)
                ).toLocaleString()}
              </span>
            </div>
            {pendingOrderData?.isShip && (
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Truck className="w-3 h-3" />
                Đơn hàng sẽ được giao tận nơi
              </div>
            )}

            {pendingOrderData?.sellerItems
              .flatMap(sellerGroup => sellerGroup.items)
              .some(item => item.blindBoxId && item.blindBoxName) && (
                <div className="text-xs px-3 py-2 bg-blue-50 border border-blue-200 rounded text-blue-700 mt-3">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-500">ℹ️</span>
                    <div>
                      <p className="font-medium mb-1">Lưu ý về Blindbox:</p>
                      <p>• Blindbox sẽ được lưu trong túi đồ của bạn sau khi thanh toán</p>
                      <p>• Bạn cần mở hộp để nhận sản phẩm cụ thể</p>
                      <p>• Chỉ sản phẩm đã mở mới có thể được giao hàng tận nơi</p>
                    </div>
                  </div>
                </div>
              )}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Hủy
            </Button>
            <Button
              onClick={async () => {
                setShowConfirmModal(false);
                if (pendingOrderData) {
                  const url = await createOrder(pendingOrderData);
                  if (url) window.location.href = url;
                }
              }}
            >
              Xác nhận & Thanh toán
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Cart;