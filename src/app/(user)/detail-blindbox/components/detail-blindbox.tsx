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
import { BlindBox, BlindBoxDetail } from '@/services/blindboxes/typings';
import { Backdrop } from '@/components/backdrop';
import { ProductTabs } from '@/components/tabs';
import { Rarity } from '@/const/products';
import { BlindboxItemSheet } from '@/components/thumbnail-blindbox';

interface BlindboxProps {
    blindBoxId: string;
}

export default function BlindboxDetail({ blindBoxId }: BlindboxProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [blindbox, setBlindbox] = useState<BlindBoxDetail | null>(null);
    const { getBlindboxByIdWebApi, isPending } = useGetBlindboxByIdWeb();

    const [isSheetOpen, setIsSheetOpen] = useState(false);

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



    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

    const images = [
        blindbox?.imageUrl || "/images/cart.webp",
        ...(blindbox?.items?.map(item => item.imageUrl) || []),
    ];

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
                                <img src={img} alt={`Image ${idx}`} className="w-full h-80 object-cover rounded-xl" />
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
                            <p className='text-xl'>Thương hiệu: <span className='text-[#00579D] uppercase'></span></p>
                            <div className="w-px h-5 bg-gray-300" />
                            <p className='text-xl'>Tình trạng: <span className='text-[#00579D]'></span></p>
                            <div className="w-px h-5 bg-gray-300" />
                        </div>
                        {blindbox?.hasSecretItem && (
                            <p className='text-xl'>Xác suất bí mật: <span className='text-[#EF1104]'>{blindbox.secretProbability}%</span></p>
                        )}
                    </div>
                    <p className="text-4xl font-semibold mt-2 text-[#EF1104]">
                        {blindbox?.price.toLocaleString("vi-VN")}₫
                    </p>
                    
                    <div className="mb-6">
                        <p className="mb-2">Chọn bộ:</p>
                        <div className="flex gap-4">
                            {["Loại A", "Loại B", "Loại C"].map((variant, idx) => (
                                <div
                                    key={idx}
                                    className="px-4 py-2 rounded-md border bg-white text-black border-gray-300 cursor-default"
                                >
                                    {variant}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-6">
                        <div className="flex items-center border border-gray-400 rounded-full overflow-hidden">
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
                                className="w-12 h-10 text-center border-t border-b border-gray-400"
                            />
                            <button
                                onClick={handleIncrease}
                                className="w-10 h-10 bg-[#252424] text-white text-xl flex items-center justify-center"
                            >
                                +
                            </button>
                        </div>

                        <button className="bg-[#252424] text-white px-6 py-2 rounded">
                            Thêm vào giỏ hàng
                        </button>
                    </div>
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

            <Backdrop open={isPending} />
        </div>
    );
}
