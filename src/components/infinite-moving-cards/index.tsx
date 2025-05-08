"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
    return (
        <div className="h-[20rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
            <InfiniteMovingCards
                items={brands}
            />
        </div>
    );
}

const brands = [
    "/images/brand_1.png", "/images/brand_2.png", "/images/brand_3.png", "/images/brand_4.png", "/images/brand_5.webp", "/images/brand_6.avif"
];
