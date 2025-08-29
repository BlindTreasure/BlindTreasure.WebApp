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
  onAddToCart?: (productId: string, quantity: number) => Promise<void>;
  ribbonTypes?: ("new" | "sale" | "blindbox" | "product")[];
  initialIsInWishlist?: boolean;
  initialWishlistId?: string;
  onWishlistChange?: () => void;
  context?: "new" | "sale" | "default";
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetail,
  onAddToCart,
  ribbonTypes = [],
  initialIsInWishlist = false,
  initialWishlistId,
  onWishlistChange,
  context = "default"
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const finalRibbonTypes: ("new" | "sale" | "blindbox" | "product")[] = (() => {
    if (context === "new") {
      return ribbonTypes.includes("new") ? ribbonTypes : [...ribbonTypes, "new" as const];
    } else if (context === "sale") {
      return product.listedPrice != null && product.listedPrice > 0
        ? [...ribbonTypes.filter(type => type !== "new"), "sale" as const]
        : ribbonTypes;
    } else {
      return product.listedPrice != null && product.listedPrice > 0
        ? [...ribbonTypes.filter(type => type !== "new"), "sale" as const]
        : ribbonTypes;
    }
  })();

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

  const handleAddToCart = async (quantityToAdd: number = 1) => {
    if (!onAddToCart || isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      await onAddToCart(product.id, quantityToAdd);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (isToggling) return;

    try {
      await toggleWishlist({
        productId: product.id,
        type: "Product"
      });
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
      <Ribbon createdAt={product.createdAt} types={finalRibbonTypes} />
      <Card className="relative w-full rounded-xl overflow-hidden p-4 shadow-lg bg-white">
        <div className="w-full h-48 overflow-hidden rounded-md relative group">
          <img
            src={images[0]}
            alt="Product"
            className="w-full h-full object-cover"
          />

          {product.totalStockQuantity === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-black text-lg font-bold uppercase bg-white/80 w-full flex justify-center p-4">
                Hết hàng
              </span>
            </div>
          )}

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
                        <p>Tình trạng: <span className='text-[#00579D]'>{stockStatusMap[product?.productStockStatus as StockStatus]} ({product?.totalStockQuantity})</span></p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {product.listedPrice != null && product.listedPrice > 0 && (
                          <p className="text-gray-500 text-xl line-through">
                            {product.listedPrice.toLocaleString("vi-VN")}₫
                          </p>
                        )}
                        <p className="text-red-600 font-bold text-3xl">
                          {product.realSellingPrice.toLocaleString("vi-VN")}₫
                        </p>
                      </div>
                      <p>Mô tả: <span className='text-gray-600 text-sm line-clamp-2'>{product.description}</span></p>
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
          <div className="flex justify-between items-center gap-1">
            {product.listedPrice != null && product.listedPrice > 0 && (
              <p className="text-gray-500 text-sm line-through">
                {product.listedPrice.toLocaleString("vi-VN")}₫
              </p>
            )}
            <p className="text-red-600 font-bold text-lg">
              {product.realSellingPrice.toLocaleString("vi-VN")}₫
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          {/* <Button
            className="text-xs px-3 py-2 rounded-md bg-[#252424] text-white hover:bg-opacity-70 transition-all duration-300 transform hover:scale-105"
            onClick={() => handleAddToCart(1)}
            disabled={isAddingToCart || product.totalStockQuantity === 0}
          >
            {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
          </Button> */}
          <button
            onClick={() => handleAddToCart(1)}
            disabled={isAddingToCart || product.totalStockQuantity === 0}
            className={`text-xs px-3 py-2 rounded-md bg-[#252424] text-white
    hover:bg-opacity-70 transition-all duration-300 transform hover:scale-105
    ${isAddingToCart || product.totalStockQuantity === 0 ? "cursor-not-allowed opacity-50 hover:scale-100 hover:bg-opacity-100" : ""}`}
          >
            {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
          </button>
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