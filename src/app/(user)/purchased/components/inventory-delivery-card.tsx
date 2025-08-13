"use client";

import { Package, Truck, MapPin, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { InventoryItemStatus, InventoryItemStatusText } from "@/const/products";
import { InventoryItem, Shipment } from "@/services/inventory-item/typings";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import useGetItemInventoryById from "../../inventory/hooks/useGetItemInventoryById";

interface InventoryDeliveryCardProps {
  item: InventoryItem;
}

const InventoryTrackingTimeline = ({ item }: { item: InventoryItem }) => {
  const shipment = item.shipment || item.orderDetail?.shipments?.[0];

  const trackingSteps = [
    {
      id: 1,
      title: "Sản phẩm trong kho",
      time: item.product.createdAt ? format(new Date(item.product.createdAt), "HH:mm dd-MM-yyyy") : "Không xác định",
      status: "completed",
      icon: <Package className="w-4 h-4" />
    },
    {
      id: 2,
      title: "Yêu cầu giao hàng",
      time: item.createdAt ? format(new Date(item.createdAt), "HH:mm dd-MM-yyyy") : "Không xác định",
      status: item.status === InventoryItemStatus.Shipment_requested ||
        item.status === InventoryItemStatus.Delivering ||
        item.status === InventoryItemStatus.Delivered ? "completed" : "pending",
      icon: <Truck className="w-4 h-4" />
    },
    {
      id: 3,
      title: "Đang trong quá trình giao hàng",
      time: (() => {
        if (shipment?.estimatedDelivery) {
          return format(new Date(shipment.estimatedDelivery), "HH:mm dd-MM-yyyy");
        }
        if (shipment?.estimatedPickupTime) {
          return format(new Date(shipment.estimatedPickupTime), "HH:mm dd-MM-yyyy");
        }
        if (item.status === InventoryItemStatus.Delivering || shipment?.status === "PROCESSING") {
          return "Đang vận chuyển";
        }
        return "";
      })(),
      status: (() => {
        if (item.status === InventoryItemStatus.Delivered) {
          return "completed";
        }
        if (item.status === InventoryItemStatus.Delivering || shipment?.status === "PROCESSING") {
          return "completed";
        }
        return "pending";
      })(),
      icon: <Truck className="w-4 h-4" />
    },
    {
      id: 4,
      title: "Đã giao thành công",
      time: (() => {
        if (shipment?.shippedAt && item.status === InventoryItemStatus.Delivered) {
          return format(new Date(shipment.shippedAt), "HH:mm dd-MM-yyyy");
        }
        return item.status === InventoryItemStatus.Delivered ? "Đã hoàn thành" : "";
      })(),
      status: item.status === InventoryItemStatus.Delivered ? "completed" : "pending",
      icon: <CheckCircle className="w-4 h-4" />
    }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="relative overflow-x-auto">
          <div className="flex items-start justify-between gap-6 min-w-[600px]">
            {trackingSteps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center text-center relative flex-1">
                {index < trackingSteps.length - 1 && (
                  <div className="absolute top-6 left-1/2 right-[-50%] h-0.5 w-full bg-gray-200 z-0"></div>
                )}

                <div
                  className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 mb-2
                    ${step.status === "completed"
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-gray-100 border-gray-300 text-gray-400"
                    }`}
                >
                  {step.icon}
                </div>

                <div className="space-y-1">
                  <div className={`text-sm font-medium ${step.status === "completed" ? "text-green-600" : "text-gray-400"}`}>
                    {step.title}
                  </div>
                  {step.time && (
                    <div className="text-xs text-gray-500">
                      {step.time}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {item.orderDetail?.shipments && item.orderDetail.shipments.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="font-medium text-gray-900">Thông tin vận chuyển</h4>
            {item.orderDetail.shipments.map((shipment: Shipment, index: number) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Mã vận đơn:</span> {shipment.trackingNumber || "Chưa có"}
                  </div>
                  <div>
                    <span className="font-medium">Nhà vận chuyển:</span> {shipment.provider || "Chưa xác định"}
                  </div>
                  <div>
                    <span className="font-medium">Phí vận chuyển:</span> {shipment.totalFee?.toLocaleString() || 0}₫
                  </div>
                  <div>
                    <span className="font-medium">Dự kiến giao:</span> {
                      shipment.estimatedDelivery
                        ? format(new Date(shipment.estimatedDelivery), "dd/MM/yyyy HH:mm")
                        : "Chưa xác định"
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function InventoryDeliveryCard({ item }: InventoryDeliveryCardProps) {
  const [detailedItem, setDetailedItem] = useState<InventoryItem | null>(null);
  const { getItemInventoryByIdApi, isPending } = useGetItemInventoryById();

  const handleCardClick = async () => {
    try {
      const response = await getItemInventoryByIdApi(item.id);
      if (response?.value?.data) {
        setDetailedItem(response.value.data);
      }
    } catch (error) {
      console.error('Error fetching detailed inventory item:', error);
    }
  };
  const getStatusColor = (status: InventoryItemStatus) => {
    switch (status) {
      case InventoryItemStatus.Delivering:
        return "bg-green-100 text-green-700";
      case InventoryItemStatus.Delivered:
        return "bg-purple-100 text-purple-700";
      case InventoryItemStatus.Shipment_requested:
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <>
      <div className="border rounded-md shadow-sm bg-white mb-4 cursor-pointer hover:shadow-md transition-shadow" onClick={handleCardClick}>
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="bg-purple-600 text-white text-xs px-1 py-0.5 rounded-sm font-bold">
              <Package className="h-3 w-3 inline mr-1" />
              Túi đồ
            </div>
            <div className="font-semibold truncate">Giao hàng từ túi đồ</div>
          </div>
        </div>

        <div className="p-4 flex border-b gap-4">
          <img
            src={item.product?.imageUrls?.[0] || "/placeholder-product.jpg"}
            alt={item.product?.name || "Product"}
            width={80}
            height={80}
            className="object-cover rounded border"
          />
          <div className="flex-1">
            <div className="font-medium mb-2">
              {item.product?.name || "Tên sản phẩm không xác định"}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-block px-2 py-0.5 rounded text-xs font-medium uppercase ${getStatusColor(item.status)}`}
              >
                {InventoryItemStatusText[item.status]}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-red-500 font-semibold">
              {item.product?.price?.toLocaleString() || "0"}₫
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!detailedItem} onOpenChange={() => setDetailedItem(null)}>
        <DialogContent className="max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Theo dõi giao hàng - {detailedItem?.product?.name}</DialogTitle>
          </DialogHeader>

          {detailedItem && (
            <div className="mt-4">
              <InventoryTrackingTimeline item={detailedItem} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
