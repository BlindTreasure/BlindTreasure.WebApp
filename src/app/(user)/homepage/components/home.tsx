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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GetAllProducts, TAllProductResponse } from "@/services/product/typings";
import useGetAllProductWeb from "../../allproduct/hooks/useGetAllProductWeb";
import { ProductStatus } from "@/const/products";
import { Backdrop } from "@/components/backdrop";
import CategoryGrid from "@/components/category-grid";
import { BlindBoxListResponse, GetBlindBoxes } from "@/services/blindboxes/typings";
import useGetAllBlindBoxes from "@/app/seller/allblindboxes/hooks/useGetAllBlindBoxes";
import BlindboxCard from "@/components/blindbox-card";
import { getRibbonTypes } from "@/utils/getRibbonTypes";
import { now } from "moment";
interface Blindbox {
  id: string;
  type: "blindbox" | "normal";
  tags?: ("sale" | "new")[];
  title: string;
  price: number;
  percent?: number;
  brand?: string;
  status?: string;
  material?: string[];
  packaging?: string;
  variants?: {
    name: string;
    quantity?: number;
  }[];
  images?: string[];
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

  const [products, setProducts] = useState<TAllProductResponse>()
  const [blindboxes, setBlindBox] = useState<BlindBoxListResponse>()
  const { getAllProductWebApi, isPending } = useGetAllProductWeb()
  const { getAllBlindBoxesApi, isPending: isBlindBox } = useGetAllBlindBoxes()
  const [loadingPage, setLoadingPage] = useState(false);
  const router = useRouter();


  const [params, setParams] = useState<GetAllProducts>({
    pageIndex: 1,
    pageSize: 100,
    search: "",
    productStatus: undefined,
    sellerId: "",
    categoryId: "",
    sortBy: undefined,
    desc: undefined,
  })

  const [blindBoxParams, setBlindBoxParams] = useState<GetBlindBoxes>({
    search: "",
    SellerId: "",
    categoryId: "",
    status: "",
    minPrice: undefined,
    maxPrice: undefined,
    ReleaseDateFrom: "",
    ReleaseDateTo: "",
    HasItem: undefined,
    pageIndex: 1,
    pageSize: 5,
  })

