import React from "react";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import ProfileComponent from "@/app/(user)/profile/information/components/profile-component";

export const metadata: Metadata = {
  title: "Hồ sơ cá nhân",
  description: "Hồ sơ cá nhân cho BlindTreasure",
};

export default function UserInformationPage() {
  return (
    <div>
      <ProfileComponent />
    </div>
  );
}
