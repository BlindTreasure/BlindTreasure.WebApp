const ADMIN = "/administrator";
const ORDERS = `${ADMIN}/orders`;
const PAYOUTS = `${ADMIN}/payouts`;
const CONFIRM = (payoutId: string) => `${ADMIN}/payouts/${payoutId}/confirm`;
const FORCE_RELEASE_HOLD = (inventoryItemId: string) => `${ADMIN}/inventory/${inventoryItemId}/force-release-hold`
const FORCE_TIMEOUT = (tradeRequestId: string) => `${ADMIN}/trades/${tradeRequestId}/force-timeout`
const INVENTORY_ONHOLD = ADMIN + "/inventory/onhold"
const STRIPE_TRANSACTIONS = ADMIN + "/stripe-transactions"
const DETAIL_TRANSACTIONS = (id: string) => `${ADMIN}/stripe-transactions/${id}`
const SHIPMENT_LIST = ADMIN + "/shipments"
const INVENTORY_ITEMS = ADMIN + "/inventory-items"
const USER = ADMIN + "/users"

export default {
  ADMIN,
  ORDERS,
  PAYOUTS,
  CONFIRM,
  FORCE_RELEASE_HOLD,
  FORCE_TIMEOUT,
  INVENTORY_ONHOLD,
  STRIPE_TRANSACTIONS,
  DETAIL_TRANSACTIONS,
  SHIPMENT_LIST,
  INVENTORY_ITEMS,
  USER
};
