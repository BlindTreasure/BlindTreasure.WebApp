"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Image from "next/image";
import { fadeIn } from "@/utils/variants";
import Link from "next/link";
import { GoArrowRight } from "react-icons/go";
export default function HeroVideoSection() {
    return (
        <div className="relative w-full h-screen overflow-hidden">
            <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                src="https://storage.googleapis.com/teko-gae.appspot.com/media/video/2024/5/7/d43e9c80-d2bb-41ba-b8e4-24a0d90624ff/header.mp4" // hoặc "/videos/yourfile.mp4"
                autoPlay
                muted
                loop
                playsInline
            />

            <div className="absolute inset-0 bg-black/50 z-10"></div>

            <motion.div
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.7 }}
                className="relative z-20 flex flex-col md:flex-row items-center justify-between h-full pt-40 px-6 md:px-20 text-white">
                <div className="flex-1 text-center max-w-xl">
                    <h1 className="text-4xl md:text-7xl mb-4 font-paytone font-bold">BlindTreasure</h1>
                    <h1 className="text-4xl md:text-7xl mb-4 font-paytone font-bold text-[#d02a2a]">Chất Lượng</h1>
                    <p className="text-lg md:text-xl mb-6 text-start">
                        Bạn đã sẵn sàng cho những điều bất ngờ? Khám phá hộp bí ẩn của chúng tôi ngay hôm nay và trải nghiệm cảm giác hồi hộp đến phút cuối cùng!
                    </p>
                    <Link href="/aboutus">
                        <Button
                            className="group relative border-2 bg-[#d02a2a] border-[#ACACAC] rounded-full px-8 py-6 text-lg font-semibold text-white hover:bg-white hover:text-black transition-colors duration-300"
                            variant="outline"
                        >
                            <span className="inline-block transition-transform duration-300 transform group-hover:-translate-x-4 group-hover:text-black">
                                Khám phá ngay
                            </span>
                            <span className="transition-transform duration-300 transform opacity-0 group-hover:opacity-100 absolute right-4">
                                <GoArrowRight />
                            </span>
                        </Button>
                    </Link>
                </div>

                <div className="flex-1 flex justify-center md:mt-0">
                    <Image
                        src="/images/hero_1.png"
                        alt="Mystery Box"
                        width={400}
                        height={400}
                        className="object-contain w-[200px] md:w-[600px]"
                    />
                </div>
            </motion.div>
        </div>
    );
}
