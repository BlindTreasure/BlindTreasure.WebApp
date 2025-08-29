"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/stores/store";
import AvatarMenu from "@/components/avatar-menu";
import TippyHeadless from "@tippyjs/react/headless";
import { Menu, X } from "lucide-react";
import { PiHeartStraightLight } from "react-icons/pi";
import { PiShoppingCartLight } from "react-icons/pi";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { selectTotalItems } from "@/stores/cart-slice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWishlistContext } from "@/contexts/WishlistContext";
import { NotificationBell } from "../notification/notification-bell";

const Header: React.FC = () => {
  const userState = useAppSelector((state) => state.userSlice);
  const currentPath = usePathname();
  const router = useRouter();
  const [avatarTooltip, setAvatarTooltip] = useState(false);
  const totalItems = useAppSelector(selectTotalItems);
  const isLoggedIn = useAppSelector((state) => !!state.userSlice.user);
  const { wishlistStatus } = useWishlistContext();

  // Calculate total wishlist items (only for logged in users)
  const totalWishlistItems = isLoggedIn
    ? Object.keys(wishlistStatus || {}).length
    : 0;

  const navLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/aboutus", label: "Về chúng tôi" },
    { href: "/allproduct", label: "Sản phẩm" },
    { href: "/marketplace", label: "Marketplace" },
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

  const handleClickCart = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      router.push("/cart");
    }
  };

  const handleClickWishlist = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      router.push("/wishlist");
    }
  };

  return (
    <header className="flex items-center justify-between px-8 bg-white rounded-full fixed top-0 left-0 right-0 z-50 shadow-lg max-w-[1400px] w-full h-24 mx-auto mt-6">
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/images/logo_header_light.png"
              alt="Logo"
              width={112}
              height={80}
              className="h-20 w-28 cursor-pointer"
              priority
              onClick={handleNavigate}
            />
          </div>

          <nav className="hidden md:flex items-center space-x-6 lg:space-x-20 text-xl">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-gray-600 hover:text-[#d02a2a] hover:underline transition-colors ${
                  currentPath === link.href ? "text-red-700 font-medium" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <TooltipProvider>
              <div className="flex items-center gap-4">
                {isLoggedIn && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <Link
                          href="/wishlist"
                          className="text-gray-600 hover:text-[#d02a2a] text-2xl"
                        >
                          <PiHeartStraightLight />
                        </Link>
                        {totalWishlistItems > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {totalWishlistItems}
                          </span>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sản phẩm yêu thích</p>
                    </TooltipContent>
                  </Tooltip>
                )}

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

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="relative cursor-pointer"
                      onClick={handleClickCart}
                    >
                      <div className="text-gray-600 hover:text-[#d02a2a] text-2xl">
                        <PiShoppingCartLight />
                      </div>
                      {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                          {totalItems}
                        </span>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Giỏ hàng</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
            {userState.user === null ? (
              <Link
                href="/login"
                className={`text-xl text-gray-600 hover:text-[#d02a2a] hover:underline ${
                  currentPath === "/login" ? "text-teal-400" : ""
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
                    <figure className="rounded-full border border-zinc-300 overflow-hidden w-14 h-14 flex items-center justify-center hover:bg-#d02a2a">
                      {userState?.user?.avatarUrl !== "" && (
                        <Image
                          id="avatarButton"
                          onClick={handleToggleAvatarTooltip}
                          width={48}
                          height={48}
                          className="rounded-full cursor-pointer"
                          src={
                            userState?.user?.avatarUrl ||
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

          <div className="md:hidden flex items-center gap-4">
            {/* <div className="relative cursor-pointer" onClick={handleClickWishlist}>
              <div className="text-gray-600 hover:text-[#d02a2a] text-2xl">
                <PiHeartStraightLight />
              </div>
              {totalWishlistItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalWishlistItems}
                </span>
              )}
            </div> */}
            {isLoggedIn && (
              <div
                className="relative cursor-pointer"
                onClick={handleClickWishlist}
              >
                <div className="text-gray-600 hover:text-[#d02a2a] text-2xl">
                  <PiHeartStraightLight />
                </div>
                {totalWishlistItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {totalWishlistItems}
                  </span>
                )}
              </div>
            )}
            <div className="relative cursor-pointer" onClick={handleClickCart}>
              <div className="text-gray-600 hover:text-[#d02a2a] text-2xl">
                <PiShoppingCartLight />
              </div>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </div>
            <div className="md:hidden flex items-center">
              <div className="text-gray-600 hover:text-[#d02a2a] mr-4">
                <NotificationBell />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-2 text-gray-600 hover:text-[#d02a2a] focus:outline-none">
                    <Menu size={32} />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader className="flex items-center justify-between px-4 py-2">
                    <SheetTitle className="text-left">
                      <Image
                        src="/images/logo_header_light.png"
                        alt="Logo"
                        width={112}
                        height={80}
                        className="cursor-pointer object-contain"
                        onClick={handleNavigate}
                      />
                    </SheetTitle>
                  </SheetHeader>

                  <div className="grid gap-4 py-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`px-4 py-2 rounded-lg text-lg ${
                          currentPath === link.href
                            ? "bg-[#ebeaea] text-[#d02a2a]"
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
                            placement="bottom"
                            offset={[-5, 2]}
                            visible={avatarTooltip}
                            render={(attrs) => (
                              <div {...attrs}>
                                <AvatarMenu
                                  onCloseTooltip={handleCloseAvatarTooltip}
                                />
                              </div>
                            )}
                            onClickOutside={handleCloseAvatarTooltip}
                          >
                            <figure className="rounded-full border-2 border-gray-200 overflow-hidden w-10 h-10 cursor-pointer hover:border-teal-400 transition-colors">
                              <Image
                                onClick={handleToggleAvatarTooltip}
                                width={40}
                                height={40}
                                className="object-cover"
                                src={
                                  userState?.user?.avatarUrl ||
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
      </div>
    </header>
  );
};

export default Header;
