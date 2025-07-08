import React from 'react';
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import ProfileComponent from './components/profile-component';

export const metadata: Metadata = {
  title: "Hồ sơ | BlindTreasure",
  description: "Seller pending page for BlindTreasure",
};
export default function SellerProfilePage() {
  return (
    <div>
      <ProfileComponent />
    </div>
  )
}
