"use client";
import AvatarProfile from "@/components/avatar-profile";
import { useAppSelector } from "@/stores/store";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

// const TabProfile = dynamic(() => import("@/app/(user)/profile/tab-profile"), {
//   ssr: false,
// });

export default function UserProfileLayout({ children }: LayoutProps) {
  const userState = useAppSelector((state) => state.userSlice);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative bg-[url('/images/profile.jpg')] bg-cover bg-center w-full h-[60vh] shadow-md flex flex-col items-start justify-center px-4 sm:px-8 md:px-16">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 w-full md:w-10/12 lg:w-8/12 p-4 sm:p-8 md:p-20">
          <div className="flex flex-col gap-y-4 mt-16 md:mt-24">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">
              Hồ sơ
            </h1>
            <p className="text-white text-sm sm:text-base md:text-lg">
              Hồ sơ của bạn phản ánh hành trình và giá trị của bạn, đóng vai trò là
              cầu nối giúp chúng ta kết nối và cùng nhau làm việc để tạo ra
              tác động tốt hơn cho cộng đồng.
            </p>
          </div>
        </div>
        <div className="z-20 absolute left-1/2 -bottom-[25%] transform -translate-x-1/2 flex flex-col items-center gap-y-2 sm:gap-y-3">
          <AvatarProfile />
          <h2 className="text-center font-bold text-sm sm:text-base md:text-lg">
            {userState.user?.fullName}
          </h2>
        </div>
      </div>
      <main className="px-4 sm:px-8 md:px-20 mt-20">{children}</main>
    </div>
  );
}
