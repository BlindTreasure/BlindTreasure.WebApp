"use client";
import { useAppSelector } from "@/stores/store";
import TippyHeadless from "@tippyjs/react/headless";
import { Images, SquareUser } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import UpdateAvatarProfilePopup from "@/components/update-avatar-profile/UpdateAvatarProfile";

export default function AvatarProfile() {
    const userState = useAppSelector((state) => state.userSlice);

    const [avatarTooltip, setAvatarToolTip] = useState<boolean>(false);
    const [updateAvatarPopup, setUpdateAvatarPopup] = useState<boolean>(false);
    const [avatar, setAvatar] = useState<string>("");

    useEffect(() => {
        if (userState.user?.avatarUrl || "")
            setAvatar(userState.user?.avatarUrl || "");
    }, [userState]);

    const handleToggleAvatarTooltip = () => {
        setAvatarToolTip((prev) => !prev);
    };

    const handleCloseAvatarTooltip = () => {
        setAvatarToolTip(false);
    };

    const handleOpenAvatarPopup = () => {
        setUpdateAvatarPopup(true);
        setAvatarToolTip(false);
    };

    const handleCloseAvatarPopup = () => {
        setUpdateAvatarPopup(false);
    };

    return (
        <div>
            <TippyHeadless
                interactive
                placement="bottom-end"
                offset={[-5, 2]}
                visible={avatarTooltip}
                render={(attrs) => (
                    <div
                        {...attrs}
                        className="w-[350px] max-h-[calc(min((100vh-96px)-60px),734px)] min-h-[30px] py-2 rounded-md shadow-box bg-white z-[999999]"
                    >
                        <div className="py-1 px-2 flex flex-col gap-y-1">
                            <Link
                                href={`${userState?.user?.avatarUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div
                                    onClick={handleCloseAvatarTooltip}
                                    className="px-2 py-1 flex items-center gap-x-2 rounded-md hover:bg-slate-200 select-none cursor-pointer"
                                >
                                    <i>
                                        <SquareUser
                                            strokeWidth={1}
                                            className="w-7 h-7 text-gray-800  opacity-80"
                                        />
                                    </i>
                                    <p className="text-[15px] font-[400] text-[#1b1b1b] opacity-86">
                                        Xem ảnh đại diện
                                    </p>
                                </div>
                            </Link>
                            <div
                                className="px-2 py-1 flex items-center gap-x-2 rounded-md hover:bg-slate-200 select-none cursor-pointer"
                                onClick={handleOpenAvatarPopup}
                            >
                                <i className="">
                                    <Images
                                        strokeWidth={1}
                                        className="w-7 h-7 text-gray-800  opacity-80"
                                    />
                                </i>
                                <p className="text-[15px] font-[400] text-[#1b1b1b] opacity-86">
                                    Cập nhật ảnh đại diện
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                onClickOutside={handleCloseAvatarTooltip}
            >
                <figure
                    className={`border w-32 h-32 bg-white rounded-full flex items-center justify-center p-2 cursor-pointer shadow-avatar ${
                        avatar &&
                        "hover:bg-[linear-gradient(to_top,_#d16ba5,_#c777b9,_#ba83ca,_#aa8fd8,_#9a9ae1,_#8aa7ec,_#79b3f4,_#69bff8,_#52cffe,_#41dfff,_#46eefa,_#5ffbf1)]"
                    }`}
                    onClick={handleToggleAvatarTooltip}
                >
                    {userState.user?.avatarUrl ? (
                        <div
                            style={{
                                borderRadius: "50%",
                                overflow: "hidden",
                            }}
                            className="flex items-center justify-between"
                        >
                            <img
                                src={userState.user?.avatarUrl}
                                className="w-full h-full"
                                alt="avatar"
                            />
                        </div>
                    ) : (
                        <Skeleton className="w-full h-full rounded-full" />
                    )}
                </figure>
            </TippyHeadless>
            <div>
                <UpdateAvatarProfilePopup
                    open={updateAvatarPopup}
                    onClose={handleCloseAvatarPopup}
                />
            </div>
        </div>
    );
}
