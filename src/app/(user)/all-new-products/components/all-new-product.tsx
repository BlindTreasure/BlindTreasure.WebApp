"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/product-card";
import BlindboxCard from "@/components/blindbox-card";
import { TAllProductResponse, GetAllProducts } from "@/services/product/typings";
import { BlindBoxListResponse, GetBlindBoxes } from "@/services/blindboxes/typings";
import { Backdrop } from "@/components/backdrop";
import { useRouter } from "next/navigation";
import useGetAllProductWeb from "../../allproduct/hooks/useGetAllProductWeb";
import useGetAllBlindBoxes from "@/app/seller/allblindboxes/hooks/useGetAllBlindBoxes";
import { BlindboxStatus, ProductSortBy } from "@/const/products";
import Pagination from "@/components/pagination";
import { getRibbonTypes } from "@/utils/getRibbonTypes";

export default function AllNewProducts() {
    const [products, setProducts] = useState<TAllProductResponse>();
    const [blindboxes, setBlindboxes] = useState<BlindBoxListResponse>();
    const { getAllProductWebApi, isPending } = useGetAllProductWeb();
    const { getAllBlindBoxesApi, isPending: isPendingBlindbox } = useGetAllBlindBoxes();
    const [loadingPage, setLoadingPage] = useState(false);
    const [params] = useState<GetAllProducts>({
        pageIndex: 1,
        pageSize: 40,
        search: "",
        productStatus: undefined,
        sellerId: "",
        categoryId: "",
        sortBy: ProductSortBy.CreatedAt,
        desc: true,
    });
    const [blindBoxParams] = useState<GetBlindBoxes>({
        pageIndex: 1,
        pageSize: 40,
        search: "",
        SellerId: "",
        categoryId: "",
        status: BlindboxStatus.Approved,
        minPrice: undefined,
        maxPrice: undefined,
        ReleaseDateFrom: "",
        ReleaseDateTo: "",
        HasItem: undefined,
    });
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    useEffect(() => {
        (async () => {
            const res = await getAllProductWebApi(params);
            if (res) setProducts(res.value.data);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const res = await getAllBlindBoxesApi(blindBoxParams);
            if (res) setBlindboxes(res.value.data);
        })();
    }, []);

    const now = new Date();
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(now.getDate() - 14);

    const filteredProducts = products?.result.filter((p) => {
        const createdProduct = new Date(p.createdAt);
        return p.productType !== "BlindBoxOnly" && createdProduct >= fourteenDaysAgo;
    });

    const filteredBlindboxes = blindboxes?.result.filter((b) => {
        const createdBlindbox = new Date(b.createdAt);
        return b.items && b.items.length > 0 && createdBlindbox >= fourteenDaysAgo;
    });

    const allItems = [
        ...(filteredProducts ?? []),
        ...(filteredBlindboxes ?? []),
    ];

    const totalPages = Math.ceil(allItems.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const currentItems = allItems.slice(startIndex, startIndex + pageSize);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    const handleViewBlindboxDetail = (id: string) => {
        setLoadingPage(true);
        router.push(`/detail-blindbox/${id}`);
    };

    const handleViewDetail = (id: string) => {
    setLoadingPage(true);
    router.push(`/detail/${id}`);
  };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6 text-center mt-40">
                Tất cả sản phẩm mới
            </h1>
            <div className="text-center text-gray-500 text-sm mb-4">
                Đang hiển thị {allItems.length} sản phẩm được tạo trong 14 ngày gần đây.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentItems.map((item) => {
                    const ribbonTypes = getRibbonTypes(item);
                    return "productType" in item ? (
                        <ProductCard
                            key={item.id}
                            product={item}
                            ribbonTypes={ribbonTypes}
                            onViewDetail={handleViewDetail}
                        />
                    ) : (
                        <BlindboxCard
                            key={item.id}
                            blindbox={item}
                            ribbonTypes={ribbonTypes}
                            onViewDetail={handleViewBlindboxDetail}
                        />
                    );
                })}
            </div>
            <div className="mt-8 flex justify-center">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
            <Backdrop open={isPending || isPendingBlindbox || loadingPage} />
        </div>
    );
}
