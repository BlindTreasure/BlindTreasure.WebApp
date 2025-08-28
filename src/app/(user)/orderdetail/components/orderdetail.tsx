"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format, addDays } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowLeft, Package, Truck, CheckCircle, MapPin, Receipt, Hourglass } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderResponse } from "@/services/order/typings";
import { PaymentInfoStatus, PaymentInfoStatusText, OrderStatus, OrderStatusText } from "@/const/products";
import useGetOrderById from "../../orderhistory/hooks/useGetOrderById";
import ShipmentLogsCard from "./ShipmentLogsCard";

const getActualStatusFromLogs = (logs: string, currentStatus: OrderStatus): OrderStatus => {
  if (!logs) return currentStatus;

  const logLines = logs.split('\n');

  const hasDelivered = logLines.some(line =>
    line.includes('Delivered') || line.includes('delivered')
  );

  const hasDelivering = logLines.some(line =>
    line.includes('Delivering')
  );

  const hasShipmentRequest = logLines.some(line =>
    line.includes('Shipment requested by user') ||
    line.includes('requested shipment')
  );

  if (hasDelivered) return OrderStatus.DELIVERED;
  if (hasDelivering) return OrderStatus.DELIVEREDING;
  if (hasShipmentRequest) return OrderStatus.SHIPPING_REQUESTED;

  return currentStatus;
};

