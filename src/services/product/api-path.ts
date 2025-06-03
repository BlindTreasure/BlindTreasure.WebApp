const PRODUCT_All = "/products";
const PRODUCT_ALL_WITH_ID = (productId: string) =>
  `${PRODUCT_All}/${productId}`;

export default {
  PRODUCT_All,
  PRODUCT_ALL_WITH_ID,
};
