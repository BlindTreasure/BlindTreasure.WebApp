const PROMOTION = "/promotions";
const PROMOTION_WITH_ID = (promotionId: string) => `${PROMOTION}/${promotionId}`;
const REVIEW_PROMOTION = PROMOTION + "/review"
const WITHDRAW_PROMOTION = PROMOTION + "/withdraw"
const PROMOTION_PARTICIPANT = PROMOTION + "/participant"

export default {
  PROMOTION,
  PROMOTION_WITH_ID,
  REVIEW_PROMOTION,
  WITHDRAW_PROMOTION,
  PROMOTION_PARTICIPANT
};
  