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
import { ProductSortBy } from "@/const/products";
import Pagination from "@/components/pagination";
import { getRibbonTypes } from "@/utils/getRibbonTypes";

export default function AllNewProducts() {
    const [products, setProducts] = useState<TAllProductResponse>();
    const [blindboxes, setBlindboxes] = useState<BlindBoxListResponse>();
    const { getAllProductWebApi, isPending } = useGetAllProductWeb();
    const { getAllBlindBoxesApi, isPending: isPendingBlindbox } = useGetAllBlindBoxes();
    const [params, setParams] = useState<GetAllProducts>({
        pageIndex: 1,
        pageSize: 9999,
        search: "",
        productStatus: undefined,
        sellerId: "",
        categoryId: "",
        sortBy: ProductSortBy.CreatedAt,
        desc: true,
    });
    const [blindBoxParams] = useState<GetBlindBoxes>({
        pageIndex: 1,
        pageSize: 9999,
        search: "",
        SellerId: "",
        categoryId: "",
        status: "",
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

    const allItems = [
        ...(products?.result.filter((p) => p.productType !== "BlindBoxOnly") ?? []),
        ...(blindboxes?.result.filter((b) => b.items && b.items.length > 0) ?? []),
    ];

    const totalPages = Math.ceil(allItems.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const currentItems = allItems.slice(startIndex, startIndex + pageSize);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6 text-center mt-40">Tất cả sản phẩm mới</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentItems.map((item) => {
                    const ribbonTypes = getRibbonTypes(item);

                    return "productType" in item ? (
                        <ProductCard
                            key={item.id}
                            product={item}
                            ribbonTypes={ribbonTypes}
                            onViewDetail={(id) => router.push(`/detail/${id}`)}
                        />
                    ) : (
                        <BlindboxCard
                            key={item.id}
                            blindbox={item}
                            ribbonTypes={ribbonTypes}
                            onViewDetail={(id) => router.push(`/detail-blindbox/${id}`)}
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
            <Backdrop open={isPending || isPendingBlindbox} />
        </div>
    );
}
