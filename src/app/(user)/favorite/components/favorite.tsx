'use client'
import ProductCard from "@/components/product-card";
import PaginationBar from "@/components/pagination";
import { useEffect, useState } from "react";
import { GetAllProducts, TAllProductResponse } from "@/services/product/typings";
import useGetAllProductWeb from "../../allproduct/hooks/useGetAllProductWeb";
import { ProductStatus } from "@/const/products";

interface Blindbox {
    id: number;
    type: "blindbox" | "normal";
    tags?: ("sale" | "new")[];
    percent?: number;
    title: string;
    price: number;
}

export default function Favorite() {
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
    ];

    const [products, setProducts] = useState<TAllProductResponse>()
    const { getAllProductWebApi, isPending } = useGetAllProductWeb()

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

    return (
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-8 mt-20">
            <h2 className="text-2xl font-semibold text-center mb-8">Sản Phẩm Yêu Thích</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products?.result.map((product) => (
                    <ProductCard
                        // id={product.id}
                        // key={product.id}
                        // type={product.type}
                        // percent={product.percent}
                        // title={product.title}
                        // price={product.price.toLocaleString() + "₫"}
                        key={product.id}
                        product={product}
                       
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