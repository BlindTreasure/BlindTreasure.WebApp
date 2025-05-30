const SELLER = "/sellers";
const SELLER_UPLOAD_DOCUMENT = SELLER + "/document";
const VERIFY_SELLER_BY_STAFF = (sellerId: string | number) => `${SELLER}/${sellerId}/verify`;

export default {
  SELLER,
  SELLER_UPLOAD_DOCUMENT,
  VERIFY_SELLER_BY_STAFF,
};
  