"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  PlusSquare,
  ListOrdered,
  ChevronDown,
  BarChart,
  Users,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/stores/store";
import { closeSidebar, openSidebar } from "@/stores/difference-slice";
import { CiAlignLeft } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/seller/dashboard",
    dropdownKey: "dashboard",
    subItems: [
      {
        label: "Doanh thu & Thống kê",
        href: "/seller/analytics",
        icon: BarChart,
      },
    ],
  },
  {
    label: "Quản lý sản phẩm",
    icon: Package,
    href: "/seller/allproduct",
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
    label: "Khách hàng",
    icon: Users,
    href: "/seller/customers",
  },
  {
    label: "Đơn hàng",
    icon: ListOrdered,
    href: "/seller/orders",
  },
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
          className="fixed top-4 left-6 z-50 p-2 bg-gray-800 text-white rounded-md"
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
        className={`fixed lg:static z-[9999] h-screen bg-gray-900 text-white transition-all duration-300 ${isMobile
          ? staffState.openSidebar
            ? "w-72"
            : "w-0 overflow-hidden"
          : staffState.openSidebar
            ? "w-72"
            : "w-20"
          }`}
      >
        <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-700">
          <div className="rounded-full w-16 h-16 flex items-center justify-center font-bold text-xs">
            <img
              src="/images/darkmode_footer.png"
              alt="Logo"
              width={32}
              height={32}
            />
          </div>
          {staffState.openSidebar && (
            <span className="text-lg font-semibold">Người bán</span>
          )}
        </div>

        <div className="p-4 w-full">
          <ul className="space-y-1">
            <li
              className={`flex items-center pt-4 text-sm font-semibold text-gray-400 h-10 ${staffState.openSidebar ? "justify-start" : "justify-center"
                }`}
            >
              {staffState.openSidebar ? (
                <div className="transition-all duration-300 truncate w-full opacity-100">
                  MENU
                </div>
              ) : (
                <div className="flex items-center justify-center w-8 h-8">
                  <BsThreeDots size={20} />
                </div>
              )}
            </li>

            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isDropdown = !!item.subItems;
              const isOpen = openDropdown === item.dropdownKey;

              return (
                <li key={item.label}>
                  <button
                    onClick={() =>
                      isDropdown ? toggleDropdown(item.dropdownKey!) : null
                    }
                    className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded-md"
                  >
                    <Link
                      href={item.href}
                      className="flex items-center space-x-2"
                      onClick={() => {
                        if (isMobile) dispatch(closeSidebar());
                      }}
                    >
                      <div className="flex items-center justify-center w-8 h-8">
                        <Icon size={20} />
                      </div>
                      <span
                        className={`${staffState.openSidebar || isMobile
                          ? "block"
                          : "hidden"
                          } truncate`}
                      >
                        {item.label}
                      </span>
                    </Link>
                    {isDropdown &&
                      staffState.openSidebar &&
                      (
                        <ChevronDown
                          className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""
                            } text-gray-400`}
                        />
                      )}
                  </button>

                  {isDropdown &&
                    isOpen &&
                    staffState.openSidebar &&
                    (
                      <ul className="pl-4 mt-1 space-y-1">
                        {item.subItems!.map((sub) => {
                          const SubIcon = sub.icon;
                          return (
                            <li key={sub.label}>
                              <Link
                                href={sub.href}
                                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md"
                                onClick={() => {
                                  if (isMobile) dispatch(closeSidebar());
                                }}
                              >
                                <div className="flex items-center justify-center w-8 h-8">
                                  <SubIcon size={20} />
                                </div>
                                <span className="truncate">{sub.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
}
