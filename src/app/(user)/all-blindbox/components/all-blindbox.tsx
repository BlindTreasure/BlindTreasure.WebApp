"use client";
import { useEffect, useState } from "react";
import BlindboxCard from "@/components/blindbox-card";
import { BlindBoxListResponse, GetBlindBoxes } from "@/services/blindboxes/typings";
import { Backdrop } from "@/components/backdrop";
import { useRouter } from "next/navigation";
import useGetAllBlindBoxes from "@/app/seller/allblindboxes/hooks/useGetAllBlindBoxes";
import Pagination from "@/components/pagination";
import ProductFilterSidebar from "@/components/product-filter-sidebar";
import useGetCategory from "@/app/staff/category-management/hooks/useGetCategory";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { 
  setCategoryId, 
  setMinPrice, 
  setMaxPrice, 
  setReleaseDateFrom,
  setReleaseDateTo,
  clearFilters 
} from "@/stores/filter-product-slice";
import { BlindboxStatus } from "@/const/products";

export default function AllBlindBoxes() {
  // Redux state and dispatch
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.filterSlice);

  const prices = [
    "Dưới 200.000₫",
    "200.000 - 500.000₫", 
    "500.000 - 1.000.000₫",
    "1.000.000 - 2.000.000₫",
    "2.000.000 - 4.000.000₫",
    "Trên 4.000.000₫",
  ];

  const releaseDateRanges = [
    "1 tháng qua",
    "3 tháng qua", 
    "6 tháng qua",
    "1 năm qua",
    "Trên 1 năm",
  ];

  const [blindboxes, setBlindboxes] = useState<BlindBoxListResponse>();
  const [categories, setCategories] = useState<API.ResponseDataCategory>();
  const { getAllBlindBoxesApi, isPending: isPendingBlindbox } = useGetAllBlindBoxes();
  const { getCategoryApi } = useGetCategory();
  const router = useRouter();

  const [blindBoxParams, setBlindBoxParams] = useState<GetBlindBoxes>({
    pageIndex: 1,
    pageSize: 8,
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

  // Convert Redux filters to API params
  const buildApiParams = (): GetBlindBoxes => {
    return {
      ...blindBoxParams,
      categoryId: filters.categoryId || "",
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      ReleaseDateFrom: filters.releaseDateFrom || "",
      ReleaseDateTo: filters.releaseDateTo || "",
    };
  };

  useEffect(() => {
    (async () => {
      const apiParams = buildApiParams();
      const res = await getAllBlindBoxesApi(apiParams);
      if (res) setBlindboxes(res.value.data);

      // Only fetch categories once
      if (!categories) {
        const catRes = await getCategoryApi({});
        if (catRes) setCategories(catRes.value.data || []);
      }
    })();
  }, [blindBoxParams, filters]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > (blindboxes?.totalPages || 1)) return;
    setBlindBoxParams((prev) => ({ ...prev, pageIndex: newPage }));
  };

  // Filter handlers using Redux dispatch
  const handleCategoryFilter = (categoryId: string) => {
    dispatch(setCategoryId(categoryId));
    // Reset to page 1 when filter changes
    setBlindBoxParams(prev => ({ ...prev, pageIndex: 1 }));
  };

  const handlePriceFilter = (priceRange: string) => {
    let minPrice: number | undefined = undefined;
    let maxPrice: number | undefined = undefined;

    switch (priceRange) {
      case "Dưới 200.000₫":
        maxPrice = 200000;
        break;
      case "200.000 - 500.000₫":
        minPrice = 200000;
        maxPrice = 500000;
        break;
      case "500.000 - 1.000.000₫":
        minPrice = 500000;
        maxPrice = 1000000;
        break;
      case "1.000.000 - 2.000.000₫":
        minPrice = 1000000;
        maxPrice = 2000000;
        break;
      case "2.000.000 - 4.000.000₫":
        minPrice = 2000000;
        maxPrice = 4000000;
        break;
      case "Trên 4.000.000₫":
        minPrice = 4000000;
        break;
    }

    dispatch(setMinPrice(minPrice));
    dispatch(setMaxPrice(maxPrice));
    setBlindBoxParams(prev => ({ ...prev, pageIndex: 1 }));
  };

  const handleReleaseDateFilter = (dateRange: string) => {
    const now = new Date();
    let fromDate: string | null = null;
    
    switch (dateRange) {
      case "1 tháng qua":
        fromDate = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
        break;
      case "3 tháng qua":
        fromDate = new Date(now.setMonth(now.getMonth() - 3)).toISOString();
        break;
      case "6 tháng qua":
        fromDate = new Date(now.setMonth(now.getMonth() - 6)).toISOString();
        break;
      case "1 năm qua":
        fromDate = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
        break;
      case "Trên 1 năm":
        dispatch(setReleaseDateTo(new Date(now.setFullYear(now.getFullYear() - 1)).toISOString()));
        break;
    }

    if (fromDate) {
      dispatch(setReleaseDateFrom(fromDate));
      dispatch(setReleaseDateTo(undefined));
    }
    
    setBlindBoxParams(prev => ({ ...prev, pageIndex: 1 }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setBlindBoxParams(prev => ({ ...prev, pageIndex: 1 }));
  };

  // Filter blindboxes that have items
  const filteredBlindboxes = blindboxes?.result.filter((b) => b.items && b.items.length > 0) ?? [];

  return (
    <div className="mt-16 container mx-auto px-4 sm:px-6 lg:p-20 xl:px-20 2xl:px-20">
      <h1 className="text-3xl font-bold mb-6 text-center">Tất cả Blindbox</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filter */}
        <div className="w-full lg:w-auto lg:shrink-0">
          <ProductFilterSidebar 
            categories={categories} 
            prices={prices} 
            releaseDateRanges={releaseDateRanges}
            filters={filters} // Pass current filters to sidebar
            onCategoryFilter={handleCategoryFilter}
            onPriceFilter={handlePriceFilter}
            onReleaseDateFilter={handleReleaseDateFilter}
            onClearFilters={handleClearFilters}
          />
        </div>

        <main className="w-full">
          {/* Filter summary */}
          <div className="mb-4 flex flex-wrap gap-2">
            {filters.categoryId && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Category: {categories?.result.find(c => c.id === filters.categoryId)?.name}
                <button 
                  onClick={() => dispatch(setCategoryId(undefined))}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Price: {filters.minPrice?.toLocaleString() || '0'}₫ - {filters.maxPrice?.toLocaleString() || '∞'}₫
                <button 
                  onClick={() => {
                    dispatch(setMinPrice(undefined));
                    dispatch(setMaxPrice(undefined));
                  }}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.releaseDateFrom && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                Release Date: From {new Date(filters.releaseDateFrom).toLocaleDateString()}
                <button 
                  onClick={() => dispatch(setReleaseDateFrom(undefined))}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>

          {/* Blindbox Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredBlindboxes.map((box) => (
              <BlindboxCard
                key={box.id}
                blindbox={box}
                ribbonTypes={["blindbox"]}
                onViewDetail={(id) => router.push(`/detail-blindbox/${id}`)}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8">
            <Pagination
              currentPage={blindBoxParams.pageIndex ?? 1}
              totalPages={blindboxes?.totalPages ?? 1}
              onPageChange={handlePageChange}
            />
          </div>
        </main>
      </div>
      
      <Backdrop open={isPendingBlindbox} />
    </div>
  );
}