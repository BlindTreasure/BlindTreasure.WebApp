'use client';

import { useState, useEffect, useRef } from "react"; 
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/variants";
import ProductCard from "@/components/product-card";
import BlindboxCard from "@/components/blindbox-card";
import { GetAllProducts, AllProduct } from "@/services/product/typings";
import { BlindBox, GetBlindBoxes } from "@/services/blindboxes/typings";
import useGetAllProductWeb from "../../allproduct/hooks/useGetAllProductWeb";
import useGetAllBlindBoxes from "@/app/seller/allblindboxes/hooks/useGetAllBlindBoxes";
import { Backdrop } from "@/components/backdrop";
import { ProductSortBy, BlindboxStatus } from "@/const/products";
import Pagination from "@/components/pagination";
import { TbMessageDots } from "react-icons/tb";
import useGetSellerById from "../../detail/hooks/useGetSellerById";
import { useWishlistContext } from "@/contexts/WishlistContext";
import useGetOverviewSeller from "../hooks/useOverviewSeller";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import ShopSidebar from "./shop-sidebar";

interface ShopProductsProps {
    sellerId: string;
}

export default function ShopProducts({ sellerId }: ShopProductsProps) {
    const [products, setProducts] = useState<AllProduct[]>([]);
    const [blindboxes, setBlindboxes] = useState<BlindBox[]>([]);
    const [combinedData, setCombinedData] = useState<
        Array<{ type: 'product' | 'blindbox'; data: AllProduct | BlindBox; createdAt: string }>
    >([]);
    const [loading, setLoading] = useState(true);
    const [loadingPage, setLoadingPage] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterType, setFilterType] = useState<'all' | 'product' | 'blindbox'>('all');

    const [sellerInfo, setSellerInfo] = useState<API.SellerById | null>(null);
    const { getOverViewSellerApi, isPending: isSellerOverviewPending } = useGetOverviewSeller();
    const [seller, setSeller] = useState<API.SellerInfo | null>(null);

    const router = useRouter();
    const { getAllProductWebApi, isPending } = useGetAllProductWeb();
    const { getAllBlindBoxesApi, isPending: isBlindboxPending } = useGetAllBlindBoxes();
    const { getPSellerByIdApi } = useGetSellerById();
    const { getItemWishlistStatus, refreshWishlistStatus } = useWishlistContext();
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);

    const isInitialMount = useRef(true);

    const productParams: GetAllProducts = {
        pageIndex: 1,
        pageSize: 50,
        search: "",
        productStatus: undefined,
        sellerId: sellerId,
        categoryId: "",
        sortBy: ProductSortBy.CreatedAt,
        desc: true,
        minPrice: minPrice ?? undefined,
        maxPrice: maxPrice ?? undefined,
    };

    const blindboxParams: GetBlindBoxes = {
        pageIndex: 1,
        pageSize: 50,
        search: "",
        SellerId: sellerId,
        categoryId: "",
        status: BlindboxStatus.Approved,
        minPrice: minPrice ?? undefined,
        maxPrice: maxPrice ?? undefined,
        ReleaseDateFrom: "",
        ReleaseDateTo: "",
        HasItem: undefined,
    };

    const handleViewDetail = (id: string) => {
        setLoadingPage(true);
        router.push(`/detail/${id}`);
    };

    const handleViewBlindboxDetail = (id: string) => {
        setLoadingPage(true);
        router.push(`/detail-blindbox/${id}`);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const sellerRes = await getPSellerByIdApi(sellerId);
            if (sellerRes) {
                setSellerInfo(sellerRes.value.data);
            }

            const productRes = await getAllProductWebApi(productParams);
            const blindboxRes = await getAllBlindBoxesApi(blindboxParams);

            let allProducts: AllProduct[] = [];
            let allBlindboxes: BlindBox[] = [];

            if (productRes?.value?.data) {
                allProducts = productRes.value.data.result;
                setProducts(allProducts);
            }

            if (blindboxRes?.value?.data) {
                allBlindboxes = blindboxRes.value.data.result;
                setBlindboxes(allBlindboxes);
            }

            const combined = [
                ...allProducts.map(product => ({
                    type: 'product' as const,
                    data: product,
                    createdAt: product.createdAt,
                })),
                ...allBlindboxes.map(blindbox => ({
                    type: 'blindbox' as const,
                    data: blindbox,
                    createdAt: blindbox.createdAt,
                })),
            ];

            combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setCombinedData(combined);
        } catch (error) {
            console.error("Error fetching shop data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sellerId) {
            fetchData();
        }
    }, [sellerId]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            fetchData();
        }
    }, [minPrice, maxPrice]);

    useEffect(() => {
        const fetchSeller = async () => {
            const res = await getOverViewSellerApi(sellerId);
            if (res) {
                setSeller(res.value.data);
            }
        };
        fetchSeller();
    }, [sellerId]);

    if (isSellerOverviewPending) {
        return <p>Đang tải...</p>;
    }

    if (!seller) {
        return <p>Không tìm thấy thông tin shop</p>;
    }

    const filteredData = combinedData.filter(item => {
        if (filterType === 'all') return true;
        return item.type === filterType;
    });

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / 12);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8 py-12 sm:py-16 mt-36 sm:mt-40 max-w-7xl">
            {sellerInfo && (
                <motion.div
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.7 }}
                    className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border shadow-sm"
                >
                    <div className="flex flex-col xl:flex-row xl:items-center gap-6">
                        <div className="flex items-center gap-4 sm:gap-8">
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                                <div className="w-full h-full rounded-full border border-red-500 bg-white flex items-center justify-center shadow-md">
                                    <img
                                        src={
                                            sellerInfo?.avatarUrl ||
                                            `https://api.dicebear.com/7.x/initials/svg?seed=${sellerId}&size=64&backgroundColor=ffffff&textColor=00579D`
                                        }
                                        alt={sellerInfo?.fullName || "Cửa hàng"}
                                        className="w-10 h-10 sm:w-16 sm:h-16 object-cover rounded-full"
                                    />
                                </div>
                                <div
                                    title={sellerInfo?.fullName || "Cửa hàng"}
                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-red-500 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-sm shadow-sm whitespace-nowrap text-center max-w-[120px] truncate"
                                >
                                    {sellerInfo.fullName}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 flex-1">
                                <p className="text-lg sm:text-xl font-semibold">
                                    {sellerInfo?.companyName || sellerInfo?.fullName || "Cửa hàng"}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <button className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm sm:text-base">
                                        <TbMessageDots className="text-lg sm:text-xl" />
                                        Chat ngay
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="w-full xl:w-px h-px xl:h-20 bg-gray-300" />
                        <div className="flex-1">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm sm:text-base text-gray-600">
                                <div className="flex justify-between sm:justify-start sm:gap-4">
                                    <p>Đánh Giá</p>
                                    <p className="text-red-600 font-semibold">{seller.averageRating}</p>
                                </div>
                                <div className="flex justify-between sm:justify-start sm:gap-4">
                                    <p>Tham Gia</p>
                                    <p className="text-red-600 font-semibold">
                                        {seller.joinedAt
                                            ? `${format(new Date(seller.joinedAt), "dd-MM-yyyy", { locale: vi })}`
                                            : "Chưa rõ"}
                                    </p>
                                </div>
                                <div className="flex justify-between sm:justify-start sm:gap-4">
                                    <p>Sản Phẩm</p>
                                    <p className="text-red-600 font-semibold">{seller.productInSellingCount}</p>
                                </div>
                                <div className="flex justify-between sm:justify-start sm:gap-4">
                                    <p>Blindbox</p>
                                    <p className="text-red-600 font-semibold">{seller.blindBoxCount}</p>
                                </div>
                                <div className="flex justify-between sm:justify-start sm:gap-4">
                                    <p>Công Ty</p>
                                    <p className="text-red-600 font-semibold">{seller.companyName}</p>
                                </div>
                                <div className="flex justify-between sm:justify-start sm:gap-4">
                                    <p>Khu Vực</p>
                                    <p className="text-red-600 font-semibold">{seller.companyArea}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <ShopSidebar
                        filterType={filterType}
                        setFilterType={setFilterType}
                        minPrice={minPrice}
                        setMinPrice={setMinPrice}
                        maxPrice={maxPrice}
                        setMaxPrice={setMaxPrice}
                        setCurrentPage={setCurrentPage}
                    />
                </div>

                <div className="lg:col-span-3">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {Array.from({ length: 9 }).map((_, index) => (
                                <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
                            ))}
                        </div>
                    ) : filteredData.length > 0 ? (
                        <>
                            <motion.div
                                variants={fadeIn("up", 0.3)}
                                initial="hidden"
                                animate="show"
                                viewport={{ once: true, amount: 0.7 }}
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                            >
                                {filteredData
                                    .slice((currentPage - 1) * 12, currentPage * 12)
                                    .map((item, index) => {
                                        const wishlistStatus = getItemWishlistStatus(item.data.id);
                                        return item.type === "product" ? (
                                            <ProductCard
                                                key={`product-${item.data.id}-${index}`}
                                                product={item.data as AllProduct}
                                                onViewDetail={handleViewDetail}
                                                initialIsInWishlist={wishlistStatus.isInWishlist}
                                                initialWishlistId={wishlistStatus.wishlistId}
                                                onWishlistChange={refreshWishlistStatus}
                                            />
                                        ) : (
                                            <BlindboxCard
                                                key={`blindbox-${item.data.id}-${index}`}
                                                blindbox={item.data as BlindBox}
                                                onViewDetail={handleViewBlindboxDetail}
                                                initialIsInWishlist={wishlistStatus.isInWishlist}
                                                initialWishlistId={wishlistStatus.wishlistId}
                                                onWishlistChange={refreshWishlistStatus}
                                            />
                                        );
                                    })}
                            </motion.div>
                            {filteredData.length > 0 && totalPages > 1 && (
                                <div className="mt-8 flex justify-center">
                                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                                </div>
                            )}
                        </>
                    ) : (
                        <motion.div
                            variants={fadeIn("up", 0.3)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.7 }}
                            className="text-center py-12 px-4 col-span-full"
                        >
                            <img
                                src="https://cdn.dribbble.com/userupload/22371020/file/original-60ef65aa2fcef20be701e31843633b63.jpg?resize=752x&vertical=center"
                                alt="Không có sản phẩm"
                                className="mx-auto mb-4 w-56 h-56 object-cover"
                            />
                            <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm phù hợp</p>
                        </motion.div>
                    )}
                </div>
            </div>

            <Backdrop open={isPending || isBlindboxPending || loadingPage} />
        </div>
    );
}
