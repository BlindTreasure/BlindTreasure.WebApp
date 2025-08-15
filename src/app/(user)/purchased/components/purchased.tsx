"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OrderResponse } from "@/services/order/typings";
import { PaymentStatus, OrderStatus, PaymentInfoStatus, InventoryItemStatus } from "@/const/products";
import { InventoryItem } from "@/services/inventory-item/typings";
import useGetAllOrder from "../hooks/useGetOrderByCustomer";
import useGetOrderDetails from "../hooks/useGetOrderDetails";
import useGetAllItemInventory from "../../inventory/hooks/useGetItemInventory";
import OrderCard from "@/components/order-card";
import Pagination from "@/components/pagination";
import InventoryDeliveryCard from "./inventory-delivery-card";

type TabConfig = {
    value: string;
    label: string;
    statuses?: PaymentStatus[];
    orderStatuses?: OrderStatus[];
};

export const TAB_MAP: TabConfig[] = [
    { value: "all", label: "Tất cả", statuses: undefined },
    { value: "pending", label: "Chờ thanh toán", statuses: [PaymentStatus.PENDING] },
    { value: "completed", label: "Đã thanh toán", statuses: [PaymentStatus.PAID] },
    { value: "shipping", label: "Đang giao hàng", orderStatuses: [OrderStatus.DELIVEREDING] },
    { value: "delivered", label: "Hoàn thành", orderStatuses: [OrderStatus.DELIVERED] },
    { value: "inventory-delivery", label: "Giao hàng túi đồ" },
    { value: "cancelled", label: "Đã hủy", statuses: [PaymentStatus.CANCELLED] },
];

const PAGE_SIZE = 5;

