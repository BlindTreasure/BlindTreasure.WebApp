"use client";
import React, { useState, useEffect, useRef } from "react";
import { VscBellDot } from "react-icons/vsc";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { useRouter } from "next/navigation";
import useToast from "@/hooks/use-toast";
import Link from "next/link";
import useLogout from "@/hooks/use-logout";
import { closeSidebar, openSidebar } from "@/stores/difference-slice";
import { AlignJustify } from "lucide-react";
import { ThemeToggleButton } from "../common/ThemeToggleButton";
import NotificationDropdown from "../right-header-admin/NotificationDropdown";
import UserDropdown from "../right-header-admin/UserDropdown";
import { CiAlignLeft } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";

export default function StaffHeader() {
    const userState = useAppSelector((state) => state.userSlice);
    const staffState = useAppSelector((state) => state.differenceSlice.staff);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { addToast } = useToast();
    const { handleLogout } = useLogout();
    const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [rightMenuOpen, setRightMenuOpen] = useState(false);
    const rightMenuRef = useRef<HTMLDivElement>(null);
    const [isLayoutHidden, setIsLayoutHidden] = useState(false);

    // qua lại trạng thái từ menu mở, đóng
    const handleToggleMenu = () => {
        setRightMenuOpen(!rightMenuOpen);
    };

    // khi mở menu, ẩn layout chính
    useEffect(() => {
        if (rightMenuOpen) {
            setIsLayoutHidden(true);
        } else {
            setIsLayoutHidden(false);
        }
    }, [rightMenuOpen]);

    // click outside để đóng menu
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (
                rightMenuRef.current &&
                !rightMenuRef.current.contains(event.target)
            ) {
                setRightMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleToggleSidebar = () => {
        return staffState.openSidebar
            ? dispatch(closeSidebar())
            : dispatch(openSidebar());
    };

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <header className="bg-white py-4 px-6 border-gray-200 lg:border-b flex items-center justify-between">
            {/* Phần trái: nút sidebar + search */}
            <div className="flex items-center gap-4">
                <button onClick={handleToggleSidebar} className="border border-gray-200 rounded-md p-2">
                    <CiAlignLeft className="text-2xl" />
                </button>
                <div className="relative w-full">
                    <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                        <svg
                            className="fill-gray-500 dark:fill-gray-400"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                                fill=""
                            />
                        </svg>
                    </span>
                    <div className="relative sm:w-full w-[93%]">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10"
                        />
                        <button className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                            <span>⌘</span>
                            <span>K</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Layout chính: hiện vào các màn lớn, ẩn khi mở menu */}
                {!isLayoutHidden && (
                    <div className="hidden lg:flex items-center gap-4">
                        <NotificationDropdown />
                        <UserDropdown setIsLoggingOut={setIsLoggingOut}/>
                    </div>
                )}

                {/* Nút "..." */}
                <div className="relative lg:hidden" ref={rightMenuRef}>
                    <button
                        onClick={handleToggleMenu}
                        className="p-2 border border-gray-300 rounded-md"
                        aria-label="Open menu"
                    >
                        <BsThreeDots size={20} />
                    </button>

                    {/* Menu nhỏ mobile nếu mở */}
                    {rightMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                            <div className="p-2 border-b border-gray-200">
                                <NotificationDropdown />
                            </div>
                            <div className="p-2">
                                <UserDropdown setIsLoggingOut={setIsLoggingOut}/>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>

    );
}
