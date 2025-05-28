'use client'
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';
import type { Swiper as SwiperType } from 'swiper';
import { ProductTabs } from '@/components/tabs';
import ProductCard from '@/components/product-card';
import { motion } from "framer-motion";
import { fadeIn } from '@/utils/variants';

interface DetailProps {
    detailId: string;
}

interface Blindbox {
    id: number;
    type: "blindbox" | "normal";
    tags?: ("sale" | "new")[];
    title: string;
    price: number;
    percent?: number;
    brand?: string;
    status?: string;
    material?: string[];
    packaging?: string;
    variants?: { name: string; quantity?: number }[];
    images?: string[];
}

export default function Detail({ detailId }: DetailProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const blindboxes: Blindbox[] = [
        { id: 1, type: "normal", tags: ["sale"], percent: 30, title: "Hello", price: 5420000 },
        { id: 2, type: "normal", tags: ["sale"], percent: 50, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
        { id: 3, type: "normal", tags: ["sale"], percent: 40, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
        { id: 4, type: "normal", tags: ["sale"], percent: 10, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
        { id: 5, type: "normal", tags: ["sale"], percent: 20, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
        { id: 6, type: "normal", tags: ["new"], title: "MEGA SPACE MOLLY 400...", price: 5420000, percent: 20 },
        { id: 7, type: "normal", tags: ["new"], title: "MEGA SPACE MOLLY 400...", price: 5420000, percent: 20 },
        { id: 8, type: "normal", tags: ["new"], title: "MEGA SPACE MOLLY 400...", price: 5420000, percent: 20 },
        { id: 9, type: "normal", tags: ["new"], title: "MEGA SPACE MOLLY 400...", price: 5420000, percent: 20 },
        { id: 10, type: "normal", tags: ["new"], title: "MEGA SPACE MOLLY 400...", price: 5420000, percent: 20 },
        { id: 11, type: "normal", tags: ["new"], title: "MEGA SPACE MOLLY 400...", price: 5420000, percent: 20 },
        { id: 12, type: "normal", tags: ["sale"], percent: 20, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
        {
            id: 13,
            type: "blindbox",
            title: "DODO Nami Twinkle Bunny Plush Doll Blindbox Series",
            price: 280000,
            brand: "DODO SUGAR",
            status: "Còn hàng",
            material: ["Plastic", "Textile", "Cotton", "Polyester"],
            packaging: "Hộp màu ngẫu nhiên. 6 Blindbox/1 SET",
            variants: [
                { name: "1 BLINDBOX" },
                { name: "SET 6 BLINDBOX" }
            ],
            images: [
                "/images/blindbox_4.webp",
                "/images/3.png",
                "/images/4.png",
                "/images/4.png",
                "/images/4.png",
                "/images/4.png",
            ]

        },

        { id: 14, type: "blindbox", percent: 0, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
        { id: 15, type: "blindbox", title: "MEGA SPACE MOLLY 400...", price: 5420000 },
        { id: 16, type: "blindbox", percent: 20, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
        { id: 17, type: "blindbox", tags: ["sale"], percent: 20, title: "MEGA SPACE MOLLY 400...", price: 5420000 },
        { id: 18, type: "blindbox", tags: ["new"], title: "MEGA SPACE MOLLY 400...", price: 5420000 },
    ];

    const product = blindboxes.find((b) => b.id === parseInt(detailId));

    if (!product) {
        return <p className="text-center mt-32">Không tìm thấy sản phẩm.</p>;
    }

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

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
                        {product.images?.map((img, idx) => (
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
                            {product.images?.map((img, idx) => (
                                <SwiperSlide key={`thumb-${idx}`}>
                                    <img
                                        src={img}
                                        alt={`Thumb ${idx}`}
                                        className="w-full h-20 object-cover rounded-md cursor-pointer border-2 hover:border-black"
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
                    className='space-y-4'>
                    <h2 className="text-3xl font-bold font-paytone mb-4">{product.title}</h2>
                    <div className='flex gap-8'>
                        <p>Thương hiệu: <span className='text-[#00579D] uppercase'>{product.brand}</span></p>
                        <p>Tình trạng: <span className='text-[#00579D]'>{product.status}</span></p>
                    </div>
                    <p className="text-4xl font-semibold mt-2 text-[#EF1104]">{product.price.toLocaleString("vi-VN")}₫</p>
                    <p><span className="mb-2 font-semibold">Chất liệu:</span> Nhựa</p>
                    {product.packaging && <p><span className="mb-2 font-semibold">Đóng gói:</span> {product.packaging}</p>}
                    <div className="mb-6">
                        <p className="mb-2 font-semibold">Chọn loại:</p>
                        <div className="flex gap-4">
                            {product.variants?.map((variant, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedVariant(variant.name)}
                                    className={`px-4 py-2 rounded-md border transition 
                    ${selectedVariant === variant.name
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white text-black border-gray-300 hover:border-black'}`}
                                >
                                    {variant.name}
                                </button>
                            ))}
                        </div>
                    </div>
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

            <motion.div
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.7 }}
                className='py-8'>
                <ProductTabs />
            </motion.div>

            <motion.h1 variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.7 }}
                className='text-3xl font-semibold font-anton'>Sản phẩm liên quan
            </motion.h1>

            <motion.div
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                {blindboxes
                    .filter(item =>
                        item.id !== product.id && item.type === product.type
                    )
                    .slice(0, 5)
                    .map(item => (
                        <ProductCard
                            key={item.id}
                            id={item.id}
                            type={item.type}
                            tags={item.tags}
                            percent={item.percent}
                            image={item.images?.[0]}
                            title={item.title}
                            price={item.price.toLocaleString("vi-VN") + "₫"}
                        />
                    ))
                }
            </motion.div>
        </div>
    );
}
