'use client'
import React, { useState, useEffect, useCallback } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import Pagination from "./Pagination";
import useGetStatusSeller from "@/app/staff/seller-management/hooks/useGetStatusSeller";
import { SellerStatus } from "@/const/seller";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import useVerifySeller from "@/app/staff/seller-management/hooks/useVerifySeller";


export default function SellerManagementTable() {
    const { isPending, getStatusSellersApi } = useGetStatusSeller();
    const [selectedSeller, setSelectedSeller] = useState<API.Seller | null>(null);
    const [sellers, setSellers] = useState<API.Seller[]>([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [totalSellers, setTotalSellers] = useState(0);
    const [status, setStatus] = useState<SellerStatus | undefined>(undefined);
    const [rejectReasonModalOpen, setRejectReasonModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [rejectingSellerId, setRejectingSellerId] = useState<string | null>(null);
    const { verifySeller, isPending: isVerifying } = useVerifySeller();

    useEffect(() => {
        async function fetchSellers() {
            const res = await getStatusSellersApi({ status, pageIndex, pageSize });
            if (res) {
                setSellers(res.value.data.result);
                setTotalPages(res.value.data.totalPages);
                setTotalSellers(res.value.data.count);
            }
        }
        fetchSellers();
    }, [status, pageIndex, pageSize]);

    const startIndex = (pageIndex - 1) * entriesPerPage + 1;
    const endIndex = Math.min(pageIndex * entriesPerPage, totalSellers);

    const openModal = (seller: API.Seller) => {
        setSelectedSeller(seller);
    };

    const closeModal = () => {
        setSelectedSeller(null);
    };

    const statusBadgeColor = (status: string) => {
        switch (status) {
            case "Approved":
                return "bg-[#ecfdf3] text-[#039855]";
            case "Rejected":
                return "bg-red-100 text-red-800";
            case "WaitingReview":
                return "bg-[#fffaeb] text-[#dc6803]";
            default:
                return "bg-[#fef3f2] text-[#d92d20]";
        }
    };

    const verifiedBadgeColor = (isVerified: boolean) => {
        return isVerified ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800";
    };

    const handleApprove = async (sellerId: string) => {
        const success = await verifySeller(sellerId, {
            IsApproved: true,
            RejectReason: "",
        });

        if (success) {
            closeModal();
            // Tải lại danh sách
            const res = await getStatusSellersApi({ status, pageIndex, pageSize });
            if (res) {
            setSellers(res.value.data.result);
            setTotalPages(res.value.data.totalPages);
            setTotalSellers(res.value.data.count);
            }
        }
        };

    const handleRejectClick = (sellerId: string) => {
        setRejectingSellerId(sellerId);
        setRejectReason("");
        setRejectReasonModalOpen(true);
    };

    const handleConfirmReject = async () => {
        if (!rejectingSellerId) return;

        const success = await verifySeller(rejectingSellerId, {
            IsApproved: false,
            RejectReason: rejectReason,
        });

        if (success) {
            setRejectReasonModalOpen(false);
            closeModal();

            const res = await getStatusSellersApi({ status, pageIndex, pageSize });
            if (res) {
                setSellers(res.value.data.result);
                setTotalPages(res.value.data.totalPages);
                setTotalSellers(res.value.data.count);
            }
        }
    };


    return (
        <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-md dark:border-white/[0.1] dark:bg-gray-900">

            <div className="p-4 bg-white dark:bg-gray-800 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="w-full md:w-48">
                    <Select
                        value={status ?? "All"}
                        onValueChange={(value: string) => {
                            setStatus(value === "All" ? undefined : (value as SellerStatus));
                            setPageIndex(1);
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Lọc theo trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">Tất cả</SelectItem>
                            <SelectItem value="WaitingReview">Chờ duyệt</SelectItem>
                            <SelectItem value="Approved">Đã duyệt</SelectItem>
                            <SelectItem value="Rejected">Từ chối</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Hiển thị</span>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(value) => {
                            const newPageSize = Number(value);
                            setPageSize(newPageSize);
                            setPageIndex(1);
                        }}
                    >
                        <SelectTrigger className="w-20">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="text-gray-600 dark:text-gray-400">mỗi trang</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="border-b bg-gray-100 dark:bg-gray-800">
                        <TableRow className="text-gray-600 dark:text-gray-300 text-sm font-semibold">
                            {[
                                "Họ tên",
                                "Email",
                                "Tên công ty",
                                "Trạng thái",
                                "Xác minh",
                                "Chi tiết"
                            ].map((header) => (
                                <TableCell key={header} className="px-6 py-4 text-left">
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {sellers.map((seller) => (
                            <TableRow key={seller.sellerId} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300 max-w-[100px]">
                                    <div className="truncate" title={seller.fullName}>
                                        {seller.fullName}
                                    </div>
                                </TableCell>

                                <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300 max-w-[150px]">
                                    <div className="truncate" title={seller.email}>
                                        {seller.email}
                                    </div>
                                </TableCell>

                                <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                    {seller.companyName}
                                </TableCell>

                                <TableCell className="md:px-6 md:py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadgeColor(seller.status)}`}>
                                        {seller.status === "WaitingReview" ? "Chờ duyệt" :
                                            seller.status === "Approved" ? "Đã duyệt" : "Từ chối"}
                                    </span>
                                </TableCell>

                                <TableCell className="md:px-6 md:py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${verifiedBadgeColor(seller.isVerified)}`}>
                                        {seller.isVerified ? "Đã xác minh" : "Chưa xác minh"}
                                    </span>
                                </TableCell>

                                <TableCell className="px-6 md:px-8 py-4">
                                    <button
                                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-400 hover:bg-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition"
                                        onClick={() => openModal(seller)}
                                    >
                                        <span className="text-gray-600 dark:text-gray-300">...</span>
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="p-4 border-t bg-white dark:bg-gray-800 flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                    Đang hiển thị {sellers.length > 0 ? `${startIndex} - ${endIndex}` : "0"} trên tổng {totalSellers} người bán
                </span>
                <Pagination
                    currentPage={pageIndex}
                    totalPages={totalPages}
                    onPageChange={setPageIndex}

                />
            </div>

            {selectedSeller && (
                <Dialog open={Boolean(selectedSeller)} onOpenChange={closeModal}>
                    <DialogContent className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-2xl">
                        <DialogTitle className="border-b pb-4 text-lg font-semibold">Chi tiết người bán</DialogTitle>
                        <DialogDescription asChild>
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="space-y-2">
                                        <div className="text-gray-700 dark:text-gray-300">
                                            <strong>ID:</strong> {selectedSeller.sellerId}
                                        </div>
                                        <div className="text-gray-700 dark:text-gray-300">
                                            <strong>Email:</strong> {selectedSeller.email}
                                        </div>
                                        <div className="text-gray-700 dark:text-gray-300">
                                            <strong>Họ tên:</strong> {selectedSeller.fullName}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-gray-700 dark:text-gray-300">
                                            <strong>Tên công ty:</strong> {selectedSeller.companyName}
                                        </div>
                                        <div className="text-gray-700 dark:text-gray-300">
                                            <strong>Trạng thái:</strong>
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${statusBadgeColor(selectedSeller.status)}`}>
                                                {selectedSeller.status === "WaitingReview" ? "Chờ duyệt" :
                                                    selectedSeller.status === "Approved" ? "Đã duyệt" : "Từ chối"}
                                            </span>
                                        </div>
                                        <div className="text-gray-700 dark:text-gray-300">
                                            <strong>Xác minh:</strong>
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${verifiedBadgeColor(selectedSeller.isVerified)}`}>
                                                {selectedSeller.isVerified ? "Đã xác minh" : "Chưa xác minh"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">Tài liệu COA</h3>
                                    {selectedSeller.coaDocumentUrl ? (
                                        <div className="flex flex-col gap-4">
                                            <a
                                                href={selectedSeller.coaDocumentUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-block"
                                            >
                                                Xem tài liệu đầy đủ
                                            </a>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400">Không có tài liệu</p>
                                    )}
                                </div>

                                {selectedSeller.status === "WaitingReview" && (
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                                            onClick={() => handleRejectClick(selectedSeller.sellerId)}
                                        >
                                            Từ chối
                                        </button>

                                        <button
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                            onClick={() => handleApprove(selectedSeller.sellerId)}
                                        >
                                            Phê duyệt
                                        </button>
                                    </div>
                                )}
                            </div>
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            )}
            <Dialog open={rejectReasonModalOpen} onOpenChange={setRejectReasonModalOpen}>
                <DialogContent className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-md">
                    <DialogTitle className="text-lg font-semibold mb-2">Lý do từ chối</DialogTitle>
                    <DialogDescription>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full h-24 p-2 border rounded-md resize-none text-gray-800 dark:text-gray-200 dark:bg-gray-800"
                            placeholder="Nhập lý do từ chối..."
                        />
                    </DialogDescription>
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={() => setRejectReasonModalOpen(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleConfirmReject}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                            disabled={!rejectReason.trim()}
                        >
                            Xác nhận từ chối
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}