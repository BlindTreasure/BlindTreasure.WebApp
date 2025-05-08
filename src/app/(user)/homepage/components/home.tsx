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
import Ribbon from "@/components/blindbox";
import ProductCard from "@/components/product-card";

interface Blindbox {
  id: number;
  type: "new" | "sale" | "blindbox";
  percent?: number;
  title: string;
  price: number
}

export default function HomePage() {
  const images = ["/images/1.png", "/images/2.png", "/images/3.png", "/images/4.png"];
  const works = [
    {
      icon: <div className="text-4xl mb-4">📦</div>,
      title: "Giao tận tay",
      description: "Mua và nhận sản phẩm tại nhà – mở ra bất ngờ thật sự.",
    },
    {
      icon: <div className="text-4xl mb-4">💻</div>,
      title: "Mở hộp online",
      description: "Khui hộp ngay trên website – nhanh chóng, tiện lợi mà vẫn hồi hộp!",
    }
  ]
  const blindboxes: Blindbox[] = [
    { id: 1, type: "sale", percent: 30, title: "Hello", price: 5420000 },
    { id: 2, type: "sale", percent: 50, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
    { id: 3, type: "sale", percent: 40, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
    { id: 4, type: "sale", percent: 10, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
    { id: 5, type: "sale", percent: 20, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
    { id: 12, type: "sale", percent: 20, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
    { id: 6, type: "new", title: "MEGA SPACE MOLLY 400...", price: 5420000, percent: 20 },
    { id: 7, type: "new", title: "MEGA SPACE MOLLY 400...", price: 5420000, percent: 20 },
    { id: 8, type: "new", title: "MEGA SPACE MOLLY 400...", price: 5420000, percent: 20 },
    { id: 9, type: "new", title: "MEGA SPACE MOLLY 400...", price: 5420000, percent: 20 },
    { id: 10, type: "new", title: "MEGA SPACE MOLLY 400...", price: 5420000, percent: 20 },
    { id: 11, type: "new", title: "MEGA SPACE MOLLY 400...", price: 5420000, percent: 20 },
    { id: 13, type: "blindbox", percent: 20, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
    { id: 14, type: "blindbox", percent: 0, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
    { id: 15, type: "blindbox", title: "MEGA SPACE MOLLY 400...", price: 5420000 },
    { id: 16, type: "blindbox", percent: 20, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
    { id: 17, type: "blindbox", percent: 0, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
    { id: 18, type: "blindbox", title: "MEGA SPACE MOLLY 400...", price: 5420000 },
  ];

  const newItems = blindboxes.filter((box) => box.type === "new");
  const saleItems = blindboxes.filter((box) => box.type === "sale");
  const blindboxItems = blindboxes.filter((box) => box.type === "blindbox");

  return (
    <div className="relative overflow-hidden">
      <section className="py-36 relative bg-[#d02a2a]">
        <div className="absolute inset-0 top-1/2 w-full h-1/2 bg-white rounded-t-[60%] scale-x-125 origin-top"></div>
        <div className="relative z-10 container mx-auto px-6 pb-32 flex flex-col items-center text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <Image
              src="/images/banner_left.png"
              alt="Left Character"
              width={250}
              height={400}
              className="w-[120px] sm:w-[160px] md:w-[250px] max-h-[240px] sm:max-h-[300px] md:max-h-[360px] object-contain"
            />

            <div className="flex flex-col items-center max-w-xs sm:max-w-sm md:max-w-md">
              <Image
                src="/images/hero.png"
                alt="Gift Box"
                width={360}
                height={360}
                className="w-[180px] sm:w-[240px] md:w-[360px] max-h-[200px] sm:max-h-[260px] md:max-h-[320px] object-contain"
              />
            </div>

            <Image
              src="/images/banner_right.png"
              alt="Right Character"
              width={250}
              height={400}
              className="w-[120px] sm:w-[160px] md:w-[250px] max-h-[240px] sm:max-h-[300px] md:max-h-[360px] object-contain"
            />
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-[#333]">
            HỘP BÍ ẨN
          </h1>
          <p className="text-lg text-[#333] mt-2">
            Khám phá bất ngờ ngay hôm nay!
          </p>
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

      <div className="grid grid-cols-2 md:grid-cols-4 md:gap-4">
        {images.map((src, index) => (
          <div key={index} className="md:h-64 h-40 bg-gray-100">
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
          className="w-96 sm:w-full max-w-[1400px]"
        >
          <CarouselContent>
            {newItems.map((box) => (
              <CarouselItem key={box.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 relative">
                <ProductCard
                  type={box.type}
                  percent={box.percent}
                  title= {box.title}
                  price={box.price.toLocaleString("vi-VN") + "₫"}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700" />
          <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700" />
        </Carousel>
      </div>

      <div className="my-12 text-center">
        <h1 className="text-4xl text-red-600 text-center font-montserrat">
          CÁCH HOẠT ĐỘNG
        </h1>
        <p className="text-gray-400 mb-8 mt-2">Khám phá túi mù theo cách bạn muốn</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-20">
          {works.map((work, index) => (
            <div key={index} className="bg-gray-900 p-6 rounded-lg">
              {work.icon}
              <h3 className="text-xl font-semibold text-white mb-2">{work.title}</h3>
              <p className="text-neutral-400 text-sm">{work.description}</p>
            </div>
          ))}
        </div>
      </div>

      <h1 className="text-4xl text-red-600 text-center font-montserrat pt-14">
        HÀNG KHUYẾN MÃI
        <span className="block w-36 h-[3px] bg-red-600 mt-1 mx-auto"></span>
      </h1>

      <div className="flex justify-center py-8">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-96 sm:w-full max-w-[1400px]"
        >
          <CarouselContent>
            {saleItems.map((box) => (
              <CarouselItem key={box.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 relative">
                <ProductCard
                  type={box.type}
                  percent={box.percent}
                  title={box.title}
                  price={box.price.toLocaleString("vi-VN") + "₫"}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700" />
          <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700" />
        </Carousel>
      </div>

      <h1 className="text-4xl text-red-600 text-center font-montserrat pt-14">
        BLINDBOX
        <span className="block w-24 h-[3px] bg-red-600 mt-1 mx-auto"></span>
      </h1>

      <div className="flex justify-center py-8">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-96 sm:w-full max-w-[1400px]"
        >
          <CarouselContent>
            {blindboxItems.map((box) => (
              <CarouselItem key={box.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 relative">
                <ProductCard
                  type={box.type}
                  percent={box.percent}
                  title={box.title}
                  price={box.price.toLocaleString("vi-VN") + "₫"} 
                />
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