import React from 'react'
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import AboutUs from './about-us';

export const metadata: Metadata = {
    title: "About Us",
    description: "About us page for BlindTreasure",
};

export default function AboutUsPage() {
  return (
    <div>
      <AboutUs />
    </div>
  )
}
