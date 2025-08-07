const REVIEW = "/reviews";
const REVIEW_CREATE = `${REVIEW}`;
const GET_REVIEW = `${REVIEW}`;
const REVIEW_REPLY = (reviewId: string) => `${REVIEW}/${reviewId}/reply`;
const REVIEW_DETAIL = (reviewId: string) => `${REVIEW}/${reviewId}`;
const REVIEW_CAN_REVIEW = (orderDetailId: string) => `${REVIEW}/can-review/${orderDetailId}`;
const DELETE_REVIEW = (reviewId: string) => `${REVIEW}/${reviewId}`;

export default {
  REVIEW,
  GET_REVIEW,
  REVIEW_CREATE,
  REVIEW_REPLY,
  REVIEW_DETAIL,
  REVIEW_CAN_REVIEW,
  DELETE_REVIEW,
};
