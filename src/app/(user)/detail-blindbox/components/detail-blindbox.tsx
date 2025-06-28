'use client';

import React, { useEffect, useState } from 'react';
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
import { BlindBox, BlindBoxListResponse, GetBlindBoxes } from '@/services/blindboxes/typings';
import { Backdrop } from '@/components/backdrop';
import { ProductTabs } from '@/components/tabs';
import { BlindboxStatus, Rarity, StockStatus, stockStatusMap } from '@/const/products';
import { BlindboxItemSheet } from '@/components/thumbnail-blindbox';
import LightboxGallery from '@/components/lightbox-gallery';
import useGetAllBlindBoxes from '@/app/seller/allblindboxes/hooks/useGetAllBlindBoxes';
import { useRouter } from 'next/navigation';
import BlindboxCard from '@/components/blindbox-card';
import { getRibbonTypes } from '@/utils/getRibbonTypes';

interface BlindboxProps {
    blindBoxId: string;
}

export default function BlindboxDetail({ blindBoxId }: BlindboxProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [blindbox, setBlindbox] = useState<BlindBox | null>(null);
    const [relatedBlindboxes, setRelatedBlindboxes] = useState<BlindBox[]>([]);
    const { getBlindboxByIdWebApi, isPending } = useGetBlindboxByIdWeb();
    const { getAllBlindBoxesApi, isPending: isBlindBox } = useGetAllBlindBoxes()
    const { addBlindboxToCartApi, isPending: isAddingToCart } = useAddBlindboxToCart();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);
    const router = useRouter();

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
        pageSize: 5,
    })

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
            }
        })();
    }, [blindBoxId]);

    useEffect(() => {
        if (!blindbox) return;

        const fetchRelatedblindbox = async () => {
            const res = await getAllBlindBoxesApi({
                ...blindBoxParams,
                categoryId: blindbox.categoryId,
            });

            if (res) {
                const filtered = res.value.data.result
                    .filter(item => item.id !== blindbox.id && item.brand === blindbox.brand)
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
        setQuantity(quantity + 1);
    };

    const handleAddToCart = async () => {
        console.log('handleAddToCart clicked'); // Debug log
        console.log('blindbox:', blindbox); // Debug log
        console.log('blindbox.id:', blindbox?.id); // Debug log

        if (!blindbox) {
            console.log('No blindbox found');
            return;
        }

        if (!blindbox.id) {
            console.log('Blindbox ID not found');
            return;
        }

        try {
            const cartData = {
                blindBoxId: blindbox.id,
                quantity: quantity
            };

            console.log('Adding blindbox to cart with data:', cartData); // Debug log

            const result = await addBlindboxToCartApi(cartData);

            if (result) {
                console.log('Đã thêm blindbox vào giỏ hàng thành công');
                // Reset quantity nếu muốn
                // setQuantity(1);
            }
        } catch (error) {
            console.error('Lỗi khi thêm blindbox vào giỏ hàng:', error);
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
                            <p className='text-xl'>Tình trạng: <span className='text-[#00579D]'>{stockStatusMap[blindbox?.blindBoxStockStatus as StockStatus]}</span></p>
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

                    {/* <div className="mb-6">
                        <p className="mb-2 text-xl">Chọn bộ:</p>
                        <div className="flex gap-4">
                            {["Loại A", "Loại B", "Loại C"].map((variant, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleVariantSelect(variant)}
                                    className={`px-4 py-2 rounded-md border cursor-pointer transition-colors ${selectedVariant === variant
                                        ? 'bg-[#252424] text-white border-[#252424]'
                                        : 'bg-white text-black border-gray-300 hover:border-gray-400'
                                        }`}
                                >
                                    {variant}
                                </div>
                            ))}
                        </div>
                        {selectedVariant && (
                            <p className="text-sm text-gray-500 mt-2">Đã chọn: <strong>{selectedVariant}</strong></p>
                        )}
                    </div> */}

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
                                    type="text"
                                    value={quantity}
                                    readOnly
                                    className="w-12 h-10 text-center border-t border-b border-gray-400"
                                />
                                <button
                                    onClick={handleIncrease}
                                    className="w-10 h-10 bg-[#252424] text-white text-xl flex items-center justify-center hover:bg-gray-700 transition-colors"
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
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.7 }}
                className='py-8'
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

            {relatedBlindboxes.filter((box) => box.items?.length > 0).length > 0 && (
                <div className="mt-12">
                    <h3 className="text-2xl font-semibold mb-6">Sản phẩm liên quan</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedBlindboxes
                            .filter((box) => box.items?.length > 0)
                            .map((item) => (
                                <BlindboxCard
                                    key={item.id}
                                    blindbox={item}
                                    ribbonTypes={getRibbonTypes(item)}
                                    onViewDetail={handleViewBlindboxDetail}
                                />
                            ))}
                    </div>
                </div>
            )}

            <Backdrop open={isPending || isAddingToCart || loadingPage} />
        </div>
    );
}