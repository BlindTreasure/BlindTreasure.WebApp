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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { SpotlightPreview } from "@/components/spotlight";
import ProductCard from "@/components/product-card";
import { InfiniteMovingCardsDemo } from "@/components/infinite-moving-cards";
import HeroVideoSection from "@/components/hero-home";
import { fadeIn } from "@/utils/variants";


interface Blindbox {
  id: number;
  type: "new" | "sale" | "blindbox";
  percent?: number;
  title: string;
  price: number
}

export default function HomePage() {
  const images = [
    { src: "/images/1.png", id: "1" },
    { src: "/images/2.png", id: "2" },
    { src: "/images/3.png", id: "3" },
    { src: "/images/4.png", id: "4" },
  ];

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
      <HeroVideoSection />

      <motion.div
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.7 }}
        className="flex flex-col justify-center items-center py-10">
        <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-[#333]">
          HỘP BÍ ẨN
        </h1>
        <p className="text-lg text-[#333] mt-2">
          Đến BlindTreasure và tìm kiếm sản phẩm, trải nghiệm hộp bí ẩn bất ngờ.
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
      </motion.div>

      <section className="relative z-10 w-full">
        <motion.div
          variants={fadeIn("up", 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.7 }}
          className="container mx-auto">
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
        </motion.div>
      </section>

      <motion.h1
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.7 }}
        className="text-4xl text-red-600 text-center font-montserrat">
        DANH MỤC
        <span className="block w-24 h-[2px] bg-red-600 mt-1 mx-auto"></span>
      </motion.h1>

      <motion.div
        variants={fadeIn("left", 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.7 }}
        className="grid grid-cols-2 md:grid-cols-4 md:gap-4"
      >
        {images.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              const el = document.getElementById(item.id);
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="md:h-64 h-40 bg-gray-100 cursor-pointer"
          >
            <img src={item.src} className="w-full h-full object-cover transition-all duration-300 transform hover:scale-105" />
          </div>
        ))}
      </motion.div>


      <SpotlightPreview />

      <motion.h1
        id="2"
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.7 }}
        className="text-4xl text-red-600 text-center font-montserrat pt-14">
        HÀNG MỚI VỀ
        <span className="block w-36 h-[3px] bg-red-600 mt-1 mx-auto"></span>
      </motion.h1>

      <motion.div
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.7 }}
        className="flex justify-center py-8">
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
                  title={box.title}
                  price={box.price.toLocaleString("vi-VN") + "₫"}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700" />
          <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700" />
        </Carousel>
      </motion.div>

      <div className="my-12 text-center">
        <motion.h1
          variants={fadeIn("up", 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.7 }}
          className="text-4xl text-red-600 text-center font-montserrat">
          CÁCH HOẠT ĐỘNG
        </motion.h1>
        <motion.p
          variants={fadeIn("up", 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.7 }}
          className="text-gray-400 mb-8 mt-2">Khám phá túi mù theo cách bạn muốn</motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-20">
          {works.map((work, index) => (
            <motion.div
              key={index}
              className="bg-gray-900 p-6 rounded-lg"
              variants={fadeIn(index % 2 === 0 ? "right" : "left", index * 0.2)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.3 }}
            >
              {work.icon}
              <h3 className="text-xl font-semibold text-white mb-2">{work.title}</h3>
              <p className="text-neutral-400 text-sm">{work.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.h1
        id="3"
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.7 }}
        className="text-4xl text-red-600 text-center font-montserrat pt-14">
        HÀNG KHUYẾN MÃI
        <span className="block w-36 h-[3px] bg-red-600 mt-1 mx-auto"></span>
      </motion.h1>

      <motion.div
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.7 }}
        className="flex justify-center py-8">
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
      </motion.div>

      <motion.h1
        id="4"
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.7 }}
        className="text-4xl text-red-600 text-center font-montserrat pt-14">
        BLINDBOX
        <span className="block w-24 h-[3px] bg-red-600 mt-1 mx-auto"></span>
      </motion.h1>

      <motion.div
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.7 }}
        className="flex justify-center py-8">
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
      </motion.div>

      <motion.h1
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.7 }}
        className="text-4xl text-red-600 text-center font-montserrat pt-14">
        THƯƠNG HIỆU NỔI BẬT
        <span className="block w-24 h-[3px] bg-red-600 mt-1 mx-auto"></span>
      </motion.h1>

      <InfiniteMovingCardsDemo />

    </div>
  );
}