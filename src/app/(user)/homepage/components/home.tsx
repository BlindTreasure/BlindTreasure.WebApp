"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <section className="relative bg-[#FFD966] overflow-hidden py-48">
      {/* Background with curved border */}
      <div className="absolute inset-0 top-1/2 w-full h-1/2 bg-white rounded-t-[60%] scale-x-125 origin-top"></div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 pb-24 flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center gap-12">
          {/* Left character */}
          <Image
            src="/left-character.png"
            alt="Left Character"
            width={120}
            height={120}
            className="hidden md:block"
          />

          {/* Center gift box + title */}
          <div className="flex flex-col items-center">
            <Image
              src="/images/hero.png"
              alt="Gift Box"
              width={500}
              height={500}
              className="max-h-[400px] object-contain"
            />

            <h1 className="mt-6 text-5xl md:text-6xl font-extrabold text-[#333] pt-24">
              MYSTERY BOX
            </h1>
            <p className="text-xl text-[#333] mt-2">Khám phá bất ngờ ngay hôm nay!</p>
          </div>

          {/* Right character */}
          <Image
            src="/right-character.png"
            alt="Right Character"
            width={120}
            height={120}
            className="hidden md:block"
          />
        </div>

        {/* Button */}
        <motion.div
          className="mt-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="outline" className="border-2 border-black rounded-full px-8 py-3 text-lg font-semibold">
            Tìm hiểu thêm
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
