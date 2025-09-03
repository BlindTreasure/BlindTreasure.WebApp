"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  PlusSquare,
  ListOrdered,
  ChevronDown,
  MessageCircle ,
  Users,
  FileBox,
  Trophy
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/stores/store";
import { closeSidebar, openSidebar } from "@/stores/difference-slice";
import { CiAlignLeft } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";
import { ChatIcon } from "@/icons";
import { SlLockOpen } from "react-icons/sl";

const sidebarItems = [
  {
    label: "Tổng quan",
    icon: LayoutDashboard,
    href: "/seller/dashboard",
  },
  {
    label: "Quản lý sản phẩm",
    icon: FileBox,
    dropdownKey: "products",
    subItems: [
      {
        label: "Tất cả sản phẩm",
        href: "/seller/allproduct",
        icon: ListOrdered,
      },
      {
        label: "Thêm sản phẩm",
        href: "/seller/create-product",
        icon: PlusSquare,
      },
    ],
  },
  {
    label: "Quản lý túi mù",
    icon: Package,
    dropdownKey: "blindbox",
    subItems: [
      {
        label: "Tất cả túi mù",
        href: "/seller/allblindboxes",
        icon: ListOrdered,
      },
      {
        label: "Thêm túi mù",
        href: "/seller/blindbox",
        icon: PlusSquare,
      },
    ],
  },
  {
    label: "Khách trúng thưởng",
    icon: Trophy,
    href: "/seller/unbox-logs",
  },
  {
    label: "Phản hồi khách hàng",
    icon: ChatIcon,
    href: "/seller/reply",
  },
  {
    label: "Mã khuyến mãi",
    icon: Users,
    href: "/seller/promotions",
  },
  {
    label: "Lịch sử đơn hàng",
    icon: ListOrdered,
    href: "/seller/order-history",
  },
  {
    label: "Mở lại đơn lưu trữ",
    icon: SlLockOpen,
    href: "/seller/archived",
  },
  {
    label: "Nhắn tin",
    icon: MessageCircle,
    href: "/seller/chat-with-user"
  }
];

export default function SellerSidebar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const staffState = useAppSelector((state) => state.differenceSlice.staff);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        dispatch(closeSidebar());
      } else {
        dispatch(openSidebar());
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const toggleDropdown = (key: string) =>
    setOpenDropdown(openDropdown === key ? null : key);

  return (
    <>
      {isMobile && (
        <button
          onClick={() =>
            dispatch(
              staffState.openSidebar ? closeSidebar() : openSidebar()
            )
          }
          className="fixed top-4 left-6 z-50 p-2 bg-gray-800 dark:bg-gray-700 text-white rounded-md"
        >
          <CiAlignLeft size={26} />
        </button>
      )}

      {staffState.openSidebar && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[60]"
          onClick={() => dispatch(closeSidebar())}
        ></div>
      )}

      <aside
        className={`fixed lg:static z-[9999] h-screen bg-gray-900 dark:bg-gray-900 text-white transition-all duration-300 ${isMobile
          ? staffState.openSidebar
            ? "w-72"
            : "w-0 overflow-hidden"
          : staffState.openSidebar
            ? "w-72"
            : "w-20"
          }`}
      >
        <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-700 dark:border-gray-600">
          <div className="rounded-full w-16 h-16 flex items-center justify-center font-bold text-xs">
            <img
              src="/images/Logo_DB.png"
              alt="Logo"
              width={100}
              height={100}
            />
          </div>
          {staffState.openSidebar && (
            <span className="text-lg font-semibold">Người bán</span>
          )}
        </div>

        <div className="p-4 w-full">
          <ul className="space-y-1">
            <li
              className={`flex items-center pt-4 text-sm font-semibold text-gray-400 dark:text-gray-500 h-10 ${staffState.openSidebar ? "justify-start" : "justify-center"
                }`}
            >
              {staffState.openSidebar ? (
                <div className="transition-all duration-300 truncate w-full opacity-100">
                  DANH MỤC
                </div>
              ) : (
                <div className="flex items-center w-8 h-8">
                  <BsThreeDots size={20} />
                </div>
              )}
            </li>

            <ul className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const hasDropdown = !!item.subItems;
                const isOpen = openDropdown === item.dropdownKey;
                if (hasDropdown) {
                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => toggleDropdown(item.dropdownKey!)}
                        className="flex items-center justify-between w-full p-2 hover:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
                      >
                        <div className="flex items-center space-x-2">
                          <Icon size={20} />
                          <span className={`${staffState.openSidebar || isMobile ? "block" : "hidden"} truncate`}>
                            {item.label}
                          </span>
                        </div>

                        {staffState.openSidebar && (
                          <ChevronDown
                            className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""} text-gray-400 dark:text-gray-500`}
                          />
                        )}
                      </button>

                      {isOpen && staffState.openSidebar && (
                        <ul className="pl-4 mt-1 space-y-1">
                          {item.subItems!.map((sub) => {
                            const SubIcon = sub.icon;
                            return (
                              <li key={sub.label}>
                                <Link
                                  href={sub.href}
                                  className="flex items-center gap-2 p-2 hover:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
                                  onClick={() => isMobile && dispatch(closeSidebar())}
                                >
                                  <SubIcon size={20} />
                                  <span className="truncate">{sub.label}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                }
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href!}
                      className="flex items-center gap-2 p-2 hover:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
                      onClick={() => isMobile && dispatch(closeSidebar())}
                    >
                      <Icon size={20} />
                      <span className={`${staffState.openSidebar || isMobile ? "block" : "hidden"} truncate`}>
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

          </ul>
        </div>
      </aside>
    </>
  );
}
