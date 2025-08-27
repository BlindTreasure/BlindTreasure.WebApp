const ADMIN = "/administrator";
const ORDERS = `${ADMIN}/orders`;
const PAYOUTS = `${ADMIN}/payouts`;
const CONFIRM = (payoutId: string) => `${ADMIN}/payouts/${payoutId}/confirm`;
const FORCE_RELEASE_HOLD = (inventoryItemId: string) => `${ADMIN}/inventory/${inventoryItemId}/force-release-hold`
const FORCE_TIMEOUT = (tradeRequestId: string) => `${ADMIN}/trades/${tradeRequestId}/force-timeout`
const INVENTORY_ONHOLD = ADMIN + "/inventory/onhold"

export default {
  ADMIN,
  ORDERS,
  PAYOUTS,
  CONFIRM,
  FORCE_RELEASE_HOLD,
  FORCE_TIMEOUT,
  INVENTORY_ONHOLD
};
