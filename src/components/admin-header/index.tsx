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
import { NotificationBell } from "../notification/notification-bell";
import UserDropdown from "../right-header-admin/UserDropdown";
import { CiAlignLeft } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
            </div>

            <div className="flex items-center gap-4">
                {/* Layout chính: hiện vào các màn lớn, ẩn khi mở menu */}
                {!isLayoutHidden && (
                    <div className="hidden lg:flex items-center gap-4">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="text-gray-600 hover:text-[#d02a2a]">
                                        <NotificationBell />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Thông báo</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
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
                                <div className="text-gray-600 hover:text-[#d02a2a]">
                                    <NotificationBell />
                                </div>
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