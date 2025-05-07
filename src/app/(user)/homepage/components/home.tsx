"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { FaRegHeart } from "react-icons/fa6";
import { CardHoverEffectDemo } from "@/components/card-hover-effect";
import { AuroraBackgroundDemo } from "@/components/aurora-background";
import { SpotlightPreview } from "@/components/spotlight";


export default function HomePage() {
  const images = ["/images/1.png", "/images/2.png", "/images/3.png", "/images/4.png"];
  return (
    <div className="relative overflow-hidden">
      <section className="py-36 relative bg-[#d02a2a]">
        <div className="absolute inset-0 top-1/2 w-full h-1/2 bg-white rounded-t-[60%] scale-x-125 origin-top"></div>

        <div className="relative z-10 container mx-auto px-6 pb-32 flex flex-col items-center text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <Image
              src="/images/banner_left.png"
              alt="Left Character"
              width={250}
              height={400}
              className="max-h-[360px] object-contain"
            />

            <div className="flex flex-col items-center max-w-md">
              <Image
                src="/images/hero.png"
                alt="Gift Box"
                width={360}
                height={360}
                className="max-h-[320px] object-contain"
              />
              <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-[#333]">
                HỘP BÍ ẨN
              </h1>
              <p className="text-lg text-[#333] mt-2">
                Khám phá bất ngờ ngay hôm nay!
              </p>
            </div>

            <Image
              src="/images/banner_right.png"
              alt="Right Character"
              width={250}
              height={400}
              className="max-h-[360px] object-contain hidden md:block"
            />
          </div>

          <motion.div
            className="mt-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              className="border-2 border-[#ACACAC] rounded-full px-8 py-6 text-lg font-semibold text-[#252424] hover:bg-[#252424] hover:text-white transition-colors duration-300"
            >
              Tìm hiểu thêm
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 w-full -mt-40">
        <div className="container mx-auto">
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="w-full h-96 md:h-[512px] mb-16"
          >
            {[
              "/images/slider_1.webp",
              "/images/slider_2.jpg",
              "/images/slider_3.jpg",
            ].map((url, index) => (
              <SwiperSlide key={index}>
                <div className="w-full h-full relative">
                  <Image
                    src={url}
                    alt={`Slide ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <h1 className="text-4xl text-red-600 text-center font-montserrat">
        DANH MỤC
        <span className="block w-24 h-[2px] bg-red-600 mt-1 mx-auto"></span>
      </h1>

      <div className="grid grid-cols-4 gap-4">
        {images.map((src, index) => (
          <div key={index} className="h-64 bg-gray-100">
            <img src={src} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <div>
        <SpotlightPreview />
      </div>

      <h1 className="text-4xl text-red-600 text-center font-montserrat pt-14">
        HÀNG MỚI VỀ
        <span className="block w-36 h-[3px] bg-red-600 mt-1 mx-auto"></span>
      </h1>

      <div className="flex justify-center py-8">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full max-w-[1400px]"
        >
          <CarouselContent>
            {Array.from({ length: 6 }).map((_, index) => (
              <CarouselItem key={index} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 relative">
                <div className="relative p-2 mt-12">
                  <div className="absolute top-[11px] -left-[20px] w-[100px] rotate-[-45deg] bg-[#6e8900] text-[#f3f2ef] text-[15px] uppercase text-center font-sans z-[50] shadow-md py-[7px] px-0
              before:absolute before:bottom-[-3px] before:left-0 before:border-t-[3px] before:border-l-[3px] before:border-r-[3px] before:border-t-[#6e8900] before:border-l-transparent before:border-r-transparent
              after:absolute after:bottom-[-3px] after:right-0 after:border-t-[3px] after:border-l-[3px] after:border-r-[3px] after:border-t-[#6e8900] after:border-l-transparent after:border-r-transparent">
                    NEW
                  </div>

                  <Card className="relative w-full rounded-xl overflow-hidden p-4 shadow-lg bg-white">
                    <div className="w-full h-48 overflow-hidden rounded-md">
                      <img
                        src="/images/cart.webp"
                        alt="Product"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="mt-4 text-sm">
                      <p className="truncate font-semibold text-gray-800">MEGA SPACE MOLLY 400...</p>
                      <p className="text-red-600 font-bold text-lg">5.420.000₫</p>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <Button className="text-xs px-3 py-2 rounded-md bg-[#252424] text-white hover:bg-opacity-70 transition-all duration-300 transform hover:scale-105">
                        Thêm vào giỏ hàng
                      </Button>
                      <FaRegHeart className="text-2xl" />
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700" />
          <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700" />
        </Carousel>
      </div>
    </div>
  );
}
