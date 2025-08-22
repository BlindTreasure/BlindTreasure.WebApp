const PRODUCT = "/sellers/products";
const PRODUCT_WITH_ID = (productId: string) => `${PRODUCT}/${productId}`;
const UPDATE_IMAGE = (productId: string) => `${PRODUCT}/${productId}/images`;
const ORDER_SELLER = `/sellers/orders`
const ORDER_WITH_ID = (orderId: string) => `${ORDER_SELLER}/${orderId}`;

export default {
  PRODUCT,
  PRODUCT_WITH_ID,
  UPDATE_IMAGE,
  ORDER_SELLER,
  ORDER_WITH_ID
};
