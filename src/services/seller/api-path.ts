const SELLER = "/sellers";
const SELLER_UPLOAD_DOCUMENT = SELLER + "/document";
const VERIFY_SELLER_BY_STAFF = (sellerId: string | number) =>
  `${SELLER}/${sellerId}/verify`;
const SELLER_BY_ID = (sellerId: string) => `${SELLER}/${sellerId}`;
const OVERVIEW = (sellerId: string) => `${SELLER}/${sellerId}/overview`;

export default {
  SELLER,
  SELLER_UPLOAD_DOCUMENT,
  VERIFY_SELLER_BY_STAFF,
  SELLER_BY_ID,
  OVERVIEW
};
