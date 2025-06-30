"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OrderResponse } from "@/services/order/typings";
import { PaymentInfoStatus, PaymentStatus } from "@/const/products";
import useGetAllOrder from "../hooks/useGetOrderByCustomer";
import OrderCard from "@/components/order-card";

export const TAB_MAP = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ thanh toán", statuses: [PaymentInfoStatus.Pending] },
    { value: "completed", label: "Đã thanh toán", statuses: [PaymentInfoStatus.Paid, PaymentInfoStatus.Completed] },
    { value: "cancelled", label: "Đã hủy", statuses: [PaymentInfoStatus.Cancelled, PaymentInfoStatus.Failed, PaymentInfoStatus.Expired] },
];

export default function Purchased() {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const { getAllOrderApi, isPending } = useGetAllOrder();

    useEffect(() => {
        const fetchOrders = async () => {
            const res = await getAllOrderApi();
            if (res?.value.data) {
                setOrders(res.value.data);
            }
        };
        fetchOrders();
    }, []);


    const renderOrders = (tabValue: string) => {
        const tab = TAB_MAP.find((t) => t.value === tabValue);

        let filteredOrders = orders;

        if (tab && tab.statuses) {
            filteredOrders = orders.filter((order) =>
                tab.statuses!.includes(order.payment?.status as PaymentInfoStatus)
            );
        }

        return filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-center text-gray-500">
                <img
                    src="/images/no-order.jpg"
                    alt="Không có đơn hàng"
                    className="w-40 h-40 mb-4 opacity-60"
                />
                <p>Không có đơn hàng nào</p>
            </div>

        ) : (
            filteredOrders.map((order) => {
                return (
                    <OrderCard
                        key={order.id}
                        orderId={order.id}
                        shopName="Blind Treasure"
                        details={order.details}
                        total={order.totalAmount}
                        deliveryDate={new Date(order.placedAt).toLocaleDateString("vi-VN")}
                        payment={order.payment}
                        shippingAddress={order.shippingAddress}
                    />
                );
            })
        );
    };

    return (
        <div className="container py-10 mt-36">
            <Tabs defaultValue="all">
                <TabsList className="w-full flex bg-white items-center justify-center border-b border-gray-200">
                    {TAB_MAP.map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="flex-1 text-sm font-medium py-2 text-center border-b-2 border-transparent
            text-slate-700
                 data-[state=active]:text-red-500
                 data-[state=active]:border-red-500
                 data-[state=active]:bg-transparent
                 data-[state=active]:shadow-none
                 data-[state=active]:rounded-none
                 transition-all"
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="mt-6">
                    {TAB_MAP.map((tab) => (
                        <TabsContent key={tab.value} value={tab.value}>
                            {isPending ? (
                                <div className="text-gray-500">Đang tải đơn hàng...</div>
                            ) : (
                                renderOrders(tab.value)
                            )}
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </div>
    );
}
