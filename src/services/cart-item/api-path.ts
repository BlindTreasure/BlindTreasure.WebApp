const CART_ITEM = "/cart";
const DELETE_CART_ITEM = (cartItemId: string) =>
  `${CART_ITEM}/${cartItemId}`;

export default {
  CART_ITEM,
  DELETE_CART_ITEM
};

