const REVIEW = "/reviews";
const REVIEW_CREATE = `${REVIEW}`;
const GET_REVIEW = `${REVIEW}`;
const REVIEW_REPLY = (reviewId: string) => `${REVIEW}/${reviewId}/reply`;
const REVIEW_DETAIL = (reviewId: string) => `${REVIEW}/${reviewId}`;
const REVIEW_STATS = (orderDetailId: string) => `${REVIEW}/review-status/${orderDetailId}`;
const DELETE_REVIEW = (reviewId: string) => `${REVIEW}/${reviewId}`;

export default {
  REVIEW,
  GET_REVIEW,
  REVIEW_CREATE,
  REVIEW_REPLY,
  REVIEW_DETAIL,
  REVIEW_STATS,
  DELETE_REVIEW,
};
