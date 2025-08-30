"use client";
import React from "react";
import { RevenueMetrics } from "./RevenueMetrics";
import { OrderMetrics } from "./OrderMetrics";
import { UserMetrics } from "./UserMetrics";
import { TopCategories } from "./TopCategories";
import { OverviewChart } from "./OverviewChart";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 mt-6">
        <div className="col-span-12 space-y-6 xl:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RevenueMetrics />
                <OrderMetrics/>
            </div>
            <OverviewChart/>
        </div>
        <div className="col-span-12 xl:col-span-4 space-y-6">
            <UserMetrics />
            <TopCategories />
        </div>
    </div>
  );
}