export default function Purchased() {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [currentTab, setCurrentTab] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { getAllOrderApi, isPending } = useGetAllOrder();
    const { getOrderDetailsApi, isPending: isOrderDetailsPending } = useGetOrderDetails();
    const { getAllItemInventoryApi, isPending: isInventoryPending } = useGetAllItemInventory();

    const fetchInventoryItems = async (page = 1) => {
        try {
            const res = await getAllItemInventoryApi({
                pageIndex: page,
                pageSize: PAGE_SIZE,
            });

            if (res?.value?.data?.result && Array.isArray(res.value.data.result)) {
                const deliveryItems = res.value.data.result.filter((item: InventoryItem) =>
                    (item.status === InventoryItemStatus.Delivering ||
                        item.status === InventoryItemStatus.Delivered ||
                        item.status === InventoryItemStatus.Shipment_requested) &&
                    item.orderDetailId === null
                );
                setInventoryItems(deliveryItems);
                setTotalPages(res.value.data.totalPages || 1);
            } else {
                setInventoryItems([]);
                setTotalPages(1);
            }
        } catch (error) {
            console.error('Error fetching inventory items:', error);
            setInventoryItems([]);
            setTotalPages(1);
        }
    };

    const fetchOrders = async (tabValue: string, page = 1) => {
        if (tabValue === "inventory-delivery") {
            await fetchInventoryItems(page);
            return;
        }

        const tab = TAB_MAP.find((t) => t.value === tabValue);
        const statuses = tab?.statuses;
        const orderStatuses = tab?.orderStatuses;

        if (orderStatuses && orderStatuses.length > 0) {
            const res = await getOrderDetailsApi({
                status: orderStatuses[0],
                PageIndex: page,
                PageSize: PAGE_SIZE,
            });

            if (res?.value?.data?.result && Array.isArray(res.value.data.result)) {
                const convertedOrders: OrderResponse[] = res.value.data.result.map(detail => {
                    const firstShipment = detail.shipments?.[0];
                    const shippedDate = firstShipment?.shippedAt || new Date().toISOString();
                    const estimatedDelivery = firstShipment?.estimatedDelivery;
                    const totalShippingFee = detail.shipments?.reduce((total, shipment) => total + (shipment.totalFee || 0), 0) || 0;

                    return {
                        id: detail.orderId,
                        status: PaymentStatus.PAID,
                        totalAmount: detail.totalPrice,
                        placedAt: shippedDate,
                        completedAt: estimatedDelivery || '',
                        checkoutGroupId: '',
                        sellerId: '',
                        seller: undefined,
                        details: [{
                            id: detail.id,
                            logs: detail.logs,
                            orderId: detail.orderId,
                            productId: detail.productId,
                            productName: detail.productName,
                            productImages: detail.productImages || [],
                            blindBoxId: detail.blindBoxId || undefined,
                            blindBoxName: detail.blindBoxName || undefined,
                            blindBoxImage: detail.blindBoxImage || undefined,
                            quantity: detail.quantity,
                            unitPrice: detail.unitPrice,
                            totalPrice: detail.totalPrice,
                            status: detail.status,
                            shipments: detail.shipments || [],
                            inventoryItems: detail.inventoryItems || [],
                            detailDiscountPromotion: detail.detailDiscountPromotion,
                            finalDetailPrice: detail.totalPrice - detail.detailDiscountPromotion,
                        }],
                        payment: {
                            id: '',
                            orderId: detail.orderId,
                            amount: detail.totalPrice,
                            discountRate: 0,
                            netAmount: detail.totalPrice - (detail.detailDiscountPromotion || 0),
                            method: firstShipment?.provider || 'Giao hàng nhanh',
                            status: PaymentInfoStatus.Paid,
                            paymentIntentId: firstShipment?.trackingNumber || '',
                            paidAt: shippedDate,
                            refundedAmount: 0,
                            transactions: []
                        },
                        finalAmount: detail.totalPrice + totalShippingFee,
                        totalShippingFee: totalShippingFee,
                        shippingAddress: firstShipment ? {
                            id: firstShipment.id,
                            fullName: 'Khách hàng',
                            phone: '',
                            addressLine: 'Địa chỉ giao hàng',
                            city: '',
                            province: '',
                            postalCode: '',
                            country: 'Việt Nam'
                        } : undefined
                    };
                });
                setOrders(convertedOrders);
                setTotalPages(res.value.data.totalPages || 1);
            }
        } else {
            const res = await getAllOrderApi({
                status: statuses?.length === 1 ? statuses[0] : undefined,
                pageIndex: page,
                pageSize: PAGE_SIZE,
            });

            if (res?.value?.data) {
                const updatedOrders = res.value.data.result.map(order => {
                    const actualShippingFee = order.details.reduce((total, detail) => {
                        const detailShippingFee = detail.shipments?.reduce((shipTotal, shipment) =>
                            shipTotal + (shipment.totalFee || 0), 0) || 0;
                        return total + detailShippingFee;
                    }, 0);

                    return {
                        ...order,
                        totalShippingFee: actualShippingFee,
                        finalAmount: order.totalAmount + actualShippingFee
                    };
                });

                setOrders(updatedOrders);
                setTotalPages(res.value.data.totalPages || 1);
            }
        }
    };

    useEffect(() => {
        fetchOrders(currentTab, currentPage);
    }, [currentTab, currentPage]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const renderOrders = () => {
        return orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[250px] sm:h-[300px] text-center text-gray-500 px-4">
                <img
                    src="/images/no-order.jpg"
                    alt="Không có đơn hàng"
                    className="w-32 h-32 sm:w-40 sm:h-40 mb-4 opacity-60"
                />
                <p className="text-sm sm:text-base">Không có đơn hàng nào</p>
            </div>
        ) : (
            <>
                <div className="space-y-3 sm:space-y-4">
                    {orders.map((order) => (
                        <OrderCard
                            key={order.id}
                            orderId={order.id}
                            checkoutGroupId={order.checkoutGroupId}
                            shopName="Blind Treasure"
                            details={order.details}
                            total={order.totalAmount}
                            deliveryDate={new Date(order.placedAt).toLocaleDateString("vi-VN")}
                            payment={order.payment}
                            shippingAddress={order.shippingAddress}
                            totalShippingFee={order.totalShippingFee || 0}
                            finalAmount={order.finalAmount}
                        />
                    ))}
                </div>
                {totalPages > 1 && (
                    <div className="mt-6 sm:mt-8 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="container px-3 sm:px-6 py-6 sm:py-10 mt-36">
            <Tabs
                value={currentTab}
                onValueChange={(val) => {
                    setCurrentTab(val);
                    setCurrentPage(1);
                }}
            >
                <TabsList className="w-full flex bg-white items-center justify-center border-b border-gray-200">
                    {TAB_MAP.map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="flex-1 min-w-0 text-xs sm:text-sm font-medium py-2 px-1 sm:px-2 text-center 
    text-slate-700 whitespace-nowrap border-b-2 border-transparent
    data-[state=active]:border-red-500
    data-[state=active]:text-red-500
    data-[state=active]:bg-transparent
    data-[state=active]:shadow-none
    data-[state=active]:rounded-none
    transition-all"
                        >


                            <span className="truncate">{tab.label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="mt-4 sm:mt-6">
                    {TAB_MAP.map((tab) => (
                        <TabsContent key={tab.value} value={tab.value}>
                            {tab.value === "inventory-delivery" ? (
                                isInventoryPending ? (
                                    <div className="text-gray-500 text-center py-8">Đang tải inventory...</div>
                                ) : inventoryItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-[250px] sm:h-[300px] text-center text-gray-500 px-4">
                                        <img
                                            src="/images/no-order.jpg"
                                            alt="Không có đơn hàng"
                                            className="w-32 h-32 sm:w-40 sm:h-40 mb-4 opacity-60"
                                        />
                                        <p className="text-sm sm:text-base">Không có sản phẩm nào đang được giao hàng từ túi đồ</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-3 sm:space-y-4">
                                            {inventoryItems.map((item) => (
                                                <InventoryDeliveryCard key={item.id} item={item} />
                                            ))}
                                        </div>
                                        {totalPages > 1 && (
                                            <div className="mt-6 sm:mt-8 flex justify-center">
                                                <Pagination
                                                    currentPage={currentPage}
                                                    totalPages={totalPages}
                                                    onPageChange={handlePageChange}
                                                />
                                            </div>
                                        )}
                                    </>
                                )
                            ) : (
                                (isPending || isOrderDetailsPending) ? (
                                    <div className="text-gray-500 text-center py-8">Đang tải đơn hàng...</div>
                                ) : (
                                    renderOrders()
                                )
                            )}
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </div>
    );
}
