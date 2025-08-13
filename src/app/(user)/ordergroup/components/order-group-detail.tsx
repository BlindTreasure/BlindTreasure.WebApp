"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderResponse } from "@/services/order/typings";
import { PaymentInfoStatusText } from "@/const/products";
import useGetOrdersByGroup from "../../thankyou/hooks/useGetOrdersByGroup";
import { Package, Store, Calendar, CreditCard, ArrowLeft, ShoppingBag, Gift } from "lucide-react";
import { formatCurrency } from "@/utils/format";

export default function OrderGroupDetail() {
  const { groupId } = useParams();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { getOrdersByGroupApi, isPending } = useGetOrdersByGroup();
  const router = useRouter();

  useEffect(() => {
    if (!groupId) return;

    const fetchOrders = async () => {
      try {
        setError(null);
        const response = await getOrdersByGroupApi(groupId as string);
        if (response?.isSuccess && response.value?.data) {
          setOrders(response.value.data || []);
        } else {
          setError("Không tìm thấy nhóm đơn hàng hoặc bạn không có quyền truy cập.");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải thông tin nhóm đơn hàng.");
      }
    };

    fetchOrders();
  }, [groupId]);

  const handleViewOrder = (orderId: string) => {
    router.push(`/orderhistory/${orderId}`);
  };

  const handleBackToPurchased = () => {
    router.push("/purchased");
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy nhóm đơn hàng</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={handleBackToPurchased} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách đơn hàng
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Nhóm đơn hàng trống</h2>
            <p className="text-gray-600 mb-6">Không có đơn hàng nào trong nhóm này.</p>
            <Button onClick={handleBackToPurchased} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách đơn hàng
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalAmount = orders?.reduce((sum, order) => sum + order.finalAmount, 0) || 0;
  const totalItems = orders?.reduce((sum, order) => sum + order.details.length, 0) || 0;
  const uniqueShops = new Set(orders?.map(o => o.sellerId) || []).size;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            onClick={handleBackToPurchased}
            variant="ghost"
            className="mb-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách đơn hàng
          </Button>

          <div className="bg-white rounded-xl shadow-sm p-6 mt-20">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Chi tiết nhóm đơn hàng</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{orders?.length || 0}</div>
                <div className="text-sm text-gray-600">Đơn hàng</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{uniqueShops}</div>
                <div className="text-sm text-gray-600">Cửa hàng</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{totalItems}</div>
                <div className="text-sm text-gray-600">Sản phẩm</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalAmount)}</div>
                <div className="text-sm text-gray-600">Tổng tiền</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {orders?.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base flex items-center gap-2 font-semibold">
                    <Store className="h-5 w-5 text-orange-500" />
                    {order.seller?.companyName || "Cửa hàng"}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex gap-3 pb-2">
                  {order.details.slice(0, 4).map((detail, index) => {
                    const isBlindbox = detail.blindBoxId && detail.blindBoxName;
                    const itemName = isBlindbox ? detail.blindBoxName : detail.productName;
                    const itemImage = isBlindbox ? detail.blindBoxImage : detail.productImages?.[0];

                    return (
                      <div
                        key={index}
                        className="flex-shrink-0 flex items-center gap-2 p-2 min-w-0"
                      >
                        <img
                          src={itemImage || "/placeholder-product.jpg"}
                          alt={itemName || ""}
                          className="w-14 h-14 rounded object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate max-w-36">
                            {itemName}
                          </p>
                          <p className="text-xs text-gray-500">
                            x{detail.quantity} - {formatCurrency(detail.totalPrice)}
                          </p>
                          {isBlindbox && (
                            <p className="text-xs text-purple-600 font-medium">
                              Blindbox
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {order.details.length > 4 && (
                    <div className="flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg p-2 min-w-16">
                      <span className="text-sm text-gray-600">
                        +{order.details.length - 4}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  {order.payment && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <CreditCard className="h-4 w-4" />
                      <span>{PaymentInfoStatusText[order.payment.status]}</span>
                    </div>
                  )}
                  <Button
                    onClick={() => handleViewOrder(order.id)}
                    className="bg-orange-600 hover:bg-orange-700 text-white h-9 px-4"
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
