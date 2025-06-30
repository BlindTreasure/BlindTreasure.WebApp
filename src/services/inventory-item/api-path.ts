const INVENTORY_ITEMS = "/inventory-items";
const INVENTORY_ITEM_BY_ID = (id: string) => `${INVENTORY_ITEMS}/${id}`;

export default {
  INVENTORY_ITEMS,
  INVENTORY_ITEM_BY_ID,
};
