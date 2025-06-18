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
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { 
  setCategoryId, 
  setMinPrice, 
  setMaxPrice, 
  setReleaseDateFrom,
  setReleaseDateTo,
  clearFilters 
} from "@/stores/filter-product-slice";

export default function AllProduct() {
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

  const [products, setProducts] = useState<TAllProductResponse>()
  const { getAllProductWebApi, isPending } = useGetAllProductWeb()
  const [categories, setCategories] = useState<API.ResponseDataCategory>();
  const { getCategoryApi } = useGetCategory();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const catRes = await getCategoryApi({});
      if (catRes) setCategories(catRes.value.data || []);
    };
    fetchCategories();
  }, []);

  // Fetch products when filters or page change
  useEffect(() => {
    const fetchProducts = async () => {
      const apiParams: GetAllProducts = {
        pageIndex: currentPage,
        pageSize: pageSize,
        search: "",
        productStatus: undefined,
        sellerId: "",
        categoryId: filters.categoryId || "",
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        releaseDateFrom: filters.releaseDateFrom || undefined,
        releaseDateTo: filters.releaseDateTo || undefined,
        sortBy: undefined,
        desc: undefined,
      };
    
      const res = await getAllProductWebApi(apiParams);
      if (res) setProducts(res.value.data);
    };

    fetchProducts();
  }, [filters, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > (products?.totalPages || 1)) return;
    setCurrentPage(newPage);
  };

  const handleViewDetail = (id: string) => {
    router.push(`/detail/${id}`);
  };

  // Filter handlers using Redux dispatch
  const handleCategoryFilter = (categoryId: string) => {
    // If clicking the same category, clear it
    if (filters.categoryId === categoryId) {
      dispatch(setCategoryId(undefined));
    } else {
      dispatch(setCategoryId(categoryId));
    }
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  const handlePriceFilter = (priceRange: string) => {
    // If clicking the same price range, clear it
    const currentPriceRange = getCurrentPriceRange();
    if (currentPriceRange === priceRange) {
      dispatch(setMinPrice(undefined));
      dispatch(setMaxPrice(undefined));
      setCurrentPage(1);
      return;
    }

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
    setCurrentPage(1);
  };

  const handleReleaseDateFilter = (dateRange: string) => {
    // If clicking the same date range, clear it
    const currentDateRange = getCurrentReleaseDateRange();
    if (currentDateRange === dateRange) {
      dispatch(setReleaseDateFrom(undefined));
      dispatch(setReleaseDateTo(undefined));
      setCurrentPage(1);
      return;
    }

    let fromDate: string | undefined = undefined;
    let toDate: string | undefined = undefined;
    
    // Create a fresh date object for each calculation
    const now = new Date();
    
    switch (dateRange) {
      case "1 tháng qua":
        fromDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString();
        toDate = now.toISOString();
        break;
      case "3 tháng qua":
        fromDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()).toISOString();
        toDate = now.toISOString();
        break;
      case "6 tháng qua":
        fromDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()).toISOString();
        toDate = now.toISOString();
        break;
      case "1 năm qua":
        fromDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString();
        toDate = now.toISOString();
        break;
      case "Trên 1 năm":
        // For "older than 1 year": from very old date to 1 year ago
        fromDate = new Date(2000, 0, 1).toISOString(); // Start from year 2000
        toDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString();
        break;
    }

    dispatch(setReleaseDateFrom(fromDate));
    dispatch(setReleaseDateTo(toDate));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setCurrentPage(1);
  };

  // Helper functions (moved here to access current filters)
  const getCurrentPriceRange = (): string => {
    const { minPrice, maxPrice } = filters;
    
    if (minPrice === undefined && maxPrice === 200000) return "Dưới 200.000₫";
    if (minPrice === 200000 && maxPrice === 500000) return "200.000 - 500.000₫";
    if (minPrice === 500000 && maxPrice === 1000000) return "500.000 - 1.000.000₫";
    if (minPrice === 1000000 && maxPrice === 2000000) return "1.000.000 - 2.000.000₫";
    if (minPrice === 2000000 && maxPrice === 4000000) return "2.000.000 - 4.000.000₫";
    if (minPrice === 4000000 && maxPrice === undefined) return "Trên 4.000.000₫";
    
    return "";
  };

  const getCurrentReleaseDateRange = (): string => {
    if (!filters.releaseDateFrom || !filters.releaseDateTo) return "";
    
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    
    const fromDate = new Date(filters.releaseDateFrom);
    const toDate = new Date(filters.releaseDateTo);
    
    // Check if toDate is approximately now (within 1 day)
    const isToDateNow = Math.abs(toDate.getTime() - now.getTime()) < 24 * 60 * 60 * 1000;
    
    if (isToDateNow) {
      // For ranges ending at "now"
      if (Math.abs(fromDate.getTime() - oneMonthAgo.getTime()) < 24 * 60 * 60 * 1000) {
        return "1 tháng qua";
      }
      if (Math.abs(fromDate.getTime() - threeMonthsAgo.getTime()) < 7 * 24 * 60 * 60 * 1000) {
        return "3 tháng qua";
      }
      if (Math.abs(fromDate.getTime() - sixMonthsAgo.getTime()) < 7 * 24 * 60 * 60 * 1000) {
        return "6 tháng qua";
      }
      if (Math.abs(fromDate.getTime() - oneYearAgo.getTime()) < 30 * 24 * 60 * 60 * 1000) {
        return "1 năm qua";
      }
    } else {
      // For "Trên 1 năm" case: from very old date to 1 year ago
      const isFromOldDate = fromDate.getFullYear() <= 2000;
      const isToOneYearAgo = Math.abs(toDate.getTime() - oneYearAgo.getTime()) < 30 * 24 * 60 * 60 * 1000;
      
      if (isFromOldDate && isToOneYearAgo) {
        return "Trên 1 năm";
      }
    }
    
    return "";
  };

  const findCategoryName = (categoryId: string): string => {
    if (!categories?.result) return "";
    
    const findInArray = (arr: any[]): string => {
      for (const cat of arr) {
        if (cat.id === categoryId) return cat.name;
        if (cat.children && cat.children.length > 0) {
          const found = findInArray(cat.children);
          if (found) return found;
        }
      }
      return "";
    };
    
    return findInArray(categories.result);
  };

  return (
    <div className="mt-16 container mx-auto px-4 sm:px-6 lg:p-20 xl:px-20 2xl:px-20">
      <div className="flex flex-col lg:flex-row gap-6">

        <div className="w-full lg:w-auto lg:shrink-0">
          <ProductFilterSidebar 
            categories={categories} 
            prices={prices} 
            releaseDateRanges={releaseDateRanges}
            filters={filters}
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
                Category: {findCategoryName(filters.categoryId)}
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
                Price: {getCurrentPriceRange()}
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
            {(filters.releaseDateFrom || filters.releaseDateTo) && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                Release Date: {getCurrentReleaseDateRange()}
                <button 
                  onClick={() => {
                    dispatch(setReleaseDateFrom(undefined));
                    dispatch(setReleaseDateTo(undefined));
                  }}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>

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
              currentPage={currentPage}
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