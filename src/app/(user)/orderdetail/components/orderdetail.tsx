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
import { PaymentInfoStatus, PaymentInfoStatusText, OrderStatus } from "@/const/products";
import useGetOrderById from "../../orderhistory/hooks/useGetOrderById";
import { previewShipping } from "@/services/stripe/api-services";

const OrderTrackingTimeline = ({ order, estimatedDeliveryDate }: { order: OrderResponse; estimatedDeliveryDate?: Date | null }) => {
  const hasShippedItems = order.details.some(detail =>
    detail.status === OrderStatus.DELIVEREDING || detail.status === OrderStatus.DELIVERED
  );

  const hasDeliveredItems = order.details.some(detail =>
    detail.status === OrderStatus.DELIVERED
  );

  const trackingSteps = [
    {
      id: 1,
      title: "Đơn Hàng Đã Đặt",
      time: format(new Date(order.placedAt), "HH:mm dd-MM-yyyy"),
      status: "completed",
      icon: <Package className="w-5 h-5" />,
    },
    {
      id: 2,
      title: "Đơn Hàng Đã Thanh Toán",
      time: order.payment.paidAt ? format(new Date(order.payment.paidAt), "HH:mm dd-MM-yyyy") : "",
      status: order.payment.status === PaymentInfoStatus.Paid || order.payment.status === PaymentInfoStatus.Completed ? "completed" : "pending",
      icon: <Receipt className="w-5 h-5" />,
    },
    {
      id: 3,
      title: "Đã Giao Cho ĐVVC",
      time: order.payment.paidAt ? format(new Date(order.payment.paidAt), "HH:mm dd-MM-yyyy") : "",
      status: order.payment.status === PaymentInfoStatus.Paid || order.payment.status === PaymentInfoStatus.Completed ? "completed" : "pending",
      icon: <Truck className="w-5 h-5" />,
    },
    {
      id: 4,
      title: "Chờ giao hàng",
      time: hasDeliveredItems && order.completedAt
        ? format(new Date(order.completedAt), "HH:mm dd-MM-yyyy")
        : estimatedDeliveryDate && !hasDeliveredItems
          ? `Dự kiến: ${format(estimatedDeliveryDate, "dd-MM-yyyy")}`
          : "",
      status: hasDeliveredItems ? "completed" : hasShippedItems ? "completed" : "pending",
      icon: <Hourglass className="w-5 h-5" />,
    },
    {
      id: 5,
      title: "Đơn Hàng Đã Hoàn Thành",
      time: order.completedAt ? format(new Date(order.completedAt), "HH:mm dd-MM-yyyy") : "",
      status: hasDeliveredItems ? "completed" : "pending",
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
  const [shippingData, setShippingData] = useState<API.ShipmentPreview[] | null>(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    const fetchData = async () => {
      const res = await getOrderDetailApi(orderId as string);
      if (res?.isSuccess) {
        setOrder(res.value.data);
      }
    };
    fetchData();
  }, [orderId]);

  useEffect(() => {
    const fetchShippingData = async () => {
      if (!order || !order.shippingAddress) {
        setShippingData(null);
        setIsLoadingShipping(false);
        return;
      }

      setIsLoadingShipping(true);
      try {
        const items: REQUEST.CreateOrderItem[] = order.details.map(item => ({
          productId: item.productId || "",
          productName: item.productName || "",
          blindBoxId: item.blindBoxId || "",
          blindBoxName: item.blindBoxName || "",
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        }));

        const payload: REQUEST.CreateOrderList = {
          items,
          isShip: true,
        };

        const result = await previewShipping(payload);
        if (result.isSuccess) {
          setShippingData(result.value.data);
        } else {
          setShippingData(null);
        }
      } catch (error) {
        console.error("Error fetching shipping data:", error);
        setShippingData(null);
      } finally {
        setIsLoadingShipping(false);
      }
    };

    fetchShippingData();
  }, [order]);

  if (isPending || !order) {
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

  const totalItems = order.details.reduce((sum, item) => sum + item.quantity, 0);

  const shippingFee: number = order.shippingAddress && shippingData
    ? shippingData.reduce((acc, shipment) => acc + shipment.ghnPreviewResponse.totalFee, 0)
    : 0;

  const discountAmount = Math.max(0, order.payment.amount - order.payment.netAmount);

  const hasShipping = !!order.shippingAddress;

  const getEstimatedDeliveryDate = () => {
    if (!hasShipping || !shippingData || shippingData.length === 0) {
      return null;
    }

    const deliveryTimes = shippingData
      .map(shipment => shipment.ghnPreviewResponse.expectedDeliveryTime)
      .filter(time => time)
      .map(time => new Date(time));

    if (deliveryTimes.length === 0) {
      const orderDate = new Date(order.placedAt);
      return addDays(orderDate, 5);
    }

    return new Date(Math.max(...deliveryTimes.map(date => date.getTime())));
  };

  const estimatedDeliveryDate = getEstimatedDeliveryDate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 mt-40">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 font-poppins">MÃ ĐƠN HÀNG: {order.id.slice(0, 12).toUpperCase()}</div>
          <div className="text-sm text-green-500 font-poppins">
            {order.completedAt ? "ĐƠN HÀNG ĐÃ HOÀN THÀNH" : "ĐANG XỬ LÝ"}
          </div>
        </div>
      </div>

      <OrderTrackingTimeline order={order} estimatedDeliveryDate={estimatedDeliveryDate} />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Địa Chỉ Nhận Hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {order.shippingAddress ? (
            <div className="space-y-2">
              <div className="font-medium">{order.shippingAddress.fullName}</div>
              <div className="text-sm text-gray-600">{order.shippingAddress.phone}</div>
              <div className="text-sm text-gray-600">
                {order.shippingAddress.addressLine}, {order.shippingAddress.city}, {order.shippingAddress.province}
                {order.shippingAddress.postalCode && `, ${order.shippingAddress.postalCode}`}
                {order.shippingAddress.country && `, ${order.shippingAddress.country}`}
              </div>
              {isLoadingShipping && (
                <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded mt-2 inline-block">
                  <Truck className="w-3 h-3 inline mr-1" />
                  Đang tính phí vận chuyển...
                </div>
              )}
              <div>
                {!isLoadingShipping && shippingFee > 0 && (
                  <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mt-2 inline-block">
                    <Truck className="w-3 h-3 inline mr-1" />
                    Phí vận chuyển: ₫{shippingFee.toLocaleString("vi-VN")}
                  </div>
                )}
                {!isLoadingShipping && shippingFee === 0 && hasShipping && (
                  <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded mt-2 inline-block">
                    <Truck className="w-3 h-3 inline mr-1" />
                    Miễn phí vận chuyển
                  </div>
                )}
              </div>
              {!isLoadingShipping && estimatedDeliveryDate && (
                <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded mt-2 inline-block">
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                  Dự kiến giao: {format(estimatedDeliveryDate, "dd/MM/yyyy", { locale: vi })}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic">
              Đơn hàng chưa có giao hàng tận nơi.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Sản phẩm đã đặt</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {order.details.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border rounded-lg cursor-pointer transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-md" onClick={() => {
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
                  <h3 className="font-medium text-gray-900 truncate">
                    {item.blindBoxName || item.productName}
                  </h3>
                  {item.blindBoxId && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      Blindbox
                    </Badge>
                  )}
                  <div className="text-sm text-gray-500 mt-1">
                    Phân loại hàng: {item.blindBoxId ? "Blindbox Item" : "Product"}
                  </div>
                  <div className="text-sm text-gray-500">
                    x{item.quantity}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500 line-through">
                    ₫{(item.unitPrice * 1.2 * item.quantity).toLocaleString("vi-VN")}
                  </div>
                  <div className="font-semibold text-red-500">
                    ₫{item.totalPrice.toLocaleString("vi-VN")}
                  </div>
                </div>
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
                    isLoadingShipping ? (
                      <span className="text-gray-500">Đang tính...</span>
                    ) : shippingFee > 0 ? (
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
              {order.promotionNote && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Khuyến mãi</span>
                  <span className="text-green-600">{order.promotionNote}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Thành tiền</span>
                <span className="text-red-500">₫{order.payment.netAmount.toLocaleString("vi-VN")}</span>
              </div>
              <div className="text-sm text-gray-500">
                Phương thức Thanh toán: {order.payment.method}
              </div>
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
                Đơn hàng của bạn sẽ được giao trong vòng 3–5 ngày làm việc. Vui lòng kiểm tra tình trạng giao hàng trong phần Theo dõi đơn hàng.
              </TabsContent>

            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
