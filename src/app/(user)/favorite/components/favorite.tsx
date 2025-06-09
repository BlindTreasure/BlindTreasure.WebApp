'use client'
import ProductCard from "@/components/product-card";
import PaginationBar from "@/components/pagination";
import { useEffect, useState } from "react";
import { GetAllProducts, TAllProductResponse } from "@/services/product/typings";
import useGetAllProductWeb from "../../allproduct/hooks/useGetAllProductWeb";
import { ProductStatus } from "@/const/products";
import { useRouter } from "next/navigation";

export default function Favorite() {
    const [products, setProducts] = useState<TAllProductResponse>()
    const { getAllProductWebApi, isPending } = useGetAllProductWeb()
    const router = useRouter();

    const [params, setParams] = useState<GetAllProducts>({
        pageIndex: 1,
        pageSize: 5,
        search: "",
        productStatus: ProductStatus.Active,
        sellerId: "",
        categoryId: "",
        sortBy: undefined,
        desc: undefined,
    })

    useEffect(() => {
        (async () => {
            const res = await getAllProductWebApi(params)
            if (res) setProducts(res.value.data)
        })()
    }, [params])

    const handleViewDetail = (id: string) => {
        router.push(`/detail/${id}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-8 mt-20">
            <h2 className="text-2xl font-semibold text-center mb-8">Sản Phẩm Yêu Thích</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products?.result.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onViewDetail={handleViewDetail}
                    />
                ))}
            </div>
            <div className="mt-8">
                <PaginationBar
                    currentPage={1}
                    totalPages={1}
                    onPageChange={() => { }}
                />
            </div>
        </div>

    )
}