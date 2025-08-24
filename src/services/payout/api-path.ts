const PAYOUT = "/payouts";
const REQUEST = `${PAYOUT}/request`;
const ELIGIBLE = `${PAYOUT}/eligible`;
const PROCESS = (sellerId: string) => `${PAYOUT}/${sellerId}/process`;
const CALCULATE_UPCOMING = `${PAYOUT}/calculate-upcoming`;
const HISTORY = `${PAYOUT}/history`;
const PAYOUT_WITH_ID = (payoutId: string) => `${PAYOUT}/${payoutId}`;
const EXPORT_LATEST = `${PAYOUT}/export-latest`;
const EXPORT_HISTORY = (payoutId: string) => `${PAYOUT}/${payoutId}/export-history`;
const MY_PAYOUT = `${PAYOUT}/my-payouts`;

export default {
  PAYOUT,
  REQUEST,
  ELIGIBLE,
  PROCESS,
  CALCULATE_UPCOMING,
  HISTORY,
  PAYOUT_WITH_ID,
  EXPORT_LATEST,
  EXPORT_HISTORY,
  MY_PAYOUT,
};
