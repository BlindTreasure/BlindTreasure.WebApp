"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/product-card";
import { TAllProductResponse, GetAllProducts } from "@/services/product/typings";
import { Backdrop } from "@/components/backdrop";
import { useRouter } from "next/navigation";
import useGetAllProductWeb from "../../allproduct/hooks/useGetAllProductWeb";
import { ProductSortBy } from "@/const/products";
import Pagination from "@/components/pagination";
import { getRibbonTypes } from "@/utils/getRibbonTypes";
import { useWishlistContext } from "@/contexts/WishlistContext";
import useAddProductToCart from '@/app/(user)/detail/hooks/useAddProductToCart';

export default function AllSaleProductsComponent() {
  const [products, setProducts] = useState<TAllProductResponse>();
  const [loadingPage, setLoadingPage] = useState(false);
  const router = useRouter();
  const { getAllProductWebApi, isPending } = useGetAllProductWeb();
  const { getItemWishlistStatus, refreshWishlistStatus } = useWishlistContext();
  const { isPending: isPendingProductCart, addProductToCartApi } = useAddProductToCart();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const params: GetAllProducts = {
    pageIndex: 1,
    pageSize: 100, 
    search: "",
    productStatus: undefined,
    sellerId: "",
    categoryId: "",
    sortBy: ProductSortBy.CreatedAt,
    desc: true,
  };

  const handleViewDetail = (id: string) => {
    setLoadingPage(true);
    router.push(`/detail/${id}`);
  };

  const handleAddProductToCart = async (productId: string, quantity: number = 1) => {
    await addProductToCartApi({ productId, quantity });
  };

  useEffect(() => {
    (async () => {
      const res = await getAllProductWebApi(params);
      if (res) {
        setProducts(res.value.data);
      }
    })();
  }, []);

  const saleProducts = products?.result.filter(
    (product) => product.listedPrice != null && product.listedPrice > 0 && product.productType !== "BlindBoxOnly"
  ) ?? [];

  const totalPages = Math.ceil(saleProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSaleProducts = saleProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            HÀNG KHUYẾN MÃI
          </h1>
          <p className="text-gray-600">
            Khám phá các sản phẩm đang được giảm giá đặc biệt
          </p>
        </div>

        {isPending ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-lg">Đang tải...</div>
          </div>
        ) : saleProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentSaleProducts.map((product) => {
                const ribbonTypes = getRibbonTypes(product);
                const wishlistStatus = getItemWishlistStatus(product.id);

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    ribbonTypes={ribbonTypes}
                    onViewDetail={handleViewDetail}
                    onAddToCart={handleAddProductToCart}
                    initialIsInWishlist={wishlistStatus.isInWishlist}
                    initialWishlistId={wishlistStatus.wishlistId}
                    onWishlistChange={refreshWishlistStatus}
                    context="sale"
                  />
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <img
              src="/images/Empty-items.jpg"
              alt="Không có sản phẩm khuyến mãi"
              className="w-64 h-64 object-contain mb-4"
            />
            <p className="text-gray-500 text-lg">
              Hiện tại không có sản phẩm khuyến mãi nào
            </p>
          </div>
        )}
      </div>

      <Backdrop open={loadingPage} />
    </>
  );
}
