"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { BsEye } from "react-icons/bs";
import moment from "moment";
import { ExportUnboxLogsParams, ResponseUnboxLogs, ResponseUnboxLogsList } from "@/services/unbox/typings";
import useGetUnboxLogs from "../hooks/useGetUnboxLogs";
import useGetProductByIdWeb from "@/app/(user)/detail/hooks/useGetProductByIdWeb";
import { AllProduct } from "@/services/product/typings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CiSearch } from "react-icons/ci";
import { Rarity, RarityColorClass, RarityText } from "@/const/products";
import ReactMarkdown from 'react-markdown'
import { PaginationFooter } from "@/components/pagination-footer";
import useExportLogs from "../hooks/useExportLogs";

export default function UnboxLogs() {
    const { isPending, getUnboxLogsApi } = useGetUnboxLogs();
    const { isPending: isLoadingProduct, getProductByIdWebApi } = useGetProductByIdWeb();
    const [logs, setLogs] = useState<ResponseUnboxLogs[]>([]);
    const [selectedLog, setSelectedLog] = useState<ResponseUnboxLogs | null>(null);
    const [productDetail, setProductDetail] = useState<AllProduct | null>(null);
    const [paginationData, setPaginationData] = useState<ResponseUnboxLogsList | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const { isPending: isExporting, exportLogsApi } = useExportLogs();
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");

    useEffect(() => {
        const fetchLogs = async () => {
            const res = await getUnboxLogsApi({
                PageIndex: currentPage,
                PageSize: pageSize
            });
            if (res?.value?.data) {
                setLogs(res.value.data.result);
                setPaginationData(res.value.data);
            }
        };
        fetchLogs();
    }, [currentPage, pageSize]);

    const formatDateToISO = (dateString: string): string => {
        if (!dateString) return "";
        const date = new Date(dateString);
        date.setHours(0, 0, 0, 0);
        return date.toISOString();
    };

    const formatEndDateToISO = (dateString: string): string => {
        if (!dateString) return "";
        const date = new Date(dateString);
        date.setHours(23, 59, 59, 999);
        return date.toISOString();
    };

    const handleExportLogs = async () => {
        const exportParams: ExportUnboxLogsParams = {
            FromDate: fromDate ? formatDateToISO(fromDate) : undefined,
            ToDate: toDate ? formatEndDateToISO(toDate) : undefined,
        };

        const res = await exportLogsApi(exportParams);
        if (res) {
            const url = window.URL.createObjectURL(res);
            const a = document.createElement("a");
            a.href = url;
            a.download = "unbox-logs.xlsx";
            a.click();
            window.URL.revokeObjectURL(url);
        }
    };


    useEffect(() => {
        const fetchProductDetail = async () => {
            if (selectedLog) {
                const res = await getProductByIdWebApi(selectedLog.productId);
                if (res?.value?.data) {
                    setProductDetail(res.value.data);
                }
            }
        };
        fetchProductDetail();
    }, [selectedLog]);


    return (
        <div>
            <Card className="mt-6 shadow-lg rounded-lg border border-gray-200">
                <CardContent className="space-y-6 py-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Danh sách khách trúng thưởng blindbox</h2>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-md font-medium">Chọn ngày để xuất file</h3>
                            <Button onClick={handleExportLogs} disabled={isExporting} className="bg-green-500 hover:bg-opacity-80">
                                {isExporting ? "Đang xuất..." : "Xuất file Excel"}
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fromDate" className="text-sm font-medium">
                                    Từ ngày
                                </Label>
                                <Input
                                    id="fromDate"
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="w-1/2 date-icon-black dark:date-icon-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="toDate" className="text-sm font-medium">
                                    Đến ngày
                                </Label>
                                <Input
                                    id="toDate"
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="w-1/2 date-icon-black dark:date-icon-white"
                                />
                            </div>
                        </div>
                    </div>

                    <Table className="table-fixed w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-36">Khách hàng</TableHead>
                                <TableHead className="w-56">Sản phẩm</TableHead>
                                <TableHead className="w-20">Độ hiếm</TableHead>
                                <TableHead className="w-36">Ngày mở</TableHead>
                                <TableHead className="w-24">Chi tiết</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isPending
                                ? Array.from({ length: 5 }).map((_, idx) => (
                                    <TableRow key={idx}>
                                        {Array.from({ length: 7 }).map((__, i) => (
                                            <TableCell key={i}>
                                                <Skeleton className="h-4 w-full" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                                : logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>{log.customerName}</TableCell>
                                        <TableCell className="truncate whitespace-nowrap">{log.productName}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium text-center ${RarityColorClass[log.rarity as Rarity]}`}
                                            >
                                                {RarityText[log.rarity as Rarity]}
                                            </span>
                                        </TableCell>
                                        <TableCell>{moment(log.unboxedAt).format("DD/MM/YYYY")}</TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="icon" onClick={() => setSelectedLog(log)}>
                                                <BsEye className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>

                    {paginationData && (
                        <PaginationFooter
                            currentPage={currentPage}
                            totalPages={paginationData.totalPages}
                            totalItems={paginationData.count}
                            pageSize={pageSize}
                            onPageSizeChange={(newSize) => {
                                setPageSize(newSize);
                                setCurrentPage(1);
                            }}
                            onPageChange={setCurrentPage}
                        />
                    )}

                    {selectedLog && (
                        <Dialog open={true} onOpenChange={() => {
                            setSelectedLog(null);
                            setProductDetail(null);
                        }}>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Chi tiết sản phẩm trúng thưởng</DialogTitle>
                                </DialogHeader>

                                {isLoadingProduct || !productDetail ? (
                                    <div className="space-y-2 mt-4">
                                        <Skeleton className="h-5 w-3/4" />
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-64 w-full rounded-lg" />
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4 mt-4">
                                        <div className="font-semibold text-lg">{productDetail.name}</div>
                                        <div className="flex items-start">
                                            {productDetail.imageUrls?.[0] ? (
                                                <img
                                                    src={productDetail.imageUrls[0]}
                                                    alt="Ảnh sản phẩm"
                                                    className="w-32 h-32 object-cover rounded border"
                                                />
                                            ) : (
                                                <div className="text-gray-500 text-sm">Không có hình ảnh</div>
                                            )}
                                        </div>

                                        <div className="text-sm text-gray-700"> <strong>Mô tả: </strong>{productDetail.description}</div>
                                        <div className="text-sm text-gray-700"> <strong>Sản phẩm thuộc: </strong>{selectedLog.blindBoxName}</div>

                                        <div className="text-sm">
                                            <strong className="text-gray-700">Giá:</strong> <span className="text-[#d02a2a]">{productDetail.realSellingPrice?.toLocaleString()}₫</span>
                                        </div>

                                        <div className="text-sm text-gray-600">
                                            <strong>Ngày mở:</strong> {moment(selectedLog.unboxedAt).format("DD/MM/YYYY HH:mm")}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <strong>Lí do:</strong> <ReactMarkdown>{selectedLog.reason}</ReactMarkdown>
                                        </div>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}