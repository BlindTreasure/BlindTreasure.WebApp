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
import { AllProduct, GetAllProducts, TAllProductResponse } from '@/services/product/typings';
import useGetProductByIdWeb from '../hooks/useGetProductByIdWeb';
import useAddProductToCart from "../hooks/useAddProductToCart"
import { Backdrop } from '@/components/backdrop';
import LightboxGallery from '@/components/lightbox-gallery';
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/style.css";
import { BlindboxStatus, StockStatus, stockStatusMap } from '@/const/products';
import useGetAllProductWeb from '../../allproduct/hooks/useGetAllProductWeb';
import ProductCard from '@/components/product-card';
import { getRibbonTypes } from '@/utils/getRibbonTypes';
import { useRouter } from 'next/navigation';
import useGetSellerById from "../hooks/useGetSellerById";
import { TbMessageDots } from "react-icons/tb";
import useGetAllBlindBoxes from '@/app/seller/allblindboxes/hooks/useGetAllBlindBoxes';
import { BlindBox, GetBlindBoxes } from '@/services/blindboxes/typings';
import { BsShop } from "react-icons/bs";

interface DetailProps {
    detailId: string;
}

export default function Detail({ detailId }: DetailProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [products, setProducts] = useState<AllProduct | null>(null);
    const { getProductByIdWebApi, isPending } = useGetProductByIdWeb();
    const [relatedProducts, setRelatedProducts] = useState<AllProduct[]>([]);
    const [loadingPage, setLoadingPage] = useState(false);
    const [sellerInfo, setSellerInfo] = useState<API.SellerById | null>(null);
    const [sellerProducts, setSellerProducts] = useState<AllProduct[]>([]);
    const [sellerBlindboxes, setSellerBlindboxes] = useState<BlindBox[]>([]);
    const router = useRouter();
    const { addProductToCartApi, isPending: isAddingToCart } = useAddProductToCart();
    const { getAllProductWebApi, isPending: isProduct } = useGetAllProductWeb();
    const { getPSellerByIdApi, isPending: isSellerPending } = useGetSellerById();
    const { getAllBlindBoxesApi, isPending: isBlindboxPending } = useGetAllBlindBoxes();

    const handleViewDetail = (id: string) => {
        setLoadingPage(true);
        router.push(`/detail/${id}`);
    };

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

    const [blindboxParams, setBlindboxParams] = useState<GetBlindBoxes>({
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

    useEffect(() => {
        (async () => {
            const res = await getProductByIdWebApi(detailId);
            if (res) {
                setProducts(res.value.data);
                if (res.value.data.sellerId) {
                    const sellerRes = await getPSellerByIdApi(res.value.data.sellerId);
                    if (sellerRes) {
                        setSellerInfo(sellerRes.value.data);
                    }

                    // Fetch all products from this seller
                    const sellerProductsRes = await getAllProductWebApi({
                        ...params,
                        sellerId: res.value.data.sellerId,
                        categoryId: "",
                    });
                    if (sellerProductsRes) {
                        setSellerProducts(sellerProductsRes.value.data.result);
                    }

                    // Fetch all blindboxes from this seller
                    const sellerBlindboxesRes = await getAllBlindBoxesApi({
                        ...blindboxParams,
                        SellerId: res.value.data.sellerId,
                        categoryId: "",
                    });
                    if (sellerBlindboxesRes) {
                        setSellerBlindboxes(sellerBlindboxesRes.value.data.result);
                    }
                }
            }
        })();
    }, [detailId]);

    useEffect(() => {
        if (!products) return;

        const fetchRelatedProducts = async () => {
            const res = await getAllProductWebApi({
                ...params,
                categoryId: products.categoryId,
                sellerId: "",
            });

            if (res) {
                const filtered = res.value.data.result
                    .filter(item => item.id !== products.id && item.brand === products.brand)
                    .slice(0, 4);

                setRelatedProducts(filtered);
            }
        };

        fetchRelatedProducts();
    }, [products]);



    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

    const handleAddToCart = async () => {
        if (!products) return;

        try {
            const cartItem = {
                productId: products.id,
                quantity: quantity,
                variant: selectedVariant,
            };

            const result = await addProductToCartApi(cartItem);

            if (result) {
                // Thành công - có thể hiển thị thông báo
                console.log('Đã thêm vào giỏ hàng thành công');
            }
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
            // Hiển thị thông báo lỗi
        }
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
                        <p className='text-xl'>Tình trạng: <span className='text-[#00579D]'>{stockStatusMap[products?.productStockStatus as StockStatus]}</span></p>
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
                            disabled={isAddingToCart || !products}
                            className="bg-[#252424] text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                </motion.div>
            </div>

            <motion.div
                variants={fadeIn("up", 0.4)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.7 }}
                className="bg-white rounded-lg p-6 mt-8 border shadow-sm"
            >
                <div className="flex items-center gap-6">
                    <div className="relative w-16 h-16">
                        <div className="w-16 h-16 rounded-full border border-red-500 bg-white flex items-center justify-center shadow-md">
                            <img
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${products?.sellerId}&size=64&backgroundColor=ffffff&textColor=00579D`}
                                alt={sellerInfo?.companyName || "Cửa hàng"}
                                className="w-10 h-10"
                            />
                        </div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-sm shadow-sm whitespace-nowrap max-w-[90px] text-center">
                            BlindTreasure
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div>
                            <p className="text-lg font-semibold">
                                {sellerInfo?.companyName || sellerInfo?.fullName || "Cửa hàng"}
                            </p>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm">
                                <TbMessageDots className='text-xl' />
                                Chat ngay
                            </button>
                            <button
                                onClick={() => {
                                    setLoadingPage(true);
                                    router.push(`/shop/${products?.sellerId}`);
                                }}
                                className="flex gap-2 items-center border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 transition text-sm"
                            >
                                <BsShop className='text-lg'/>
                                Xem Shop
                            </button>
                        </div>
                    </div>
                    <div className="w-px h-20 bg-gray-300" />
                    <div className="flex-1">
                        <div className="grid grid-cols-3 gap-x-4 gap-y-3 mt-4 text-sm text-gray-600">
                            <div className='flex gap-4'>
                                <p>Đánh Giá</p>
                                <p className="text-red-600 font-semibold">219,3k</p>
                            </div>
                            <div className='flex gap-4'>
                                <p>Tỉ Lệ Phản Hồi</p>
                                <p className="text-red-600 font-semibold">100%</p>
                            </div>
                            <div className='flex gap-4'>
                                <p>Thời Gian Phản Hồi</p>
                                <p className="text-red-600 font-semibold">trong vài giờ</p>
                            </div>
                            <div className='flex gap-4'>
                                <p>Tham Gia</p>
                                <p className="text-red-600 font-semibold">5 năm trước</p>
                            </div>
                            <div className='flex gap-4'>
                                <p>Sản Phẩm</p>
                                <p className="text-red-600 font-semibold">{sellerProducts.length + sellerBlindboxes.length}</p>
                            </div>
                            <div className='flex gap-4'>
                                <p>Người Theo Dõi</p>
                                <p className="text-red-600 font-semibold">228,6k</p>
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
                className='py-8'>
                <ProductTabs description={products?.description || ""} />
            </motion.div>

            {relatedProducts.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-2xl font-semibold mb-6">Sản phẩm liên quan</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((item) => (

                            <ProductCard
                                key={item.id}
                                product={item}
                                ribbonTypes={getRibbonTypes(item)}
                                onViewDetail={handleViewDetail}
                            />
                        ))}
                    </div>
                </div>
            )}
            <Backdrop open={isPending || isAddingToCart || loadingPage} />
        </div>
    );
}