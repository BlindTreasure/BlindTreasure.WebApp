'use client'
import { useState, useEffect, useRef } from "react";
import ProductFilterSidebar from "@/components/product-filter-sidebar";
import ProductCard from "@/components/product-card";
import BlindboxCard from "@/components/blindbox-card";
import useGetAllProductWeb from "../hooks/useGetAllProductWeb";
import useGetAllBlindBoxes from "@/app/seller/allblindboxes/hooks/useGetAllBlindBoxes";
import { GetBlindBoxes } from "@/services/blindboxes/typings";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import {
  setMinPrice,
  setMaxPrice,
  setReleaseDateFrom,
  setReleaseDateTo,
  setCategoryId,
  clearFilters
} from "@/stores/filter-product-slice";
import { setCart } from "@/stores/cart-slice";
import { Backdrop } from "@/components/backdrop";
import useGetCategory from "@/app/staff/category-management/hooks/useGetCategory";
import Pagination from "@/components/tables/Pagination";
import { useWishlistContext } from "@/contexts/WishlistContext";
import useAddProductToCart from '@/app/(user)/detail/hooks/useAddProductToCart'
import useAddBlindboxToCart from '@/app/(user)/detail-blindbox/hooks/useAddBlindboxToCart'

export default function AllProduct() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.filterSlice);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const selectedCategoryId = searchParams.get('categoryId') || '';

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

  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<API.ResponseDataCategory>();
  const [isInitialized, setIsInitialized] = useState(false);
  const [combinedData, setCombinedData] = useState<Array<{ type: 'product' | 'blindbox', data: any }>>([]);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 6;

  const { getAllProductWebApi, isPending: isPendingProducts } = useGetAllProductWeb();
  const { getAllBlindBoxesApi, isPending: isPendingBlindbox } = useGetAllBlindBoxes();
  const { getCategoryApi } = useGetCategory();
  const { getItemWishlistStatus, refreshWishlistStatus } = useWishlistContext();

  const { isPending: isPendingProductCart, addProductToCartApi } = useAddProductToCart();
  const { isPending: isPendingBlindboxCart, addBlindboxToCartApi } = useAddBlindboxToCart();

  useEffect(() => {
    return () => {
      if (!pathname.includes('/allproduct')) {
        dispatch(clearFilters());
        dispatch(setCategoryId(undefined));
      }
    };
  }, [dispatch, pathname]);

  useEffect(() => {
    if (!isInitialized) {
      const categoryIdFromUrl = searchParams.get('categoryId') || "";
      if (categoryIdFromUrl === "") {
        dispatch(setCategoryId(undefined));
      }
      setIsInitialized(true);
    }
  }, [dispatch, isInitialized, searchParams]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const catRes = await getCategoryApi({});
      if (catRes) {
        setCategories(catRes.value.data || []);
      }
    };
    fetchCategories();
  }, []);

  // Fetch data when filters change
  useEffect(() => {
    if (!isInitialized || !categories) return;

    const fetchFilteredData = async () => {
      try {
        const productParams = {
          pageIndex: 1,
          pageSize: 1000,
          search: "",
          productStatus: undefined,
          sellerId: "",
          categoryId: selectedCategoryId || "",
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          releaseDateFrom: filters.releaseDateFrom,
          releaseDateTo: filters.releaseDateTo,
          sortBy: undefined,
          desc: undefined,
        };

        const blindboxParams: GetBlindBoxes = {
          pageIndex: 1,
          pageSize: 1000,
          search: "",
          SellerId: "",
          categoryId: selectedCategoryId || "",
          status: "Approved",
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          ReleaseDateFrom: filters.releaseDateFrom || "",
          ReleaseDateTo: filters.releaseDateTo || "",
          HasItem: undefined,
        };

        const [productRes, blindboxRes] = await Promise.all([
          getAllProductWebApi(productParams),
          getAllBlindBoxesApi(blindboxParams)
        ]);

        const combinedData: Array<{ type: 'product' | 'blindbox', data: any }> = [];
        const products = productRes?.value?.data?.result || [];
        const blindboxes = blindboxRes?.value?.data?.result || [];

        products.forEach(product => {
          combinedData.push({ type: 'product', data: product });
        });
        blindboxes.forEach(blindbox => {
          combinedData.push({ type: 'blindbox', data: blindbox });
        });

        setCombinedData(combinedData);
        setTotalItems(
          (productRes?.value?.data?.count || 0) +
          (blindboxRes?.value?.data?.count || 0)
        );
        setCurrentPage(1);
      } catch (error) {
        console.error('Error fetching filtered data:', error);
        setCombinedData([]);
        setTotalItems(0);
      }
    };

    fetchFilteredData();
  }, [isInitialized, categories, selectedCategoryId, filters.minPrice, filters.maxPrice, filters.releaseDateFrom, filters.releaseDateTo]);

  const handleCategoryFilter = (categoryId: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('categoryId', categoryId);
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`/allproduct${query}`);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const handleViewDetail = (id: string) => {
    router.push(`/detail/${id}`);
  };

  const handleViewBlindboxDetail = (id: string) => {
    router.push(`/detail-blindbox/${id}`);
  };

  const handleAddProductToCart = async (productId: string, quantity: number = 1) => {
    await addProductToCartApi({ productId, quantity });
  };

  const handleAddBlindboxToCart = async (blindBoxId: string, quantity: number = 1) => {
    await addBlindboxToCartApi({ blindBoxId, quantity });
  };

  const handlePriceFilter = (priceRange: string) => {
    const currentPriceRange = getCurrentPriceRange();
    if (currentPriceRange === priceRange) {
      dispatch(setMinPrice(undefined));
      dispatch(setMaxPrice(undefined));
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
    const currentDateRange = getCurrentReleaseDateRange();
    if (currentDateRange === dateRange) {
      dispatch(setReleaseDateFrom(undefined));
      dispatch(setReleaseDateTo(undefined));
      return;
    }

    let fromDate: string | undefined = undefined;
    let toDate: string | undefined = undefined;
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
        fromDate = new Date(2000, 0, 1).toISOString();
        toDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString();
        break;
    }

    dispatch(setReleaseDateFrom(fromDate));
    dispatch(setReleaseDateTo(toDate));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    dispatch(setMinPrice(undefined));
    dispatch(setMaxPrice(undefined));
    dispatch(setReleaseDateFrom(undefined));
    dispatch(setReleaseDateTo(undefined));
    if (filters.categoryId === undefined) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.delete('categoryId');
      const search = current.toString();
      const query = search ? `?${search}` : '';
      router.push(`/allproduct${query}`);
    }
    setCurrentPage(1);
  };

  const hasActiveFilters = () => {
    return !!(filters.minPrice || filters.maxPrice || filters.releaseDateFrom || filters.releaseDateTo);
  };

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
    const isToDateNow = Math.abs(toDate.getTime() - now.getTime()) < 24 * 60 * 60 * 1000;

    if (isToDateNow) {
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
      const isFromOldDate = fromDate.getFullYear() <= 2000;
      const isToOneYearAgo = Math.abs(toDate.getTime() - oneYearAgo.getTime()) < 30 * 24 * 60 * 60 * 1000;
      if (isFromOldDate && isToOneYearAgo) {
        return "Trên 1 năm";
      }
    }
    return "";
  };

  const totalPages = Math.ceil(totalItems / pageSize);
  const isPending = isPendingProducts || isPendingBlindbox || isPendingProductCart || isPendingBlindboxCart;

  return (
    <div className="mt-16 container mx-auto px-4 sm:px-6 lg:p-20 xl:px-20 2xl:px-20">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-auto lg:shrink-0">
          <ProductFilterSidebar
            categories={categories}
            prices={prices}
            releaseDateRanges={releaseDateRanges}
            filters={{
              ...filters,
              selectedCategoryId: selectedCategoryId
            }}
            onCategoryFilter={handleCategoryFilter}
            onPriceFilter={handlePriceFilter}
            onReleaseDateFilter={handleReleaseDateFilter}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters()}
          />
        </div>

        <main className="w-full">
          <div className="mb-4 flex flex-wrap gap-2">
            {(filters.minPrice || filters.maxPrice) && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Price: {getCurrentPriceRange()}
                <button
                  onClick={() => {
                    dispatch(setMinPrice(undefined));
                    dispatch(setMaxPrice(undefined));
                    setCurrentPage(1);
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
                    setCurrentPage(1);
                  }}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {combinedData
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((item, index) => {
                const wishlistStatus = getItemWishlistStatus(item.data.id);
                return item.type === 'product' ? (
                  <ProductCard
                    key={`product-${item.data.id}-${index}`}
                    product={item.data}
                    onViewDetail={handleViewDetail}
                    onAddToCart={handleAddProductToCart}
                    initialIsInWishlist={wishlistStatus.isInWishlist}
                    initialWishlistId={wishlistStatus.wishlistId}
                    onWishlistChange={refreshWishlistStatus}
                  />
                ) : (
                  <BlindboxCard
                    key={`blindbox-${item.data.id}-${index}`}
                    blindbox={item.data}
                    ribbonTypes={["blindbox"]}
                    onViewDetail={handleViewBlindboxDetail}
                    onAddToCart={handleAddBlindboxToCart}
                    initialIsInWishlist={wishlistStatus.isInWishlist}
                    initialWishlistId={wishlistStatus.wishlistId}
                    onWishlistChange={refreshWishlistStatus}
                  />
                );
              })}
          </div>

          {combinedData.length === 0 && !isPending && (
            <div className="text-center py-8 text-gray-500">
              Không tìm thấy sản phẩm phù hợp với bộ lọc của bạn.
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </main>
      </div>
      <Backdrop open={isPending} />
    </div>
  );
}