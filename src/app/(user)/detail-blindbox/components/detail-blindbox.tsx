'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import type { Swiper as SwiperType } from 'swiper';
import { motion } from "framer-motion";
import { fadeIn } from '@/utils/variants';
import useGetBlindboxByIdWeb from '../hooks/useGetBlindboxById';
import useAddBlindboxToCart from "../hooks/useAddBlindboxToCart"
import { BlindBox } from '@/services/blindboxes/typings';
import { Backdrop } from '@/components/backdrop';
import { ProductTabs } from '@/components/tabs';
import ProductReviews from '@/components/product-reviews';
import { BlindboxStatus, Rarity, StockStatus, stockStatusMap } from '@/const/products';
import { BlindboxItemSheet } from '@/components/thumbnail-blindbox';
import LightboxGallery from '@/components/lightbox-gallery';
import useGetAllBlindBoxes from '@/app/seller/allblindboxes/hooks/useGetAllBlindBoxes';
import { useRouter } from 'next/navigation';
import BlindboxCard from '@/components/blindbox-card';
import CustomerSellerChat from '@/components/chat-widget';
import { getRibbonTypes } from '@/utils/getRibbonTypes';
import useGetSellerById from '@/app/(user)/detail/hooks/useGetSellerById';
import useGetProductByIdWeb from '@/app/(user)/detail/hooks/useGetProductByIdWeb';
import useGetAllProductWeb from '@/app/(user)/allproduct/hooks/useGetAllProductWeb';
import { TbMessageDots } from 'react-icons/tb';
import { BsShop } from 'react-icons/bs';
import { useWishlistContext } from "@/contexts/WishlistContext";
import useGetOverviewSeller from '../../shop/hooks/useOverviewSeller';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';


interface BlindboxProps {
    blindBoxId: string;
}

