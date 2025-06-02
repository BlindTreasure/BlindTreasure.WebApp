"use client";

import AdminHeader from "@/components/admin-header";
import SellerSidebar from "@/components/seller-sidebar";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useServiceGetSellerProfile } from "@/services/account/services";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { data, isLoading, isError } = useServiceGetSellerProfile();
  const [showFullLayout, setShowFullLayout] = useState(true);

  useEffect(() => {
    if (!data) return;

    const sellerStatus = data.value?.data.sellerStatus;

    if (sellerStatus === "InfoEmpty") {
      if (pathname !== "/seller/information") {
        router.push("/seller/information");
      }
      setShowFullLayout(false);
    } else if (sellerStatus === "WaitingReview") {
      if (pathname !== "/seller/pending") {
        router.push("/seller/pending");
      }
      setShowFullLayout(false);
    } else {
      setShowFullLayout(true);
    }
  }, [data, pathname, router]);

  if (isLoading) return <div className="p-4">Đang tải...</div>;
  if (isError || !data) return <div className="p-4 text-red-500">Không thể tải thông tin người bán.</div>;

  return (
    <div className="flex h-screen">
      {showFullLayout && <SellerSidebar />}
      <div className="flex flex-col flex-1 overflow-hidden">
          <div className="min-h-[76px] bg-white shadow-md">
            <AdminHeader />
          </div>
        <main className="flex-grow p-4 bg-gray-100 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
