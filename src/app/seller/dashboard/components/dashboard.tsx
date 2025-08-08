"use client";
import useRedirectIfSellerInfoEmpty from "@/app/seller/dashboard/hooks/useRedirectIfSellerInfoEmpty";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import OrderStatusStats from "@/components/ecommerce/OrderStatusStats";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import TopBlindboxes from "@/components/ecommerce/TopBlindboxes";
import TopProducts from "@/components/ecommerce/TopProducts";
import React from "react";

export default function SellerDashboard() {
  const { sellerInfo, isPending } = useRedirectIfSellerInfoEmpty();

  if (isPending || !sellerInfo) {
    return <p>Đang tải...</p>;
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 mt-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />
      </div>
      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>
      <div className="col-span-12">
        <StatisticsChart />
      </div>
      <div className="col-span-12">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <TopProducts />
          <TopBlindboxes />
          <OrderStatusStats />
        </div>
      </div>
    </div>
  );
}
