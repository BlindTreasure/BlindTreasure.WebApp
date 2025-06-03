'use client'
import { useState, useEffect } from "react";
import PaginationBar from "@/components/pagination";
import ProductFilterSidebar from "@/components/product-filter-sidebar";
import ProductCard from "@/components/product-card";
import useGetAllProductWeb from "../hooks/useGetAllProductWeb";
import { GetAllProducts, TAllProductResponse } from "@/services/product/typings";
import { ProductStatus } from "@/const/products";
import Pagination from "@/components/tables/Pagination";

interface Blindbox {
  id: number;
  type: "blindbox" | "normal";
  tags?: ("sale" | "new")[];
  percent?: number;
  title: string;
  price: number;
}

export default function AllProduct() {
  // const [isMounted, setIsMounted] = useState(false);

  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

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

  const categories = [
    { name: "Tất cả sản phẩm" },
    {
      name: "Series túi mù",
      subCategories: ["Molly", "Labubu", "Skullpanda"]
    },
    {
      name: "Gấu bông",
      subCategories: ["Gấu nhỏ", "Gấu ôm", "Gấu đặc biệt"]
    },
    { name: "Baby three" },
    { name: "Hộp hiển thị" }
  ];

  const prices = [
    "Dưới 200.000₫",
    "200.000 - 500.000₫",
    "500.000 - 1.000.000₫",
    "1.000.000 - 2.000.000₫",
    "2.000.000 - 4.000.000₫",
    "Trên 4.000.000₫",
  ];

  const brands = ["44 Cats", "Avengers", "Dragon", "Batman", "Tobot"];

  // if (!isMounted) {
  //   return null;
  // }

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

  const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > (products?.totalPages || 1)) return
        setParams((prev) => ({ ...prev, pageIndex: newPage }))
  }

  return (
    <div className="mt-16 container mx-auto px-4 sm:px-6 lg:p-20 xl:px-20 2xl:px-20">
      <div className="flex flex-col lg:flex-row gap-6">

        <div className="w-full lg:w-auto lg:shrink-0">
          <ProductFilterSidebar categories={categories} prices={prices} brands={brands} />
        </div>

        {/* Main content area */}
        <main className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
                type="normal"
                tags={["sale"]}
                percent={10}
              />
            ))}
          </div>

          <div className="mt-8">
            <Pagination
              currentPage={params.pageIndex ?? 1}
              totalPages={products?.totalPages ?? 1}
              onPageChange={handlePageChange}
            />
          </div>
        </main>
      </div>
    </div>
  );
}