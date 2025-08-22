const PRODUCT = "/sellers/products";
const PRODUCT_WITH_ID = (productId: string) => `${PRODUCT}/${productId}`;
const UPDATE_IMAGE = (productId: string) => `${PRODUCT}/${productId}/images`;
const ORDER_SELLER = `/sellers/orders`

export default {
  PRODUCT,
  PRODUCT_WITH_ID,
  UPDATE_IMAGE,
  ORDER_SELLER
};