const OrderTrackingTimeline = ({
  order,
  estimatedDeliveryDate
}: {
  order: OrderResponse;
  estimatedDeliveryDate?: Date | null;
}) => {
  const detailsWithActualStatus = order.details.map(detail => ({
    ...detail,
    actualStatus: getActualStatusFromLogs(detail.logs || '', detail.status)
  }));

  const hasDeliveringItems = detailsWithActualStatus.some(
    detail => detail.actualStatus === OrderStatus.DELIVEREDING
  );

  const hasDeliveredItems = detailsWithActualStatus.some(
    detail => detail.actualStatus === OrderStatus.DELIVERED
  );

  const isStepCompleted = (stepId: number): boolean => {
    switch (stepId) {
      case 1:
        return true;
      case 2:
        return (
          order.payment?.status === PaymentInfoStatus.Paid ||
          order.payment?.status === PaymentInfoStatus.Completed ||
          hasDeliveredItems
        );
      case 3:
      case 4:
        return hasDeliveringItems || hasDeliveredItems;
      case 5:
        return hasDeliveredItems;
      default:
        return false;
    }
  };

  const deliveringTimeFromLogs = detailsWithActualStatus
    .map(detail => {
      const match = detail.logs?.match(/\[(.*?)\].*Delivering/);
      return match ? new Date(match[1]) : null;
    })
    .filter(Boolean)
    .sort()
    .at(0);

  const trackingSteps = [
    {
      id: 1,
      title: "Đơn Hàng Đã Đặt",
      time: order.placedAt ? format(new Date(order.placedAt), "HH:mm dd-MM-yyyy") : "Không xác định",
      status: isStepCompleted(1) ? "completed" : "pending",
      icon: <Package className="w-5 h-5" />,
    },
    {
      id: 2,
      title: "Đơn Hàng Đã Thanh Toán",
      time: order.completedAt ? format(new Date(order.completedAt), "HH:mm dd-MM-yyyy") : "Chưa hoàn thành",
      status: isStepCompleted(2) ? "completed" : "pending",
      icon: <Receipt className="w-5 h-5" />,
    },
    {
      id: 3,
      title: "Dự Kiến Giao Cho ĐVVC",
      time: (() => {
        const firstShipment = order.details?.find(detail =>
          detail.shipments && detail.shipments.length > 0
        )?.shipments?.[0];

        if (firstShipment?.estimatedPickupTime) {
          const date = new Date(firstShipment.estimatedPickupTime);
          return !isNaN(date.getTime()) ? format(date, "HH:mm dd-MM-yyyy") : "";
        }
        return "";
      })(),
      status: isStepCompleted(3) ? "completed" : "pending",
      icon: <Truck className="w-5 h-5" />,
    },
    {
      id: 4,
      title: "Chờ Giao Hàng",
      time: (() => {
        const firstShipment = order.details?.find(detail =>
          detail.shipments && detail.shipments.length > 0
        )?.shipments?.[0];

        if (firstShipment?.estimatedDelivery) {
          const date = new Date(firstShipment.estimatedDelivery);
          return !isNaN(date.getTime()) ? format(date, "HH:mm dd-MM-yyyy") : "";
        }
        return "";
      })(),
      status: isStepCompleted(4) ? "completed" : "pending",
      icon: <Hourglass className="w-5 h-5" />,
    },
    {
      id: 5,
      title: "Đơn Hàng Đã Hoàn Thành",
      time: (() => {
        const firstShipment = order.details?.find(detail =>
          detail.shipments && detail.shipments.length > 0
        )?.shipments?.[0];

        if (firstShipment?.shippedAt) {
          const date = new Date(firstShipment.shippedAt);
          return !isNaN(date.getTime()) ? format(date, "HH:mm dd-MM-yyyy") : "";
        }
        return "";
      })(),
      status: isStepCompleted(5) ? "completed" : "pending",
      icon: <CheckCircle className="w-5 h-5" />,
    },
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
                      ? "bg-green-100 border-green-500 text-green-600"
                      : "bg-gray-100 border-gray-300 text-gray-400"
                    }`}
                >
                  {step.icon}
                </div>

                <div className="flex flex-col items-center">
                  <h3
                    className={`text-sm font-medium ${step.status === "completed" ? "text-gray-900" : "text-gray-500"
                      }`}
                  >
                    {step.title}
                  </h3>
                  {step.time && (
                    <p className="text-xs text-gray-500 mt-1">{step.time}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function OrderDetail() {
  const { orderId } = useParams();
  const router = useRouter();
  const { getOrderDetailApi, isPending } = useGetOrderById();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [tab, setTab] = useState("order");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    const fetchData = async () => {
      try {
        setError(null);
        const res = await getOrderDetailApi(orderId as string);
        if (res?.isSuccess) {
          setOrder(res.value.data);
        } else {
          setError("Không tìm thấy đơn hàng hoặc bạn không có quyền truy cập.");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải thông tin đơn hàng.");
      }
    };
    fetchData();
  }, [orderId]);



  if (isPending) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-4">
        <Skeleton className="h-6 w-1/2" />
        <Card><CardContent className="p-4 space-y-3"><Skeleton className="h-4 w-full" /></CardContent></Card>
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-4 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen px-4">
        <div className="text-center max-w-md">
          <img
            src="/images/Empty-items.jpg"
            alt="Không tìm thấy đơn hàng"
            className="w-48 h-48 mx-auto mb-6 opacity-60"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy đơn hàng
          </h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/purchased')}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Xem đơn hàng của tôi
            </button>
            <button
              onClick={() => router.back()}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen px-4">
        <div className="text-center max-w-md">
          <img
            src="/images/Empty-items.jpg"
            alt="Không có dữ liệu"
            className="w-48 h-48 mx-auto mb-6 opacity-60"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không có dữ liệu đơn hàng
          </h2>
          <p className="text-gray-600 mb-6">
            Đang tải thông tin đơn hàng, vui lòng thử lại.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  const shippingFee: number = order.details.reduce((total, detail) => {
    const detailShippingFee = detail.shipments?.reduce((shipTotal, shipment) =>
      shipTotal + (shipment.totalFee || 0), 0) || 0;
    return total + detailShippingFee;
  }, 0) || 0;

  const discountAmount = order.payment
    ? Math.max(0, order.payment.amount - order.payment.netAmount)
    : 0;

  const hasShipping = order.details.some(detail => detail.shipments && detail.shipments.length > 0);

  const getEstimatedDeliveryDate = () => {
    if (!hasShipping || order.status === "PENDING") {
      return null;
    }

    const deliveryDates = order.details
      .flatMap(detail => detail.shipments || [])
      .map(shipment => shipment.estimatedDelivery)
      .filter(date => date)
      .map(date => new Date(date));

    if (deliveryDates.length > 0) {
      return new Date(Math.max(...deliveryDates.map(date => date.getTime())));
    }

    if (order.completedAt) {
      return null;
    }

    if (order.placedAt) {
      const orderDate = new Date(order.placedAt);
      if (!isNaN(orderDate.getTime())) {
        return addDays(orderDate, 5);
      }
    }
    return null;
  };

  const estimatedDeliveryDate = getEstimatedDeliveryDate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 mt-40">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 font-poppins">MÃ ĐƠN HÀNG: {order.id.slice(0, 12).toUpperCase()}</div>
        </div>
      </div>

      <OrderTrackingTimeline order={order} estimatedDeliveryDate={estimatedDeliveryDate} />

      {order.details.some(item => item.shipments && item.shipments.length > 0) && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Thông tin vận chuyển</h2>
          {order.details.map(item =>
            item.shipments?.map(shipment => (
              <ShipmentLogsCard key={shipment.id} shipmentId={shipment.id} />
            ))
          )}
        </div>
      )}


      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Sản phẩm đã đặt</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {order.details.map((item, index) => (
              <div key={index}>
                <div className="flex items-start gap-4 p-4 border rounded-lg cursor-pointer transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-md" onClick={() => {
                  if (item.blindBoxId) {
                    router.push(`/detail-blindbox/${item.blindBoxId}`);
                  } else {
                    router.push(`/detail/${item.productId}`);
                  }
                }}>
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                    {item.blindBoxImage || (item.productImages && item.productImages.length > 0) ? (
                      <img
                        src={item.blindBoxImage || item.productImages[0]}
                        alt={item.blindBoxName || item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.blindBoxName || item.productName}
                      </h3>
                      {item.blindBoxId && (
                        <Badge variant="secondary" className="text-xs">
                          Blindbox
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {(() => {
                        const actualStatus = getActualStatusFromLogs(item.logs || '', item.status);
                        return (
                          <Badge
                            className={`text-xs font-medium uppercase border pointer-events-none
      ${actualStatus === OrderStatus.CANCELLED
                                ? "bg-red-100 text-red-700 border-red-200"
                                : actualStatus === OrderStatus.PENDING
                                  ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                  : actualStatus === OrderStatus.SHIPPING_REQUESTED
                                    ? "bg-blue-100 text-blue-700 border-blue-200"
                                    : actualStatus === OrderStatus.DELIVEREDING
                                      ? "bg-green-100 text-green-700 border-green-200"
                                      : actualStatus === OrderStatus.DELIVERED
                                        ? "bg-purple-100 text-purple-700 border-purple-200"
                                        : actualStatus === OrderStatus.IN_INVENTORY
                                          ? "bg-teal-100 text-teal-700 border-teal-200"
                                          : "bg-gray-100 text-gray-600 border-gray-200"
                              }
    `}
                          >
                            {OrderStatusText[actualStatus] ?? "Không xác định"}
                          </Badge>
                        );
                      })()}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Phân loại hàng: {item.blindBoxId ? "Blindbox Item" : "Product"}
                    </div>
                    <div className="text-sm text-gray-500">
                      x{item.quantity}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-red-500">
                      ₫{item.totalPrice.toLocaleString("vi-VN")}
                    </div>
                  </div>
                </div>
                {/* {item.shipments && item.shipments.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {item.shipments.map(shipment => (
                      <ShipmentLogsCard key={shipment.id} shipmentId={shipment.id} />
                    ))}
                  </div>
                )} */}
              </div>
            ))}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tổng tiền hàng</span>
                <span>₫{order.totalAmount.toLocaleString("vi-VN")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span>
                  {hasShipping ? (
                    shippingFee > 0 ? (
                      `₫${shippingFee.toLocaleString("vi-VN")}`
                    ) : (
                      <span className="text-green-600">Miễn phí</span>
                    )
                  ) : (
                    <span className="text-gray-400">Không áp dụng</span>
                  )}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Giảm giá</span>
                  <span className="text-green-600">-₫{discountAmount.toLocaleString("vi-VN")}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Thành tiền</span>
                <span className="text-red-500">₫{(order.totalAmount + shippingFee - discountAmount).toLocaleString("vi-VN")}</span>
              </div>
              {order.payment?.method && (
                <div className="text-sm text-gray-500">
                  Phương thức Thanh toán: {order.payment.method}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button variant="outline" className="flex-1 sm:flex-none">
          Liên Hệ Người Bán
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hỗ trợ</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="flex gap-2 overflow-x-auto whitespace-nowrap pl-32 md:pl-1">
              <TabsTrigger className="w-full text-center" value="order">Vấn đề đơn hàng</TabsTrigger>
              <TabsTrigger className="w-full text-center" value="shipping">Thông tin giao hàng</TabsTrigger>

            </TabsList>
            <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-md border">
              <TabsContent value="order">
                Nếu bạn gặp sự cố với đơn hàng, vui lòng liên hệ chúng tôi qua hotline hoặc gửi yêu cầu hỗ trợ trong mục Liên hệ.
              </TabsContent>
              <TabsContent value="shipping">
                Đơn hàng của bạn sẽ được giao trong vòng 3–5 ngày làm việc. Vui lòng kiểm tra tình trạng giao hàng trong phần "Đơn mua".
              </TabsContent>

            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
