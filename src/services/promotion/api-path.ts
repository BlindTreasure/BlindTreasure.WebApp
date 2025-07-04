const PROMOTION = "/promotions";
const PROMOTION_WITH_ID = (promotionId: string) => `${PROMOTION}/${promotionId}`;
const REVIEW_PROMOTION = PROMOTION + "/review"

export default {
  PROMOTION,
  PROMOTION_WITH_ID,
  REVIEW_PROMOTION
};
  