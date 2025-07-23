const INVENTORY_ITEMS = "/inventory-items";
const INVENTORY_ITEM_BY_ID = (id: string) => `${INVENTORY_ITEMS}/${id}`;
const INVENTORY_ITEM_BY_BLINDBOX = (blindBoxId: string) => `${INVENTORY_ITEMS}/by-blindbox/${blindBoxId}`;
const REQUEST_SHIPMENT = INVENTORY_ITEMS + "/request-shipment";
const PREVIEW_SHIPMENT = INVENTORY_ITEMS + "/preview-shipment";

export default {
  INVENTORY_ITEMS,
  INVENTORY_ITEM_BY_ID,
  INVENTORY_ITEM_BY_BLINDBOX,
  REQUEST_SHIPMENT,
  PREVIEW_SHIPMENT,
};
