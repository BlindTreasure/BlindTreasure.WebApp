import { FaRegHeart, FaHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Ribbon from "../blindbox";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import type { Swiper as SwiperType } from "swiper";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Product } from "@/services/product-seller/typings";
import { Backdrop } from "../backdrop";
import { StockStatus, stockStatusMap } from "@/const/products";
import useToggleWishlist from "@/app/(user)/wishlist/hooks/useToggleWishlist";
import { useAppSelector } from "@/stores/store";

interface ProductCardProps {
  product: Product;
  onViewDetail: (id: string) => void;
  ribbonTypes?: ("new" | "sale" | "blindbox")[];
  initialIsInWishlist?: boolean;
  initialWishlistId?: string;
  onWishlistChange?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetail,
  ribbonTypes = [],
  initialIsInWishlist = false,
  initialWishlistId,
  onWishlistChange
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const {
    isInWishlist,
    toggleWishlist,
    isPending: isToggling
  } = useToggleWishlist({
    initialIsInWishlist,
    initialWishlistId,
    onWishlistChange
  });
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const images = product.imageUrls.length > 0 ? product.imageUrls : ["/images/cart.webp"];
  const [quantity, setQuantity] = useState<number>(1);
  const isLoggedIn = useAppSelector((state) => !!state.userSlice.user);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleToggleWishlist = async () => {
    if (isToggling) return;

    try {
      const result = await toggleWishlist({
        productId: product.id,
        type: "Product"
      });

      if (result?.success) {
        console.log(`Wishlist ${result.action}:`, product.name);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  useEffect(() => {
    if (!open) {
      mainSwiper?.destroy(true, false);
      thumbsSwiper?.destroy(true, false);
      setMainSwiper(null);
      setThumbsSwiper(null);
    }
  }, [open]);


  return (

    <div className="relative p-2 mt-6 transition-all duration-300 transform hover:scale-105">
      <Ribbon createdAt={product.createdAt} types={ribbonTypes} />
      <Card className="relative w-full rounded-xl overflow-hidden p-4 shadow-lg bg-white">
        <div className="w-full h-48 overflow-hidden rounded-md relative group">
          <img
            src={images[0]}
            alt="Product"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="text-xs px-3 py-2 rounded-md bg-white text-black hover:bg-gray-300">
                  Xem nhanh
                </Button>
              </DialogTrigger>

              <DialogContent
                className="max-w-96 sm:max-w-xl md:max-w-2xl lg:max-w-4xl p-6"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
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
                      <h2 className="text-2xl font-semibold">{product.name}</h2>
                      <div className='flex gap-2'>
                        <p>Thương hiệu: <span className='text-[#00579D] text-sm uppercase'>{product.brand}</span></p>
                        <div className="w-px h-5 bg-gray-300" />
                        <p>Tình trạng: <span className='text-[#00579D]'>{stockStatusMap[product?.productStockStatus as StockStatus]}</span></p>
                      </div>
                      <p className="text-red-600 font-bold text-3xl">
                        {product.price.toLocaleString("vi-VN")}₫
                      </p>
                      <p>Mô tả: <span className='text-gray-600 text-sm line-clamp-2'>{product.description}</span></p>

                      <div className="flex items-center gap-4 mt-6">
                        <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                          <button
                            onClick={handleDecrease}
                            className="w-10 h-10 bg-[#252424] text-white text-xl flex items-center justify-center"
                          >
                            −
                          </button>
                          <input
                            type="text"
                            value={quantity}
                            readOnly
                            className="w-12 h-9 text-center"
                          />
                          <button
                            onClick={handleIncrease}
                            className="w-10 h-10 bg-[#252424] text-white text-xl flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>

                        <Button className="py-5">
                          Mua ngay
                        </Button>
                      </div>

                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button className="text-xs px-3 py-2 rounded-md bg-white text-black hover:bg-gray-300" onClick={() => onViewDetail(product.id)}>
              Xem chi tiết
            </Button>

          </div>
        </div>

        <div className="mt-4 text-sm">
          <p className="truncate font-semibold text-gray-800">{product.name}</p>
          <p className="text-red-600 font-bold text-lg">
            {product.price.toLocaleString("vi-VN")}₫
          </p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <Button className="text-xs px-3 py-2 rounded-md bg-[#252424] text-white hover:bg-opacity-70 transition-all duration-300 transform hover:scale-105">
            Thêm vào giỏ hàng
          </Button>
          {isLoggedIn && (
            <button
              onClick={handleToggleWishlist}
              disabled={isToggling}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {isInWishlist ? (
                <FaHeart className="text-2xl text-red-500" />
              ) : (
                <FaRegHeart className="text-2xl hover:text-red-500 transition-colors" />
              )}
            </button>
          )}
        </div>
      </Card>
    </div>


  );
};

export default ProductCard;