const INVENTORY_ITEMS = "/inventory-items";
const INVENTORY_ITEM_BY_ID = (id: string) => `${INVENTORY_ITEMS}/${id}`;
const INVENTORY_ITEM_BY_BLINDBOX = (blindBoxId: string) => `${INVENTORY_ITEMS}/by-blindbox/${blindBoxId}`;

export default {
  INVENTORY_ITEMS,
  INVENTORY_ITEM_BY_ID,
  INVENTORY_ITEM_BY_BLINDBOX,
};
