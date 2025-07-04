"use client";

import StaffHeader from "@/components/staff-header";
import StaffSidebar from "@/components/staff-sidebar";
import React, { useEffect } from "react";
import { useAppDispatch } from "@/stores/store";
import { setUser } from "@/stores/user-slice";
import { getAccountProfile } from "@/services/account/api-services";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadStaffProfile = async () => {
      try {
        const profileRes = await getAccountProfile();
        const profile = profileRes?.value?.data;

        if (profile) {
          dispatch(setUser(profile));
        }
      } catch (error) {
        console.error("Failed to load staff profile:", error);
      }
    };

    loadStaffProfile();
  }, [dispatch]);

  return (
    <div className="flex h-screen">
      <StaffSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="min-h-[109px] bg-white shadow-md">
          <StaffHeader />
        </div>
        <main className="flex-grow p-4 bg-gray-100 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
