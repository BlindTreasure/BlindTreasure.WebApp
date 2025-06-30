const CUSTOMER_INVENTORY = "/customer-inventories";
const CUSTOMER_INVENTORY_WITH_ID = (id: string) => `${CUSTOMER_INVENTORY}/${id}`;
const CUSTOMER_INVENTORY_OPEN = (id: string) => `${CUSTOMER_INVENTORY}/${id}/open`;

export default {
  CUSTOMER_INVENTORY,
  CUSTOMER_INVENTORY_WITH_ID,
  CUSTOMER_INVENTORY_OPEN,
};
