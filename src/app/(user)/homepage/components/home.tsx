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
import { BlindboxStatus, ProductStatus } from "@/const/products";
import { Backdrop } from "@/components/backdrop";
import CategoryGrid from "@/components/category-grid";
import { BlindBoxListResponse, GetBlindBoxes } from "@/services/blindboxes/typings";
import useGetAllBlindBoxes from "@/app/seller/allblindboxes/hooks/useGetAllBlindBoxes";
import BlindboxCard from "@/components/blindbox-card";
import { getRibbonTypes } from "@/utils/getRibbonTypes";
import { now } from "moment";
import useGetCategory from "../hooks/useGetCategory"
import { useAppDispatch, useAppSelector } from "@/stores/store";
import {
  setCategoryId,
  setMinPrice,
  setMaxPrice,
  setReleaseDateFrom,
  setReleaseDateTo,
  clearFilters
} from "@/stores/filter-product-slice";
import { useWishlistContext } from "@/contexts/WishlistContext";

// Interface cho thông báo marquee
interface MarqueeMessage {
  text: string;
  tier: 'legendary' | 'epic' | 'rare';
  tierText: string;
}

// Component thanh thông báo marquee
const MarqueeNotification = () => {
  const [currentMessage, setCurrentMessage] = useState<MarqueeMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Fake data cho thông báo với tier colors
  const messages: MarqueeMessage[] = [
    {
      text: "🎉 Nguyễn Minh A vừa mở được Figure Naruto Limited Edition từ Mystery Anime Box!",
      tier: "legendary",
      tierText: "Huyền Thoại"
    },
    {
      text: "⭐ Trần Thị B vừa trúng Gundam RX-78-2 Real Grade từ Mecha Collection Box!",
      tier: "epic", 
      tierText: "Sử Thi"
    },
    {
      text: "💎 Lê Văn C vừa nhận được Pokemon Charizard Holographic từ Pokemon TCG Mystery Box!",
      tier: "rare",
      tierText: "Hiếm"
    },
    {
      text: "👑 Phạm Thị D vừa mở ra One Piece Luffy Gear 5 Figure từ One Piece Ultimate Box!",
      tier: "legendary",
      tierText: "Huyền Thoại"
    },
    {
      text: "🌟 Hoàng Minh E vừa trúng Dragon Ball Goku Ultra Instinct từ Dragon Ball Z Collection!",
      tier: "epic",
      tierText: "Sử Thi"
    },
    {
      text: "🔥 Mai Lan F vừa nhận được Attack on Titan Eren Figure từ AOT Mystery Box!",
      tier: "rare",
      tierText: "Hiếm"
    },
    {
      text: "✨ Võ Thành G vừa mở được Demon Slayer Tanjiro Sword từ Demon Slayer Collection!",
      tier: "legendary",
      tierText: "Huyền Thoại"
    }
  ];

  useEffect(() => {
    const showRandomMessage = () => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setCurrentMessage(randomMessage);
      setIsVisible(true);

      // Ẩn thông báo sau 12 giây
      setTimeout(() => {
        setIsVisible(false);
      }, 12000);
    };

    // Hiển thị thông báo đầu tiên
    showRandomMessage();

    // Hiển thị thông báo mới mỗi 15-20 giây
    const interval = setInterval(() => {
      if (!isVisible) {
        showRandomMessage();
      }
    }, Math.random() * 5000 + 15000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible || !currentMessage) return null;

  // Hàm lấy màu theo tier
  const getTierColors = (tier: 'legendary' | 'epic' | 'rare'): string => {
    switch(tier) {
      case 'legendary':
        return 'from-yellow-500/70 via-orange-500/70 to-red-600/70'; // Vàng đỏ với opacity
      case 'epic':
        return 'from-purple-500/70 via-blue-600/70 to-indigo-700/70'; // Tím với opacity
      case 'rare':
        return 'from-blue-500/70 via-cyan-500/70 to-teal-600/70'; // Xanh với opacity
      default:
        return 'from-gray-500/70 to-gray-700/70'; // Mặc định với opacity
    }
  };

  return (
    <div className="w-full mb-6">
      <div className={`bg-gradient-to-r ${getTierColors(currentMessage.tier)} text-white py-4 overflow-hidden shadow-lg backdrop-blur-sm`}>
        <div 
          className="whitespace-nowrap text-sm md:text-base font-medium"
          style={{
            animation: 'marquee 12s linear infinite'
          }}
        >
          {currentMessage.text} ({currentMessage.tierText})
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};

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
  const [category, setCategory] = useState<API.Category[]>()
  const { getAllProductWebApi, isPending } = useGetAllProductWeb()
  const { getAllBlindBoxesApi, isPending: isBlindBox } = useGetAllBlindBoxes()
  const { getCategoryApi, isPending: isCategory } = useGetCategory();
  const [loadingPage, setLoadingPage] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.filterSlice);
  const { getItemWishlistStatus, refreshWishlistStatus } = useWishlistContext();

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

  const [categoriesParams, setCategoriesParams] = useState<REQUEST.GetCategory>({
    pageIndex: 1,
    pageSize: 100,
    search: ""
  })

  const [blindBoxParams, setBlindBoxParams] = useState<GetBlindBoxes>({
    search: "",
    SellerId: "",
    categoryId: "",
    status: BlindboxStatus.Approved,
    minPrice: undefined,
    maxPrice: undefined,
    ReleaseDateFrom: "",
    ReleaseDateTo: "",
    HasItem: undefined,
    pageIndex: 1,
    pageSize: 100,
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

  useEffect(() => {
    (async () => {
      const res = await getCategoryApi(categoriesParams);
      if (res) {
        const parentCategories = res.value.data.result.filter(
          (cat: any) => !cat.parent_id || cat.parent_id === 0
        );

        const transformedCategories: API.Category[] = parentCategories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          description: cat.description,
          parentId: cat.parent_id || undefined,
          isDeleted: cat.isDeleted,
          createdAt: cat.createdAt,
          imageUrl: cat.imageUrl || undefined,
          children: undefined,
        }));

        setCategory(transformedCategories);
      }
    })();
  }, [categoriesParams]);

  const handleCategoryClick = (category: API.Category) => {
    setLoadingPage(true);

    // Dispatch action để set category filter trong Redux store
    dispatch(clearFilters()); // Reset các filter khác trước
    dispatch(setCategoryId(category.id));

    // Tạo URL với query parameters
    const queryParams = new URLSearchParams({
      categoryId: category.id.toString(),
      categoryName: encodeURIComponent(category.name)
    });

    // Navigate đến trang allproduct với query parameters
    router.push(`/allproduct?${queryParams.toString()}`);
  };

  const allItems = [
    ...(products?.result.filter((product) => product.productType !== "BlindBoxOnly") ?? []),
    ...(blindboxes?.result.filter((box) => box.items && box.items.length > 0) ?? [])
  ];

  const now = new Date();

  const filteredItems = allItems
    .filter((item) => {
      const createdAt = new Date(item.createdAt);
      const diffInDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return !isNaN(createdAt.getTime()) && diffInDays <= 7;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const visibleBlindboxes = blindboxes?.result.filter(
    (box) => box.items && box.items.length > 0
  ) ?? [];

  return (
    <>
      <div className="relative overflow-hidden">
        <HeroVideoSection />

        {/* THANH THÔNG BÁO - Thêm ở đây */}
        <MarqueeNotification />

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

        <CategoryGrid
          categories={category ?? []}
          onCategoryClick={handleCategoryClick}
          loading={loadingPage}
          className="my-custom-class"
        />

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
            className="border-2 border-[#d02a2a] rounded-full px-8 py-6 text-lg font-semibold text-[#d02a2a] hover:border-[#ACACAC] hover:bg-[#d02a2a] hover:text-white transition-colors duration-300"
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
                  const wishlistStatus = getItemWishlistStatus(item.id);

                  return isBlindbox ? (
                    <CarouselItem key={`blindbox-${item.id}`} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 relative">
                      <BlindboxCard
                        blindbox={item}
                        ribbonTypes={ribbonTypes}
                        onViewDetail={handleViewBlindboxDetail}
                        initialIsInWishlist={wishlistStatus.isInWishlist}
                        initialWishlistId={wishlistStatus.wishlistId}
                        onWishlistChange={refreshWishlistStatus}
                      />
                    </CarouselItem>
                  ) : (
                    <CarouselItem key={item.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 relative">
                      <ProductCard
                        product={item}
                        ribbonTypes={ribbonTypes}
                        onViewDetail={handleViewDetail}
                        initialIsInWishlist={wishlistStatus.isInWishlist}
                        initialWishlistId={wishlistStatus.wishlistId}
                        onWishlistChange={refreshWishlistStatus}
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
            className="border-2 border-[#d02a2a] rounded-full px-8 py-6 text-lg font-semibold text-[#d02a2a] hover:border-[#ACACAC] hover:bg-[#d02a2a] hover:text-white transition-colors duration-300"
          >
            Xem thêm
          </Button>
        </motion.div>

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
            className="border-2 border-[#d02a2a] rounded-full px-8 py-6 text-lg font-semibold text-[#d02a2a] hover:bg-[#d02a2a] hover:border-[#ACACAC] hover:text-white transition-colors duration-300"
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
              {visibleBlindboxes.map((box) => {
                const wishlistStatus = getItemWishlistStatus(box.id);
                return (
                  <CarouselItem
                    key={`blindbox-${box.id}`}
                    className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 relative"
                  >
                    <BlindboxCard
                      blindbox={box}
                      onViewDetail={handleViewBlindboxDetail}
                      ribbonTypes={["blindbox"]}
                      initialIsInWishlist={wishlistStatus.isInWishlist}
                      initialWishlistId={wishlistStatus.wishlistId}
                      onWishlistChange={refreshWishlistStatus}
                    />
                  </CarouselItem>
                );
              })}
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