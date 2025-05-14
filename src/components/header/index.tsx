"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/stores/store";
import AvatarMenu from "@/components/avatar-menu";
import TippyHeadless from "@tippyjs/react/headless";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header: React.FC = () => {
  const userState = useAppSelector((state) => state.userSlice);
  const user = useAppSelector((state) => state.userSlice.user);
  const currentPath = usePathname();
  const router = useRouter();
  const [avatarTooltip, setAvatarTooltip] = useState(false);

  const getLink = () => {
    if (user?.roleId === 3) {
      return { href: "/customer-request", label: "Yêu cầu khách hàng" };
    } else if (user?.roleId === 2) {
      return { href: "/personal-hiring-post", label: "Tài liệu theo yêu cầu" };
    }
    return null;
  };

  const specialLink = getLink();

  const navLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/aboutus", label: "Về chúng tôi" },
    { href: "/contact", label: "Liên hệ" },
    ...(specialLink ? [specialLink] : []),
  ];

  const handleToggleAvatarTooltip = () => {
    setAvatarTooltip((prev) => !prev);
  };

  const handleCloseAvatarTooltip = () => {
    setAvatarTooltip(false);
  };

  const handleNavigate = () => {
    router.push("/");
  };

  return (
    <header className="flex items-center justify-between px-8 bg-white rounded-full fixed top-0 left-0 right-0 z-50 shadow-lg max-w-[1400px] w-full h-24 mx-auto mt-6">
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/images/logo_header_light.png"
              alt="Logo"
              className="h-20 w-28 cursor-pointer"
              onClick={handleNavigate}
            />
          </div>

          <nav className="hidden md:flex items-center space-x-6 lg:space-x-20 text-xl">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-gray-600 hover:text-[#d02a2a] hover:underline transition-colors ${currentPath === link.href ? "text-red-700 font-medium" : ""
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
            {userState.user === null ? (
              <Link
                href="/login"
                className={`text-xl text-gray-600 hover:text-teal-400 ${currentPath === "/login" ? "text-teal-400" : ""
                  }`}
              >
                Đăng nhập
              </Link>
            ) : (
              <div className="flex items-center">
                <div className="relative">
                  <TippyHeadless
                    interactive
                    placement="bottom-end"
                    offset={[-5, 2]}
                    visible={avatarTooltip}
                    render={(attrs) => (
                      <div
                        {...attrs}
                        className="w-full max-h-[calc(min((100vh-96px)-60px),734px)] min-h-[30px] py-2 rounded-md bg-white z-[999999]"
                      >
                        <AvatarMenu onCloseTooltip={handleCloseAvatarTooltip} />
                      </div>
                    )}
                    onClickOutside={handleCloseAvatarTooltip}
                  >
                    <figure className="rounded-full border border-zinc-300 overflow-hidden w-14 h-14 flex items-center justify-center hover:bg-teal-400">
                      {userState?.user?.cropAvatarLink !== "" && (
                        <img
                          id="avatarButton"
                          onClick={handleToggleAvatarTooltip}
                          className="w-12 h-12 rounded-full cursor-pointer"
                          src={
                            userState?.user?.cropAvatarLink ||
                            "images/unknown_avatar.png"
                          }
                          alt="User dropdown"
                        />
                      )}
                    </figure>
                  </TippyHeadless>
                </div>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 text-gray-600 hover:text-teal-400 focus:outline-none">
                  <Menu size={32} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="flex items-center justify-between px-4 py-2">
                  <SheetTitle className="text-left">
                    <img
                      src="/images/logo_header_light.png"
                      alt="Logo"
                      className="h-20 w-28 cursor-pointer object-contain"
                      onClick={handleNavigate}
                    />
                  </SheetTitle>
                </SheetHeader>

                <div className="grid gap-4 py-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-4 py-2 rounded-lg text-lg ${currentPath === link.href
                        ? "bg-teal-50 text-teal-600"
                        : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  {userState.user === null ? (
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-lg"
                    >
                      Đăng nhập
                    </Link>
                  ) : (
                    <div className="flex items-center px-4 py-2 space-x-3">
                      <div className="relative">
                        <TippyHeadless
                          interactive
                          placement="bottom-end"
                          offset={[-5, 2]}
                          visible={avatarTooltip}
                          render={(attrs) => (
                            <div
                              {...attrs}
                              className="w-48 py-2 rounded-md bg-white shadow-lg z-[9999] border border-gray-100"
                            >
                              <AvatarMenu onCloseTooltip={handleCloseAvatarTooltip} />
                            </div>
                          )}
                          onClickOutside={handleCloseAvatarTooltip}
                        >
                          <figure className="rounded-full border-2 border-gray-200 overflow-hidden w-10 h-10 cursor-pointer hover:border-teal-400 transition-colors">
                            <img
                              onClick={handleToggleAvatarTooltip}
                              className="w-full h-full object-cover"
                              src={
                                userState?.user?.cropAvatarLink ||
                                "/images/unknown_avatar.png"
                              }
                              alt="User avatar"
                            />
                          </figure>
                        </TippyHeadless>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;