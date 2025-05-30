import StaffHeader from "@/components/staff-header";
import StaffSidebar from "@/components/staff-sidebar";
import React from "react";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
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
