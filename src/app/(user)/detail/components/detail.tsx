'use client'
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import type { Swiper as SwiperType } from 'swiper';
import { ProductTabs } from '@/components/tabs';
import { motion } from "framer-motion";
import { fadeIn } from '@/utils/variants';
import { AllProduct } from '@/services/product/typings';
import useGetProductByIdWeb from '../hooks/useGetProductByIdWeb';
import { Backdrop } from '@/components/backdrop';
import LightboxGallery from '@/components/lightbox-gallery';
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/style.css";
interface DetailProps {
    detailId: string;
}

export default function Detail({ detailId }: DetailProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [products, setProducts] = useState<AllProduct | null>(null);
    const { getProductByIdWebApi, isPending } = useGetProductByIdWeb();

    useEffect(() => {
        (async () => {
            const res = await getProductByIdWebApi(detailId);
            if (res) setProducts(res.value.data);
        })();
    }, [detailId]);

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

    const images = products?.imageUrls?.length ? products.imageUrls : [];

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
                        <Gallery>
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
                                        <Item original={img} thumbnail={img} width="1200" height="800">
                                            {({ ref, open }) => (
                                                <img
                                                    ref={ref}
                                                    onClick={open}
                                                    src={img}
                                                    alt={`Thumb ${idx}`}
                                                    className="w-full h-20 object-cover rounded-md cursor-pointer border-2 hover:border-black"
                                                />
                                            )}
                                        </Item>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </Gallery>
                    </div>
                </motion.div>

                <motion.div
                    variants={fadeIn("left", 0.3)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.7 }}
                    className='space-y-4'>
                    <h2 className="text-3xl font-bold font-paytone mb-4">{products?.name}</h2>
                    <div className='flex gap-8'>
                        <p className='text-xl'>Thương hiệu: <span className='text-[#00579D] uppercase'>{products?.brand}</span></p>
                        <div className="w-px h-5 bg-gray-300" />
                        <p>Tình trạng: <span className='text-[#00579D]'></span></p>
                    </div>
                    <p className="text-4xl font-semibold mt-2 text-[#EF1104]">{products?.price.toLocaleString("vi-VN")}₫</p>
                    <p className='text-xl'>Ngày phát hành: <span className='text-gray-600 text-xl'> {products?.createdAt
                        ? new Date(products.createdAt).toLocaleDateString("vi-VN")
                        : ""}</span></p>
                    <p className='text-xl'>Kích cỡ (cao): <span className='text-gray-600 text-xl'>{products?.height} cm</span></p>
                    <p className='text-xl'>Chất liệu: <span className='text-gray-600 text-xl'>{products?.material}</span></p>

                    {selectedVariant && (
                        <p className="text-sm text-gray-500">Đã chọn: <strong>{selectedVariant}</strong></p>
                    )}
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

            {/* <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4 mt-8">
                <div className="flex items-center gap-3">
                    <img
                        src={products?.seller?.avatar || "/default-avatar.png"}
                        alt="Seller Avatar"
                        className="w-12 h-12 rounded-full object-cover border"
                    />
                    <div>
                        <p className="font-semibold text-lg">{products?.seller?.name || "Người bán"}</p>
                        <p className="text-sm text-gray-500">{products?.seller?.email || ""}</p>
                    </div>
                </div>
                <button className="bg-[#00579D] text-white px-6 py-2 rounded hover:bg-[#003f6d] transition">
                    Chat ngay
                </button>
            </div> */}

            <motion.div
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.7 }}
                className='py-8'>
                <ProductTabs description={products?.description || ""} />
            </motion.div>
            <Backdrop open={isPending} />
        </div>
    );
}