import { ShipmentStatus } from "@/const/products";

export type OrderLog = {
  id: string;
  orderDetailId: string | null;
  shipmentId: string;
  inventoryItemId: string | null;
  logContent: string;
  logTime: string;
  actionType: string;
  oldValue: ShipmentStatus;
  newValue: ShipmentStatus;
  actorId: string | null;
  valueStatusType: "SHIPMENT" | string;
};
