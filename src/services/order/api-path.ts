const ORDER = "/orders";
const ORDER_WITH_ID = (orderId: string) => `${ORDER}/${orderId}`;
const CHECKOUT_DIRECT = `${ORDER}/checkout-direct`;
const CHECKOUT_CART = `${ORDER}/checkout`;
const CANCEL_ORDER = (orderId: string) => `${ORDER}/${orderId}/cancel`;

export default {
  ORDER,
  ORDER_WITH_ID,
  CHECKOUT_DIRECT,
  CHECKOUT_CART,
  CANCEL_ORDER
};
