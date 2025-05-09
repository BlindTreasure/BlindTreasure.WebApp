"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

import { motion } from "framer-motion";
import { fadeIn } from "@/utils/variants";
export function InfiniteMovingCardsDemo() {
    return (
        <motion.div
            variants={fadeIn("up", 0.3)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.7 }}
            className="h-[20rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
            <InfiniteMovingCards
                items={brands}
            />
        </motion.div>
    );
}

const brands = [
    "/images/brand_1.png", "/images/brand_2.png", "/images/brand_3.png", "/images/brand_4.png", "/images/brand_5.webp", "/images/brand_6.avif"
];
