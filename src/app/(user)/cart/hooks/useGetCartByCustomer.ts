import { useAppSelector } from "@/stores/store";

export default function useGetCartByCustomer() {
  const cartState = useAppSelector((state) => state.cartSlice);
  const isPending = false; // vì lấy từ redux nên không cần loading

  // Flatten all items from all sellers with safe access
  const allItems =
    cartState.sellerItems?.flatMap((seller) => seller.items) || [];

  return {
    isPending,
    data: {
      items: allItems,
      totalQuantity: cartState.totalQuantity || 0,
      sellerItems: cartState.sellerItems || [],
      totalPrice: cartState.totalPrice || 0,
    },
  };
}
