const ADMIN = "/administrator";
const ORDERS = `${ADMIN}/orders`;
const PAYOUTS = `${ADMIN}/payouts`;
const CONFIRM = (payoutId: string) => `${ADMIN}/payouts/${payoutId}/confirm`;

export default {
  ADMIN,
  ORDERS,
  PAYOUTS,
  CONFIRM,
};
