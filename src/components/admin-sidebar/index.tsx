"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Building, Users, Coins, ChevronDown, Menu } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/stores/store";
import { closeSidebar, openSidebar } from "@/stores/difference-slice";
import { CiAlignLeft } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";
export default function AdminSidebar() {
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

    const toggleDropdown = (dropdown: string) =>
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);

    return (
        <>

            {isMobile && (
                <button
                    onClick={() => dispatch(staffState.openSidebar ? closeSidebar() : openSidebar())}
                    className="fixed top-4 left-6 z-50 p-2 bg-gray-800 text-white rounded-md"
                >
                    <CiAlignLeft size={26} />
                </button>
            )}


            {staffState.openSidebar && isMobile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => dispatch(closeSidebar())}></div>
            )}


            <aside
                className={`fixed lg:static z-50 h-screen bg-gray-900 text-white transition-all duration-300
    ${isMobile ? (staffState.openSidebar ? "w-72" : "w-0 overflow-hidden") : staffState.openSidebar ? "w-72" : "w-20"}`}
            >
                <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-700">
                    <div className="rounded-full w-16 h-16 flex items-center justify-center font-bold text-xs">
                        <img src="/images/darkmode_footer.png" alt="Logo" width={32} height={32} />
                    </div>

                    {(staffState.openSidebar) && (
                        <span className="text-lg font-semibold">Admin</span>
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

                        <li>
                            <button
                                onClick={() => toggleDropdown("dashboard")}
                                className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded-md"
                            >
                                <Link href="/admin/dashboard" className="flex items-center space-x-2">
                                    <div className="flex items-center justify-center w-8 h-8">
                                        <LayoutDashboard size={20} />
                                    </div>
                                    <span className={`${staffState.openSidebar || isMobile ? "block" : "hidden"} truncate`}>
                                        Dashboard
                                    </span>
                                </Link>
                                {staffState.openSidebar && !isMobile && (
                                    <ChevronDown
                                        className={`size-4 transition-transform ${openDropdown === "dashboard" ? "rotate-180" : ""} text-gray-400`}
                                    />
                                )}
                            </button>

                            {openDropdown === "dashboard" && staffState.openSidebar && !isMobile && (
                                <ul className="pl-4 mt-1 space-y-1">
                                    <li>
                                        <Link href="/admin/user-donate" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md">
                                            <div className="flex items-center justify-center w-8 h-8">
                                                <Coins size={20} />
                                            </div>
                                            <span className="truncate">All users donation</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li>
                            <Link href="/admin/transaction" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-md">
                                <div className="flex items-center justify-center w-8 h-8">
                                    <Building size={20} />
                                </div>
                                <span className={`${staffState.openSidebar || isMobile ? "block" : "hidden"} truncate`}>
                                    Thống kê giao dịch
                                </span>
                            </Link>
                        </li>

                    </ul>
                </div>
            </aside>

        </>
    );
}