export default function BlindboxDetail({ blindBoxId }: BlindboxProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [blindbox, setBlindbox] = useState<BlindBox | null>(null);
    const [relatedBlindboxes, setRelatedBlindboxes] = useState<BlindBox[]>([]);
    const [sellerInfo, setSellerInfo] = useState<API.SellerById | null>(null);
    const [sellerId, setSellerId] = useState<string | null>(null);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [showChat, setShowChat] = useState(false);
    const [chatTargetUserId, setChatTargetUserId] = useState<string>('');
    const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
    const { getBlindboxByIdWebApi, isPending } = useGetBlindboxByIdWeb();
    const { getAllBlindBoxesApi } = useGetAllBlindBoxes()
    const { addBlindboxToCartApi, isPending: isAddingToCart } = useAddBlindboxToCart();
    const { getPSellerByIdApi, isPending: isSellerPending } = useGetSellerById();
    const { getOverViewSellerApi, isPending: isSellerOverviewPending } = useGetOverviewSeller();
    const [seller, setSeller] = useState<API.SellerInfo | null>(null);
    const { getProductByIdWebApi } = useGetProductByIdWeb();
    const { getAllProductWebApi } = useGetAllProductWeb();
    const { getItemWishlistStatus, refreshWishlistStatus } = useWishlistContext();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);
    const router = useRouter();

    const openSheet = () => {
        setIsSheetOpen(true);
    };

    const closeSheet = () => {
        setIsSheetOpen(false);
    };

    useEffect(() => {
        (async () => {
            const res = await getBlindboxByIdWebApi(blindBoxId);
            const box = res?.value?.data;
            if (box) {
                setBlindbox(box);

                // Fetch seller info from first product in blindbox
                if (box.items && box.items.length > 0) {
                    const firstProductId = box.items[0].productId;
                    const productRes = await getProductByIdWebApi(firstProductId);
                    if (productRes?.value?.data?.sellerId) {
                        const sellerIdFromProduct = productRes.value.data.sellerId;
                        setSellerId(sellerIdFromProduct);

                        const sellerRes = await getOverViewSellerApi(sellerIdFromProduct);
                        if (sellerRes) {
                            setSeller(sellerRes.value.data);
                        }

                        const sellerInfoRes = await getPSellerByIdApi(sellerIdFromProduct);
                        if (sellerInfoRes) {
                            setSellerInfo(sellerInfoRes.value.data);
                        }

                        // Fetch total products count (products + blindboxes)
                        setIsLoadingProducts(true);
                        try {
                            const [productsRes, blindboxesRes] = await Promise.all([
                                getAllProductWebApi({
                                    pageIndex: 1,
                                    pageSize: 1,
                                    search: "",
                                    productStatus: undefined,
                                    sellerId: sellerIdFromProduct,
                                    categoryId: "",
                                    sortBy: undefined,
                                    desc: undefined,
                                }),
                                getAllBlindBoxesApi({
                                    pageIndex: 1,
                                    pageSize: 1,
                                    search: "",
                                    SellerId: sellerIdFromProduct,
                                    categoryId: "",
                                    status: BlindboxStatus.Approved,
                                    minPrice: undefined,
                                    maxPrice: undefined,
                                    ReleaseDateFrom: "",
                                    ReleaseDateTo: "",
                                    HasItem: undefined,
                                })
                            ]);

                            const productCount = productsRes?.value?.data?.count || 0;
                            const blindboxCount = blindboxesRes?.value?.data?.count || 0;
                            setTotalProducts(productCount + blindboxCount);
                        } catch (error) {
                            setTotalProducts(0);
                        } finally {
                            setIsLoadingProducts(false);
                        }
                    }
                }
            }
        })();
    }, [blindBoxId]);

    useEffect(() => {
        if (!blindbox) return;

        const fetchRelatedblindbox = async () => {
            const res = await getAllBlindBoxesApi({
                search: "",
                SellerId: "",
                categoryId: blindbox.categoryId,
                status: BlindboxStatus.Approved,
                minPrice: undefined,
                maxPrice: undefined,
                ReleaseDateFrom: "",
                ReleaseDateTo: "",
                HasItem: undefined,
                pageIndex: 1,
                pageSize: 5,
            });

            if (res) {
                const filtered = res.value.data.result
                    .filter(item => {
                        const isNotSame = item.id !== blindbox.id;
                        const shouldInclude = blindbox.brand
                            ? isNotSame && item.brand === blindbox.brand
                            : isNotSame;
                        return shouldInclude;
                    })
                    .slice(0, 4);

                setRelatedBlindboxes(filtered);
            }
        };

        fetchRelatedblindbox();
    }, [blindbox]);

    const handleViewBlindboxDetail = (id: string) => {
        setLoadingPage(true);
        router.push(`/detail-blindbox/${id}`);
    };

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        const maxQuantity = blindbox?.totalQuantity || 999;
        if (quantity < maxQuantity) {
            setQuantity(quantity + 1);
        }
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value === '') {
            setQuantity(0);
            return;
        }

        const numericValue = parseInt(value);
        if (isNaN(numericValue)) return;

        const maxQuantity = blindbox?.totalQuantity || 999;

        if (numericValue >= 1 && numericValue <= maxQuantity) {
            setQuantity(numericValue);
        } else if (numericValue > maxQuantity) {
            setQuantity(maxQuantity);
        }
    };

    const handleQuantityBlur = () => {
        if (quantity === 0) {
            setQuantity(1);
        }
    };

    const handleAddToCart = async () => {
        if (!blindbox?.id) {
            return;
        }

        try {
            const cartData = {
                blindBoxId: blindbox.id,
                quantity: quantity
            };

            await addBlindboxToCartApi(cartData);
        } catch (error) {
        }
    };

    const images = blindbox?.imageUrl
        ? [blindbox.imageUrl, ...(blindbox.items?.map((item) => item.imageUrl) || [])]
        : [];

    const isReleased = (() => {
        if (!blindbox?.releaseDate) return false;

        const today = new Date();
        const release = new Date(blindbox.releaseDate);
        today.setHours(0, 0, 0, 0);
        release.setHours(0, 0, 0, 0);

        return release <= today;
    })();

    const handleOpenChat = useCallback((targetUserId: string) => {
        setChatTargetUserId(targetUserId);
        setShowChat(true);
    }, []);

    return (
        <div className="p-6 mt-32 sm:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    variants={fadeIn("right", 0.3)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.7 }}
                >
                    <Swiper spaceBetween={10} thumbs={{ swiper: thumbsSwiper }} modules={[Thumbs]}>
                        {images.map((img, idx) => (
                            <SwiperSlide key={`main-${idx}`}>
                                <LightboxGallery images={[img]} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className="mt-4 relative">
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            spaceBetween={10}
                            slidesPerView={4}
                            watchSlidesProgress
                            navigation
                            modules={[Thumbs, Navigation]}
                            className="thumbnail-swiper px-8"
                        >
                            {images.map((img, idx) => (
                                <SwiperSlide key={`thumb-${idx}`}>
                                    <img
                                        src={img}
                                        alt={`Thumb ${idx}`}
                                        className="w-full h-20 object-cover rounded-md cursor-pointer border-2 hover:border-black"
                                        onClick={openSheet}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </motion.div>

                <motion.div
                    variants={fadeIn("left", 0.3)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.7 }}
                    className='space-y-4'
                >
                    <h2 className="text-3xl font-bold font-roboto mb-4">{blindbox?.name}</h2>
                    <div className='flex gap-8'>
                        <div className='flex gap-8'>
                            <p className='text-xl'>Thương hiệu: <span className='text-[#00579D] uppercase'>{blindbox?.brand}</span></p>
                            <div className="w-px h-5 bg-gray-300" />
                            <p className='text-xl'>Tình trạng: <span className='text-[#00579D]'>{stockStatusMap[blindbox?.blindBoxStockStatus as StockStatus]} ({blindbox?.totalQuantity})</span></p>
                            <div className="w-px h-5 bg-gray-300" />
                        </div>
                        {blindbox?.hasSecretItem && (
                            <p className='text-xl'>Xác suất bí mật: <span className='text-[#EF1104]'>{blindbox.secretProbability}%</span></p>
                        )}
                    </div>
                    <p className="text-4xl font-semibold mt-2 text-[#EF1104]">
                        {blindbox?.price.toLocaleString("vi-VN")}₫
                    </p>
                    {blindbox && (
                        <p className='text-xl'>
                            Ngày phát hành:{" "}
                            {isReleased ? (
                                <span className='text-gray-600 text-xl'>
                                    {new Date(blindbox.releaseDate).toLocaleDateString("vi-VN")}
                                </span>
                            ) : (
                                <span className='text-xl italic text-red-500'>Chưa phát hành</span>
                            )}
                        </p>
                    )}

                    {isReleased && (
                        <div className="flex items-center gap-4 mt-6">
                            <div className="flex items-center border border-gray-400 rounded-full overflow-hidden">
                                <button
                                    onClick={handleDecrease}
                                    className="w-10 h-10 bg-[#252424] text-white text-xl flex items-center justify-center hover:bg-gray-700 transition-colors"
                                    disabled={quantity <= 1}
                                >
                                    −
                                </button>
                                <input
                                    type="number"
                                    value={quantity === 0 ? '' : quantity}
                                    onChange={handleQuantityChange}
                                    onBlur={handleQuantityBlur}
                                    min="1"
                                    max={blindbox?.totalQuantity || 999}
                                    className="w-12 h-10 text-center border-t border-b border-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <button
                                    onClick={handleIncrease}
                                    disabled={quantity >= (blindbox?.totalQuantity || 999)}
                                    className="w-10 h-10 bg-[#252424] text-white text-xl flex items-center justify-center hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={isAddingToCart || !blindbox}
                                className="bg-[#252424] text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 z-10 relative"
                                style={{ pointerEvents: 'auto' }}
                            >
                                {isAddingToCart ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Đang thêm...
                                    </>
                                ) : (
                                    'Thêm vào giỏ hàng'
                                )}
                            </button>
                        </div>
                    )}

                </motion.div>
            </div>

            <motion.div
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.7 }}
                className="bg-white rounded-lg py-6 px-8 mt-8 border shadow-sm"
            >
                <div className="flex flex-col xl:flex-row xl:items-center gap-6">
                    <div className="md:flex-row items-center gap-8 flex flex-col">
                        <div className="relative w-20 h-20 flex-shrink-0">
                            <div className="w-full h-full rounded-full border border-red-500 bg-white flex items-center justify-center shadow-md">
                                <img
                                    src={
                                        sellerInfo?.avatarUrl ||
                                        `https://api.dicebear.com/7.x/initials/svg?seed=${sellerId}&size=64&backgroundColor=ffffff&textColor=00579D`
                                    }
                                    alt={sellerInfo?.fullName}
                                    className="w-10 h-10 sm:w-16 sm:h-16 object-cover rounded-full"
                                />
                            </div>
                            <div title={sellerInfo?.fullName || "Cửa hàng"} className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-sm shadow-sm whitespace-nowrap text-center max-w-[120px] truncate">
                                {sellerInfo?.fullName}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div>
                                <p className="text-xl font-semibold">
                                    {sellerInfo?.companyName || blindbox?.brand || "Cửa hàng"}
                                </p>
                            </div>
                            <div className='flex flex-row gap-2'>
                                <button
                                    onClick={() => handleOpenChat(sellerInfo?.userId || '')}
                                    className="flex items-center gap-2 bg-red-500 text-white px-2 md:px-4 py-2 rounded hover:bg-red-600 transition text-sm">
                                    <TbMessageDots className='text-xl' />
                                    Chat ngay
                                </button>
                                <button
                                    onClick={() => {
                                        if (sellerId) {
                                            setLoadingPage(true);
                                            router.push(`/shop/${sellerId}`);
                                        }
                                    }}
                                    disabled={!sellerId}
                                    className="flex gap-2 items-center border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <BsShop className='text-lg' />
                                    Xem Shop
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="w-full xl:w-px h-px xl:h-20 bg-gray-300" />
                    {/* <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 text-sm text-gray-600">
                            <div className='flex justify-between sm:justify-start sm:gap-4'>
                                <p>Đánh Giá</p>
                                <p className="text-red-600 font-semibold">
                                    {isSellerPending ? "..." : "219,3k"}
                                </p>
                            </div>
                            <div className='flex justify-between sm:justify-start sm:gap-4'>
                                <p>Tỉ Lệ Phản Hồi</p>
                                <p className="text-red-600 font-semibold">
                                    {isSellerPending ? "..." : "100%"}
                                </p>
                            </div>
                            <div className='flex justify-between sm:justify-start sm:gap-4'>
                                <p>Thời Gian Phản Hồi</p>
                                <p className="text-red-600 font-semibold">
                                    {isSellerPending ? "..." : "trong vài giờ"}
                                </p>
                            </div>
                            <div className='flex justify-between sm:justify-start sm:gap-4'>
                                <p>Tham Gia</p>
                                <p className="text-red-600 font-semibold">
                                    {isSellerPending ? "..." : "5 năm trước"}
                                </p>
                            </div>
                            <div className='flex justify-between sm:justify-start sm:gap-4'>
                                <p>Sản Phẩm</p>
                                <p className="text-red-600 font-semibold">
                                    {isSellerPending || isLoadingProducts ? "..." : totalProducts}
                                </p>
                            </div>
                            <div className='flex justify-between sm:justify-start sm:gap-4'>
                                <p>Người Theo Dõi</p>
                                <p className="text-red-600 font-semibold">
                                    {isSellerPending ? "..." : "2,1k"}
                                </p>
                            </div>
                        </div>
                    </div> */}
                    <div className="flex-1">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm sm:text-base text-gray-600">
                            <div className="flex justify-between sm:justify-start sm:gap-4">
                                <p>Đánh Giá</p>
                                <p className="text-red-600 font-semibold">{isSellerOverviewPending ? "..." : seller?.averageRating}</p>
                            </div>
                            <div className="flex justify-between sm:justify-start sm:gap-4">
                                <p>Tham Gia</p>
                                <p className="text-red-600 font-semibold">
                                    {isSellerOverviewPending
                                        ? "..."
                                        : seller?.joinedAt
                                            ? format(new Date(seller.joinedAt), "dd-MM-yyyy", { locale: vi })
                                            : "Chưa rõ"}
                                </p>
                            </div>
                            <div className="flex justify-between sm:justify-start sm:gap-4">
                                <p>Sản Phẩm</p>
                                <p className="text-red-600 font-semibold">{isSellerOverviewPending || isLoadingProducts ? "..." : seller?.productInSellingCount}</p>
                            </div>
                            <div className="flex justify-between sm:justify-start sm:gap-4">
                                <p>Blindbox</p>
                                <p className="text-red-600 font-semibold">{isSellerOverviewPending || isLoadingProducts ? "..." : seller?.blindBoxCount}</p>
                            </div>
                            <div className="flex justify-between sm:justify-start sm:gap-4">
                                <p>Công Ty</p>
                                <p className="text-red-600 font-semibold">{isSellerOverviewPending ? "..." : seller?.companyName}</p>
                            </div>
                            <div className="flex justify-between sm:justify-start sm:gap-4">
                                <p>Khu Vực</p>
                                <p className="text-red-600 font-semibold">{isSellerOverviewPending ? "..." : seller?.companyArea}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.7 }}
            >
                <div className="space-y-2">
                    <ul className="list-disc list-inside text-sm text-gray-700">
                        {blindbox?.items && (
                            <BlindboxItemSheet
                                open={isSheetOpen}
                                onClose={closeSheet}
                                items={blindbox.items.map(item => ({
                                    ...item,
                                    rarity: item.rarity as Rarity,
                                }))}
                            />
                        )}
                    </ul>
                </div>
            </motion.div>

            <motion.div
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.7 }}
                className='py-8'>
                <ProductTabs description={blindbox?.description || ""} />
            </motion.div>

            <motion.div
                variants={fadeIn("up", 0.4)}
                initial="hidden"
                animate="show"
                className='py-8'>
                <ProductReviews productId={blindBoxId} productType="blindbox" />
            </motion.div>

            {relatedBlindboxes.filter((box) => box.items?.length > 0).length > 0 && (
                <div className="mt-12">
                    <h3 className="text-2xl font-semibold mb-6">Sản phẩm liên quan</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedBlindboxes
                            .filter((box) => box.items?.length > 0)
                            .map((item) => {
                                const wishlistStatus = getItemWishlistStatus(item.id);
                                return (
                                    <BlindboxCard
                                        key={item.id}
                                        blindbox={item}
                                        ribbonTypes={getRibbonTypes(item)}
                                        onViewDetail={handleViewBlindboxDetail}
                                        initialIsInWishlist={wishlistStatus.isInWishlist}
                                        initialWishlistId={wishlistStatus.wishlistId}
                                        onWishlistChange={refreshWishlistStatus}
                                    />
                                );
                            })}
                    </div>
                </div>
            )}

            <Backdrop open={isPending || isAddingToCart || loadingPage} />
            {/* Chat Component */}
            {showChat && (
                <CustomerSellerChat
                    isOpen={showChat}
                    onClose={() => setShowChat(false)}
                    targetUserId={chatTargetUserId}
                />
            )}
        </div>
    );
}