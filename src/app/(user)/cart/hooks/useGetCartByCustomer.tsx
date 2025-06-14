import { useAppSelector } from "@/stores/store";

export default function useGetCartByCustomer() {
  const cartItems = useAppSelector((state) => state.cartSlice.items);
  const isPending = false; // vì lấy từ redux nên không cần loading

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return {
    isPending,
    data: {
      items: cartItems,
      totalQuantity,
    },
  };
}
