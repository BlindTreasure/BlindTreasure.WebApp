import AdminHeader from "@/components/admin-header";
import SellerSidebar from "@/components/seller-sidebar";
import React from "react";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <SellerSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="min-h-[76px] bg-white shadow-md">
          <AdminHeader />
        </div>
        <main className="flex-grow px-4 py-6 bg-gray-100 overflow-auto">
          {children}
        </main>
      </div>
    </div>    
  );
} 
