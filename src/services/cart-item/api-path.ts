const CART_ITEM = "/cart";
const DELETE_CART_ITEM = (cartItemId: string) =>
  `${CART_ITEM}/${cartItemId}`;
const CLEAR_ALL_CART = CART_ITEM + "/clear" 

export default {
  CART_ITEM,
  DELETE_CART_ITEM,
  CLEAR_ALL_CART
};

