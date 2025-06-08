'use client'
import { useState, useEffect } from "react";
import PaginationBar from "@/components/pagination";
import ProductFilterSidebar from "@/components/product-filter-sidebar";
import ProductCard from "@/components/product-card";
import useGetAllProductWeb from "../hooks/useGetAllProductWeb";
import { GetAllProducts, TAllProductResponse } from "@/services/product/typings";
import { ProductStatus } from "@/const/products";
import Pagination from "@/components/tables/Pagination";
import useGetCategory from "@/app/staff/category-management/hooks/useGetCategory";
import { Backdrop } from "@/components/backdrop";
import { useRouter } from "next/navigation";

export default function AllProduct() {

  const prices = [
    "Dưới 200.000₫",
    "200.000 - 500.000₫",
    "500.000 - 1.000.000₫",
    "1.000.000 - 2.000.000₫",
    "2.000.000 - 4.000.000₫",
    "Trên 4.000.000₫",
  ];

  const brands = ["44 Cats", "Avengers", "Dragon", "Batman", "Tobot"];

  const [products, setProducts] = useState<TAllProductResponse>()
  const { getAllProductWebApi, isPending } = useGetAllProductWeb()
  const [categories, setCategories] = useState<API.ResponseDataCategory>();
  const { getCategoryApi } = useGetCategory();
  const router = useRouter();

  const [params, setParams] = useState<GetAllProducts>({
    pageIndex: 1,
    pageSize: 5,
    search: "",
    productStatus: undefined,
    sellerId: "",
    categoryId: "",
    sortBy: undefined,
    desc: undefined,
  })

  useEffect(() => {
    (async () => {
      const res = await getAllProductWebApi(params)
      if (res) setProducts(res.value.data)

      const catRes = await getCategoryApi({});
      if (catRes) setCategories(catRes.value.data || []);
    })()
  }, [params])

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > (products?.totalPages || 1)) return
    setParams((prev) => ({ ...prev, pageIndex: newPage }))
  }

  const handleViewDetail = (id: string) => {
    router.push(`/detail/${id}`);
  };

  return (
    <div className="mt-16 container mx-auto px-4 sm:px-6 lg:p-20 xl:px-20 2xl:px-20">
      <div className="flex flex-col lg:flex-row gap-6">

        <div className="w-full lg:w-auto lg:shrink-0">
          <ProductFilterSidebar categories={categories} prices={prices} brands={brands} />
        </div>

        <main className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {products?.result.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetail={handleViewDetail}
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
      <Backdrop open={isPending} />
    </div>
  );
}