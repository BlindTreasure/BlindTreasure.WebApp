"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, Filter, RefreshCw, MessageCircle } from "lucide-react";
import { CiSearch } from "react-icons/ci";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/stores/store";
import { PaginationFooter } from "@/components/pagination-footer";
import useSellerReviews from "../hooks/useSellerReviews";
import ReviewTable from "./ReviewTable";
import { useEffect } from "react";

function Reply() {
    const user = useAppSelector((state: any) => state.userSlice.user);
    const [searchInput, setSearchInput] = useState("");
    const [filters, setFilters] = useState({
        minRating: undefined as number | undefined,
        maxRating: undefined as number | undefined,
        hasComment: undefined as boolean | undefined,
        hasImages: undefined as boolean | undefined,
        hasSellerReply: undefined as boolean | undefined,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const sellerId = user?.id || user?.sellerId;

    const {
        reviews,
        loading,
        error,
        totalPages,
        totalReviews,
        refetch,
    } = useSellerReviews({
        sellerId,
        pageIndex: currentPage,
        pageSize,
        search: searchInput,
        ...filters,
    });

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value === "all" ? undefined : value,
        }));
        setCurrentPage(1); 
    };

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setCurrentPage(1); 
    };

    const handleReplySuccess = () => {
        refetch(); 
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            setCurrentPage(1); 
        }, 500);
        return () => clearTimeout(delay);
    }, [searchInput]);

    if (!sellerId) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-gray-500">Không tìm thấy thông tin seller</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto p-4 lg:p-6 space-y-6">
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                                Quản Lý Đánh Giá
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Xem và phản hồi đánh giá từ khách hàng
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600">Tổng đánh giá</p>
                                    <p className="text-2xl font-bold text-blue-900">{totalReviews}</p>
                                </div>
                                <div className="p-3 bg-blue-200 rounded-full">
                                    <Star className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-red-600">Chưa phản hồi</p>
                                    <p className="text-2xl font-bold text-red-900">
                                        {reviews.filter(r => !r.sellerReply).length}
                                    </p>
                                </div>
                                <div className="p-3 bg-red-200 rounded-full">
                                    <MessageCircle className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600">Đã phản hồi</p>
                                    <p className="text-2xl font-bold text-green-900">
                                        {reviews.filter(r => r.sellerReply).length}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-200 rounded-full">
                                    <MessageCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="shadow-lg rounded-lg border border-gray-200">
                    <CardContent className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 py-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <Select
                                    value={`${filters.minRating || 'all'}-${filters.maxRating || 'all'}`}
                                    onValueChange={(value) => {
                                        if (value === "all-all") {
                                            handleFilterChange("minRating", undefined);
                                            handleFilterChange("maxRating", undefined);
                                        } else {
                                            const [min, max] = value.split('-').map(v => v === 'all' ? undefined : parseInt(v));
                                            handleFilterChange("minRating", min);
                                            handleFilterChange("maxRating", max);
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Đánh giá" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all-all">Tất cả sao</SelectItem>
                                        <SelectItem value="5-5">5 sao</SelectItem>
                                        <SelectItem value="4-5">4-5 sao</SelectItem>
                                        <SelectItem value="4-4">4 sao</SelectItem>
                                        <SelectItem value="3-5">3-5 sao</SelectItem>
                                        <SelectItem value="3-3">3 sao</SelectItem>
                                        <SelectItem value="2-2">2 sao</SelectItem>
                                        <SelectItem value="1-1">1 sao</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.hasComment === undefined ? "all" : filters.hasComment.toString()}
                                    onValueChange={(value) => handleFilterChange("hasComment", value === "all" ? undefined : value === "true")}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Bình luận" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="true">Có bình luận</SelectItem>
                                        <SelectItem value="false">Không có bình luận</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.hasSellerReply === undefined ? "all" : filters.hasSellerReply.toString()}
                                    onValueChange={(value) => handleFilterChange("hasSellerReply", value === "all" ? undefined : value === "true")}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Phản hồi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="true">Đã phản hồi</SelectItem>
                                        <SelectItem value="false">Chưa phản hồi</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.hasImages === undefined ? "all" : filters.hasImages.toString()}
                                    onValueChange={(value) => handleFilterChange("hasImages", value === "all" ? undefined : value === "true")}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Hình ảnh" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="true">Có hình ảnh</SelectItem>
                                        <SelectItem value="false">Không có hình ảnh</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Đang tải đánh giá...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <p className="text-red-600">{error}</p>
                                <Button onClick={refetch} className="mt-2">
                                    Thử lại
                                </Button>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-8">
                                <img
                                    src="https://cdni.iconscout.com/illustration/premium/thumb/empty-review-12057781-9824451.png"
                                    alt="Chưa có đánh giá"
                                    className="w-32 h-32 mx-auto mb-4 opacity-60"
                                />
                                <p className="text-gray-500">Chưa có đánh giá nào</p>
                            </div>
                        ) : (
                            <ReviewTable
                                reviews={reviews}
                                onReplySuccess={handleReplySuccess}
                            />
                        )}

                        {totalReviews > 0 && (
                            <PaginationFooter
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalReviews}
                                pageSize={pageSize}
                                onPageSizeChange={handlePageSizeChange}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Reply;
