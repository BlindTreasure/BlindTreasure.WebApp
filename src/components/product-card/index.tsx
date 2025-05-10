import { FaRegHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Ribbon from "../blindbox";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import type { Swiper as SwiperType } from 'swiper';
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProductCardProps {
  id: number;
  type: "new" | "sale" | "blindbox";
  percent?: number;
  image?: string;
  title: string;
  price: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  type,
  percent,
  image = "/images/cart.webp",
  title,
  price,
}) => {
  const images = [
    image,
    "/images/2.png",
    "/images/3.png",
    "/images/4.png",
    "/images/4.png",
    "/images/4.png",
    "/images/4.png",
  ];
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!open) {
      if (mainSwiper) {
        mainSwiper.destroy(true, false);
        setMainSwiper(null);
      }
      if (thumbsSwiper) {
        thumbsSwiper.destroy(true, false);
        setThumbsSwiper(null);
      }
    }
  }, [open]);


  return (
    <div className="relative p-2 mt-6 transition-all duration-300 transform hover:scale-105">
      <Ribbon type={type} percent={percent} />
      <Card className="relative w-full rounded-xl overflow-hidden p-4 shadow-lg bg-white">

        <div className="w-full h-48 overflow-hidden rounded-md relative group">
          <img
            src={image}
            alt="Product"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="text-xs px-3 py-2 rounded-md bg-white text-black hover:bg-gray-300">Xem nhanh</Button>
              </DialogTrigger>

              <DialogContent className="max-w-96 sm:max-w-xl md:max-w-2xl lg:max-w-4xl p-6" onOpenAutoFocus={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {open && (
                      <>
                        <Swiper
                          spaceBetween={10}
                          thumbs={{ swiper: thumbsSwiper }}
                          modules={[Thumbs]}
                          onSwiper={setMainSwiper}
                        >
                          {images.map((img, idx) => (
                            <SwiperSlide key={`main-${idx}`}>
                              <img
                                src={img}
                                alt={`Product ${idx}`}
                                className="w-full h-80 object-cover rounded-xl"
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>

                        <div className="mt-4">
                          <Swiper
                            onSwiper={setThumbsSwiper}
                            spaceBetween={10}
                            slidesPerView={4}
                            watchSlidesProgress
                            modules={[Thumbs, Navigation]}
                            navigation
                          >
                            {images.map((img, idx) => (
                              <SwiperSlide key={`thumb-${idx}`}>
                                <img
                                  src={img}
                                  alt={`Thumbnail ${idx}`}
                                  className="w-full h-20 object-cover rounded-md cursor-pointer border-2 hover:border-black"
                                />
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex flex-col justify-between">
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold">{title}</h2>
                      <p className="text-red-600 font-bold text-lg">{price}</p>
                      <p className="text-sm text-gray-600">
                        Mô tả sản phẩm sẽ được hiển thị ở đây
                      </p>
                      <Button className="bg-black text-white w-full">Mua ngay</Button>
                    </div>
                  </div>
                </div>
              </DialogContent>

            </Dialog>

            <Link href={`/detail/${id}`}>
              <Button className="text-xs px-3 py-2 rounded-md bg-white text-black hover:bg-gray-300">
                Xem chi tiết
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-4 text-sm">
          <p className="truncate font-semibold text-gray-800">{title}</p>
          <p className="text-red-600 font-bold text-lg">{price}</p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <Button className="text-xs px-3 py-2 rounded-md bg-[#252424] text-white hover:bg-opacity-70 transition-all duration-300 transform hover:scale-105">
            Thêm vào giỏ hàng
          </Button>
          <FaRegHeart className="text-2xl cursor-pointer hover:text-red-500" />
        </div>
      </Card>
    </div>
  );
};

export default ProductCard;