  const handleClick = (id: string) => {
    if (id === "1") {
      setLoadingPage(true);
      router.push("/allproduct");
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavigateWithLoading = (path: string) => {
  setLoadingPage(true);
  router.push(path);
};

  const handleViewDetail = (id: string) => {
    setLoadingPage(true);
    router.push(`/detail/${id}`);
  };

  const handleViewBlindboxDetail = (id: string) => {
    setLoadingPage(true);
    router.push(`/detail-blindbox/${id}`);
  };

  useEffect(() => {
    (async () => {
      const res = await getAllProductWebApi(params)
      if (res) setProducts(res.value.data)
    })()
  }, [params])

  useEffect(() => {
    (async () => {
      const res = await getAllBlindBoxesApi(blindBoxParams)
      if (res) {
        setBlindBox(res.value.data);
      }
    })()
  }, [params])

  const filteredItems = [
    ...(products?.result.filter((product) => {
      if (product.productType === "BlindBoxOnly") return false;

      const createdDate = new Date(product.createdAt);
      const diffInDays = (new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

      return diffInDays <= 7;
    }) ?? []),

    ...(blindboxes?.result.filter((box) => {
      if (!box.items || box.items.length === 0) return false;

      const releaseDate = new Date(box.releaseDate);
      const now = new Date();

      releaseDate.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);

      const diffInDays = (now.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24);
      return releaseDate <= now && diffInDays <= 7;
    }) ?? []),
  ].slice(0, 8);

  const visibleBlindboxes = blindboxes?.result.filter(
    (box) => box.items && box.items.length > 0
  ) ?? [];


  return (
    <>
      <div className="relative overflow-hidden">
        <HeroVideoSection />

        <motion.div
          variants={fadeIn("up", 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.7 }}
          className="flex flex-col justify-center items-center py-10">
          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-[#333] font-roboto">
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
              onClick={() => handleNavigateWithLoading("/allproduct")}
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
            viewport={{ once: true, amount: 0.7 }}
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
          viewport={{ once: true, amount: 0.7 }}
          className="text-4xl text-red-600 text-center font-montserrat">
          DANH MỤC
          <span className="block w-24 h-[2px] bg-red-600 mt-1 mx-auto"></span>
        </motion.h1>

        <CategoryGrid />

        <motion.div
          variants={fadeIn("left", 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 md:gap-4 py-4"
        >
          {images.map((item, index) => (
            <div
              key={index}
              onClick={() => handleClick(item.id)}
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
          viewport={{ once: true, amount: 0.7 }}
          className="text-4xl text-red-600 text-center font-montserrat pt-14">
          HÀNG MỚI VỀ
          <span className="block w-36 h-[3px] bg-red-600 mt-1 mx-auto"></span>
        </motion.h1>

        <motion.div
          variants={fadeIn("left", 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.7 }}
          className="mt-8 flex justify-center "

        >
          <Button
            variant="outline"
            className="border-2 border-[#d02a2a] rounded-full px-8 py-6 text-lg font-semibold text-[#d02a2a] hover:border-[#ACACAC] hover:bg-[#252424] hover:text-white transition-colors duration-300"
            onClick={() => handleNavigateWithLoading("/all-new-products")}
          >
            Xem thêm
          </Button>
        </motion.div>

        {filteredItems.length > 0 && (
          <motion.div
            variants={fadeIn("up", 0.3)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.7 }}
            className="flex justify-center pb-8"
          >
            <Carousel opts={{ align: "start" }} className="w-96 sm:w-full max-w-[1400px]">
              <CarouselContent>
                {filteredItems.map((item) => {
                  const isBlindbox = !("productType" in item);
                  const ribbonTypes = getRibbonTypes(item);

                  return isBlindbox ? (
                    <CarouselItem key={`blindbox-${item.id}`} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 relative">
                      <BlindboxCard
                        blindbox={item}
                        ribbonTypes={ribbonTypes}
                        onViewDetail={handleViewBlindboxDetail}
                      />
                    </CarouselItem>
                  ) : (
                    <CarouselItem key={item.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 relative">
                      <ProductCard
                        product={item}
                        ribbonTypes={ribbonTypes}
                        onViewDetail={handleViewDetail}
                      />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>

              {filteredItems.length > 4 && (
                <>
                  <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700" />
                  <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700" />
                </>
              )}
            </Carousel>
          </motion.div>
        )}

        <div className="my-12 text-center">
          <motion.h1
            variants={fadeIn("up", 0.3)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.7 }}
            className="text-4xl text-red-600 text-center font-montserrat">
            CÁCH HOẠT ĐỘNG
          </motion.h1>
          <motion.p
            variants={fadeIn("up", 0.3)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.7 }}
            className="text-gray-400 mb-8 mt-2">Khám phá túi mù theo cách bạn muốn</motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-20">
            {works.map((work, index) => (
              <motion.div
                key={index}
                className="bg-gray-900 p-6 rounded-lg"
                variants={fadeIn(index % 2 === 0 ? "right" : "left", index * 0.2)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
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
          viewport={{ once: true, amount: 0.7 }}
          className="text-4xl text-red-600 text-center font-montserrat pt-10">
          HÀNG KHUYẾN MÃI
          <span className="block w-36 h-[3px] bg-red-600 mt-1 mx-auto"></span>
        </motion.h1>

        <motion.div
          variants={fadeIn("left", 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.7 }}
          className="mt-8 flex justify-center "

        >
          <Button
            variant="outline"
            className="border-2 border-[#d02a2a] rounded-full px-8 py-6 text-lg font-semibold text-[#d02a2a] hover:border-[#ACACAC] hover:bg-[#252424] hover:text-white transition-colors duration-300"
          >
            Xem thêm
          </Button>
        </motion.div>

        {/* <motion.div
          variants={fadeIn("up", 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.7 }}
          className="flex justify-center pb-8">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-96 sm:w-full max-w-[1400px]"
          >
            <CarouselContent>
              {products?.result.map((product) => (
                <CarouselItem key={product.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 relative">
                  <ProductCard
                    // id={box.id}
                    // type={box.type}
                    // tags={box.tags}
                    // percent={box.percent}
                    // title={box.title}
                    // price={box.price.toLocaleString("vi-VN") + "₫"}
                    key={product.id}
                    product={product}
                    onViewDetail={handleViewDetail}
                  // type="normal"
                  // tags={["sale"]}
                  // percent={10}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700" />
            <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700" />
          </Carousel>
        </motion.div> */}

        <motion.h1
          id="4"
          variants={fadeIn("up", 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.7 }}
          className="text-4xl text-red-600 text-center font-montserrat pt-14">
          BLINDBOX
          <span className="block w-24 h-[3px] bg-red-600 mt-1 mx-auto"></span>
        </motion.h1>

        <motion.div
          variants={fadeIn("left", 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.7 }}
          className="mt-8 flex justify-center "

        >
          <Button
            variant="outline"
            className="border-2 border-[#d02a2a] rounded-full px-8 py-6 text-lg font-semibold text-[#d02a2a] hover:bg-[#252424] hover:border-[#ACACAC] hover:text-white transition-colors duration-300"
            onClick={() => handleNavigateWithLoading("/all-blindbox")}
          >
            Xem thêm
          </Button>
        </motion.div>

        <motion.div
          variants={fadeIn("up", 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.7 }}
          className="flex justify-center pb-8"
        >
          <Carousel
            opts={{ align: "start" }}
            className="w-96 sm:w-full max-w-[1400px]"
          >
            <CarouselContent>
              {visibleBlindboxes.map((box) => (
                <CarouselItem
                  key={`blindbox-${box.id}`}
                  className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 relative"
                >
                  <BlindboxCard
                    blindbox={box}
                    onViewDetail={handleViewBlindboxDetail}
                    ribbonTypes={["blindbox"]}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            {visibleBlindboxes.length > 4 && (
              <>
                <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700" />
                <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700" />
              </>
            )}
          </Carousel>
        </motion.div>


        <motion.h1
          variants={fadeIn("up", 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.7 }}
          className="text-4xl text-red-600 text-center font-montserrat pt-14">
          THƯƠNG HIỆU NỔI BẬT
          <span className="block w-24 h-[3px] bg-red-600 mt-1 mx-auto"></span>
        </motion.h1>

        <InfiniteMovingCardsDemo />
        <Backdrop open={loadingPage} />
      </div>
    </>
  );
}