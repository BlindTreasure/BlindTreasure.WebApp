"use client";

import SellerSidebar from "@/components/seller-sidebar";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useServiceGetSellerProfile } from "@/services/account/services";
import SellerHeader from "@/components/seller-header";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { setUser } from "@/stores/user-slice";
import { getAccountProfile } from "@/services/account/api-services";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.userSlice);

  const { data, isLoading, isError, refetch } = useServiceGetSellerProfile();
  const [showFullLayout, setShowFullLayout] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (userState.user) {
      return;
    }

    const loadUserProfile = async () => {
      try {
        const profileRes = await getAccountProfile();
        const profile = profileRes?.value?.data;

        if (profile) {
          dispatch(setUser(profile));
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    };
    loadUserProfile();
  }, [dispatch, userState.user]);

  const sellerStatus = data?.value?.data?.sellerStatus;

  useEffect(() => {
    if (sellerStatus !== "WaitingReview") return;

    const interval = setInterval(() => {
      console.log("Auto refetching seller profile...");
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [sellerStatus, refetch]);

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

  if (isError || (!isLoading && !data)) {
    return <div className="p-4 text-red-500">Không thể tải thông tin người bán.</div>;
  }

  return (
    <div className="flex h-screen">
      {showFullLayout && <SellerSidebar />}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="min-h-[76px] bg-white shadow-md">
          <SellerHeader />
        </div>
        <main className="flex-grow p-4 bg-gray-100 overflow-y-auto">
          {isLoading && !data ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
                <p className="text-gray-600">Đang tải dữ liệu...</p>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
