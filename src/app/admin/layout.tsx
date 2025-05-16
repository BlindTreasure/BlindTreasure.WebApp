import AdminHeader from "@/components/admin-header";
import AdminSidebar from "@/components/admin-sidebar";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="min-h-[109px] bg-white shadow-md">
          <AdminHeader />
        </div>
        <main className="flex-grow p-4 bg-gray-100 overflow-auto">
          {children}
        </main>
      </div>
    </div>    
  );
} 
