// "use client";

// import { useEffect, useState } from "react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { OrderResponse } from "@/services/order/typings";
// import { PaymentInfoStatus, PaymentStatus } from "@/const/products";
// import useGetAllOrder from "../hooks/useGetOrderByCustomer";
// import OrderCard from "@/components/order-card";

// export const TAB_MAP = [
//     { value: "all", label: "Tất cả" },
//     { value: "pending", label: "Chờ thanh toán", statuses: [PaymentStatus.PENDING] },
//     { value: "completed", label: "Đã thanh toán", statuses: [PaymentStatus.PAID, PaymentStatus.COMPLETED] },
//     { value: "cancelled", label: "Đã hủy", statuses: [PaymentStatus.CANCELLED, PaymentStatus.FAILED, PaymentStatus.EXPIRED] },
// ];

// export default function Purchased() {
//     const [orders, setOrders] = useState<OrderResponse[]>([]);
//     const { getAllOrderApi, isPending } = useGetAllOrder();

//     useEffect(() => {
//         const fetchOrders = async () => {
//             const res = await getAllOrderApi();
//             if (res?.value.data) {
//                 setOrders(res.value.data.result);
//             }
//         };
//         fetchOrders();
//     }, []);


//     const renderOrders = (tabValue: string) => {
//         const tab = TAB_MAP.find((t) => t.value === tabValue);

//         let filteredOrders = orders;

//         if (tab && tab.statuses) {
//             filteredOrders = orders.filter((order) =>
//                 tab.statuses!.includes(order.status as PaymentStatus)
//             );
//         }

//         return filteredOrders.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-[300px] text-center text-gray-500">
//                 <img
//                     src="/images/no-order.jpg"
//                     alt="Không có đơn hàng"
//                     className="w-40 h-40 mb-4 opacity-60"
//                 />
//                 <p>Không có đơn hàng nào</p>
//             </div>

//         ) : (
//             filteredOrders.map((order) => {
//                 return (
//                     <OrderCard
//                         key={order.id}
//                         orderId={order.id}
//                         shopName="Blind Treasure"
//                         details={order.details}
//                         total={order.totalAmount}
//                         deliveryDate={new Date(order.placedAt).toLocaleDateString("vi-VN")}
//                         payment={order.payment}
//                         shippingAddress={order.shippingAddress}
//                     />
//                 );
//             })
//         );
//     };

//     return (
//         <div className="container py-10 mt-36">
//             <Tabs defaultValue="all">
//                 <TabsList className="w-full flex bg-white items-center justify-center border-b border-gray-200">
//                     {TAB_MAP.map((tab) => (
//                         <TabsTrigger
//                             key={tab.value}
//                             value={tab.value}
//                             className="flex-1 text-sm font-medium py-2 text-center border-b-2 border-transparent
//             text-slate-700
//                  data-[state=active]:text-red-500
//                  data-[state=active]:border-red-500
//                  data-[state=active]:bg-transparent
//                  data-[state=active]:shadow-none
//                  data-[state=active]:rounded-none
//                  transition-all"
//                         >
//                             {tab.label}
//                         </TabsTrigger>
//                     ))}
//                 </TabsList>

//                 <div className="mt-6">
//                     {TAB_MAP.map((tab) => (
//                         <TabsContent key={tab.value} value={tab.value}>
//                             {isPending ? (
//                                 <div className="text-gray-500">Đang tải đơn hàng...</div>
//                             ) : (
//                                 renderOrders(tab.value)
//                             )}
//                         </TabsContent>
//                     ))}
//                 </div>
//             </Tabs>
//         </div>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OrderResponse } from "@/services/order/typings";
import { PaymentStatus } from "@/const/products";
import useGetAllOrder from "../hooks/useGetOrderByCustomer";
import OrderCard from "@/components/order-card";
import Pagination from "@/components/pagination"; 

export const TAB_MAP = [
    { value: "all", label: "Tất cả", statuses: undefined },
    { value: "pending", label: "Chờ thanh toán", statuses: [PaymentStatus.PENDING] },
    { value: "completed", label: "Đã thanh toán", statuses: [PaymentStatus.PAID] },
    { value: "cancelled", label: "Đã hủy", statuses: [PaymentStatus.CANCELLED] },
    { value: "failed", label: "Thanh toán thất bại", statuses: [PaymentStatus.FAILED] },
    
];

const PAGE_SIZE = 5;

export default function Purchased() {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [currentTab, setCurrentTab] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { getAllOrderApi, isPending } = useGetAllOrder();

    const fetchOrders = async (tabValue: string, page = 1) => {
        const tab = TAB_MAP.find((t) => t.value === tabValue);
        const statuses = tab?.statuses;

        const res = await getAllOrderApi({
            status: statuses?.length === 1 ? statuses[0] : undefined,
            pageIndex: page,
            pageSize: PAGE_SIZE,
        });

        if (res?.value?.data) {
            setOrders(res.value.data.result);
            setTotalPages(res.value.data.totalPages || 1);
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
            <div className="flex flex-col items-center justify-center h-[300px] text-center text-gray-500">
                <img
                    src="/images/no-order.jpg"
                    alt="Không có đơn hàng"
                    className="w-40 h-40 mb-4 opacity-60"
                />
                <p>Không có đơn hàng nào</p>
            </div>
        ) : (
            <>
                {orders.map((order) => (
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
                ))}
                <div className="mt-8 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </>
        );
    };

    return (
        <div className="container py-10 mt-36">
            <Tabs
                defaultValue="all"
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
                                renderOrders()
                            )}
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </div>
    );
}

