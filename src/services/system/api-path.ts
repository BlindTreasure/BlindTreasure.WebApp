const SYSTEM = "/system/dev";
const COMPLETED = `${SYSTEM}/simulate-shipment-full-flow`;
const INVENTORY_ITEM_ARCHIVED = (inventoryItemId: string) => `${SYSTEM}/simulate-inventory-item-archived/${inventoryItemId}`;

export default {
  SYSTEM,
  COMPLETED,
  INVENTORY_ITEM_ARCHIVED
};
