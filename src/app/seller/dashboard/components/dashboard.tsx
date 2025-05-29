"use client";
import useRedirectIfSellerInfoEmpty from "@/app/seller/dashboard/hooks/useRedirectIfSellerInfoEmpty";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
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
        <RecentOrders />
      </div>
    </div>
  );
}
