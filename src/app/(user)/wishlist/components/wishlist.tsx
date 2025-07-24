
'use client';
import React, { useEffect, useState } from 'react';
import useGetWishlist from '../hooks/useGetWishlist';
import { WishlistItem } from '@/services/customer-favourite/typings';
import ProductCard from '@/components/product-card';
import BlindboxCard from '@/components/blindbox-card';
import { useRouter } from 'next/navigation';
import { Product as ProductCardType } from '@/services/product-seller/typings';
import { BlindBox as BlindboxCardType } from '@/services/blindboxes/typings';
import Pagination from '@/components/pagination';


export default function Wishlist() {
    const router = useRouter();
    const { getWishlistApi } = useGetWishlist();
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const pageSize = 12;

    const adaptProductForCard = (product: any): ProductCardType => ({
        ...product,
        height: product.height || 0,
        material: product.material || '',
        brand: product.brand || '',
    });

    const adaptBlindboxForCard = (blindbox: any): BlindboxCardType => ({
        ...blindbox,
        brand: blindbox.brand || '',
        items: blindbox.items || [],
    });

    const fetchWishlist = async (page: number = 1) => {
        setIsLoading(true);
        try {
            const result = await getWishlistApi({
                pageIndex: page,
                pageSize: pageSize,
            });

            if (result) {
                setWishlistItems(result.value.data.result);
                setCurrentPage(result.value.data.currentPage);
                setTotalPages(result.value.data.totalPages);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleViewProductDetail = (productId: string) => {
        router.push(`/detail/${productId}`);
    };

    const handleViewBlindboxDetail = (blindboxId: string) => {
        router.push(`/detail-blindbox/${blindboxId}`);
    };

    const handleWishlistChange = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 100));

            const result = await getWishlistApi({
                pageIndex: currentPage,
                pageSize: pageSize,
            });

            if (result) {
                const hasItemsOnCurrentPage = result.value.data.result.length > 0;
                const newTotalPages = result.value.data.totalPages;

                if (!hasItemsOnCurrentPage && currentPage > 1 && newTotalPages > 0) {
                    const targetPage = Math.min(currentPage - 1, newTotalPages);
                    setCurrentPage(targetPage);
                    return; 
                }

                if (!hasItemsOnCurrentPage && currentPage === 1 && newTotalPages === 0) {
                    setWishlistItems([]);
                    setCurrentPage(1);
                    setTotalPages(0);
                    return;
                }

                setWishlistItems(result.value.data.result);
                setCurrentPage(result.value.data.currentPage);
                setTotalPages(newTotalPages);
            }
        } catch (error) {
            console.error('Error refreshing wishlist:', error);
            fetchWishlist(currentPage);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-40">
            <h1 className="text-2xl font-bold mb-6 flex justify-center">Danh sách yêu thích</h1>

            {wishlistItems.length === 0 ? (
                <div className="text-center py-12">
                    <img
                        src="/images/Empty-items.jpg"
                        alt="Empty wishlist"
                        className="mx-auto mb-4 w-48 h-48 object-contain"
                    />
                    <p className="text-gray-500 text-lg">Danh sách yêu thích trống</p>
                    <p className="text-gray-400 text-sm mt-2">Hãy thêm sản phẩm yêu thích để xem tại đây</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {wishlistItems.map((item) => {
                            if (item.type === 'Product' && item.product) {
                                return (
                                    <ProductCard
                                        key={item.id}
                                        product={adaptProductForCard(item.product)}
                                        onViewDetail={handleViewProductDetail}
                                        initialIsInWishlist={true}
                                        initialWishlistId={item.id}
                                        onWishlistChange={handleWishlistChange}
                                    />
                                );
                            } else if (item.type === 'BlindBox' && item.blindBox) {
                                return (
                                    <BlindboxCard
                                        key={item.id}
                                        blindbox={adaptBlindboxForCard(item.blindBox)}
                                        onViewDetail={handleViewBlindboxDetail}
                                        initialIsInWishlist={true}
                                        initialWishlistId={item.id}
                                        onWishlistChange={handleWishlistChange}
                                    />
                                );
                            }
                            return null;
                        })}
                    </div>

                    <div className='flex justify-center'>
                        {totalPages > 1 && (
                            <div className="mt-8">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
