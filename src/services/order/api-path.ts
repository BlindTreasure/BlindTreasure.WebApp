const ORDER = "/orders";
const ORDER_WITH_ID = (orderId: string) => `${ORDER}/${orderId}`;
const CHECKOUT_DIRECT = `${ORDER}/checkout-direct`;
const CHECKOUT_CART = `${ORDER}/checkout`;
const CANCEL_ORDER = (orderId: string) => `${ORDER}/${orderId}/cancel`;
const ORDER_DETAIL = ORDER + "/order-details";
const ORDER_GROUP = (groupId: string) => `${ORDER}/group/${groupId}`;

export default {
  ORDER,
  ORDER_WITH_ID,
  CHECKOUT_DIRECT,
  CHECKOUT_CART,
  CANCEL_ORDER,
  ORDER_DETAIL,
  ORDER_GROUP,
};
