"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaginationFooter } from "@/components/pagination-footer";
import { SlRefresh } from "react-icons/sl";
import { Clipboard } from "lucide-react";

import useGetShipmentsByAdmin from "../hooks/useGetShipmentsByAdmin";
import {
    Shipment,
    ShipmentResponse,
    ShipmentsParams,
} from "@/services/admin/typings";
import { ShipmentStatus, ShipmentStatusText } from "@/const/products";
import { CiSearch } from "react-icons/ci";
import { useAdminCompleteShipment } from "@/services/system/services";

export default function Shipments() {
    const completeShipmentMutation = useAdminCompleteShipment();
    const { isPending, getShipmentsByAdminApi } = useGetShipmentsByAdmin();
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [paging, setPaging] = useState({
        pageIndex: 1,
        pageSize: 10,
        totalPages: 1,
        totalItems: 0,
    });

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string>("all");
    const [minFee, setMinFee] = useState<string>("");
    const [maxFee, setMaxFee] = useState<string>("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const toISODate = (d: string, isEnd = false) => {
        if (!d) return "";
        return isEnd
            ? new Date(d + "T23:59:59").toISOString()
            : new Date(d + "T00:00:00").toISOString();
    };

    const numberOrUndef = (v: string) =>
        v.trim() === "" ? undefined : Number(v);

    const statusBadgeClass = (s: ShipmentStatus) => {
        switch (s) {
            case ShipmentStatus.WAITING_PAYMENT:
                return "bg-gray-100 text-gray-700";
            case ShipmentStatus.PROCESSING:
                return "bg-blue-100 text-blue-700";
            case ShipmentStatus.PICKED_UP:
                return "bg-purple-100 text-purple-700";
            case ShipmentStatus.IN_TRANSIT:
                return "bg-yellow-100 text-yellow-700";
            case ShipmentStatus.DELIVERED:
                return "bg-green-100 text-green-700";
            case ShipmentStatus.COMPLETED:
                return "bg-emerald-100 text-emerald-700";
            case ShipmentStatus.CANCELLED:
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const fetchData = async () => {
        const params: ShipmentsParams = {
            pageIndex: paging.pageIndex,
            pageSize: paging.pageSize,
            search: search || undefined,
            status: status !== "all" ? status : undefined, 
            minTotalFee: numberOrUndef(minFee),
            maxTotalFee: numberOrUndef(maxFee),
            fromEstimatedPickupTime: toISODate(dateFrom),
            toEstimatedPickupTime: toISODate(dateTo, true),
        };

        const res = await getShipmentsByAdminApi(params);
        if (res) {
            const data = (res as any).value?.data as ShipmentResponse | any;

            const items: Shipment[] = data?.result ?? [];
            setShipments(items);

            setPaging((prev) => ({
                ...prev,
                totalPages: data?.totalPages ?? prev.totalPages ?? 1,
                totalItems: data?.count ?? items.length ?? prev.totalItems ?? 0,
            }));
        }
    };

    useEffect(() => {
        fetchData();
    }, [
        paging.pageIndex,
        paging.pageSize,
        status,
        search,
        minFee,
        maxFee,
        dateFrom,
        dateTo,
    ]);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > paging.totalPages) return;
        setPaging((prev) => ({ ...prev, pageIndex: newPage }));
    };

    const handlePageSizeChange = (newSize: number) => {
        setPaging((prev) => ({ ...prev, pageSize: newSize, pageIndex: 1 }));
    };

    const formatDateTime = (s?: string) =>
        s ? new Date(s).toLocaleString("vi-VN") : "-";

    const formatCurrency = (n?: number) =>
        (n ?? 0).toLocaleString("vi-VN") + "₫";

    return (
        <div className="p-4">
            <Card className="shadow-lg rounded-lg border border-gray-200">
                <CardContent className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold mb-4 pt-4">
                            Danh sách vận chuyển
                        </h2>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex flex-wrap gap-4 items-center mt-4">
                                <Button
                                    className="bg-green-500 hover:bg-opacity-80"
                                    onClick={fetchData}
                                >
                                    <SlRefresh className="mr-2" />
                                    Làm mới
                                </Button>

                                <div className="relative w-56">
                                    <CiSearch className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4" />
                                    <Input
                                        placeholder="Tìm theo mã đơn"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>

                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="w-52">
                                        <SelectValue placeholder="Trạng thái vận chuyển" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                        {Object.values(ShipmentStatus).map((s) => (
                                            <SelectItem key={s} value={s}>{ShipmentStatusText[s]}</SelectItem>
                                        ))}

                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-fixed border border-gray-200 text-sm bg-white rounded-lg">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-3 border w-36">Mã đơn</th>
                                    <th className="p-3 border w-40">Nhà vận chuyển</th>
                                    <th className="p-3 border w-32">Phí</th>
                                    <th className="p-3 border w-44">Thời gian lấy</th>
                                    <th className="p-3 border w-44">Dự kiến giao</th>
                                    <th className="p-3 border w-36">Trạng thái</th>
                                    <th className="p-3 border w-36">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isPending ? (
                                    <tr>
                                        <td colSpan={7} className="text-center p-4">
                                            Đang tải...
                                        </td>
                                    </tr>
                                ) : shipments.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center p-4">
                                            <img
                                                src="https://static.thenounproject.com/png/empty-box-icon-7507343-512.png"
                                                alt="Empty"
                                                className="mx-auto mb-2 w-24 h-24"
                                            />
                                            <div>Không có vận chuyển nào</div>
                                        </td>
                                    </tr>
                                ) : (
                                    shipments.map((s) => (
                                        <tr key={s.id} className="hover:bg-gray-50">
                                            <td className="p-3 border">
                                                <div
                                                    className="flex items-center gap-2 cursor-pointer group"
                                                    onClick={() => navigator.clipboard.writeText(s.orderCode)}
                                                    title="Sao chép mã đơn"
                                                >
                                                    <span>#{s.orderCode}</span>
                                                    <Clipboard
                                                        size={14}
                                                        className="text-gray-400 group-hover:text-gray-600"
                                                    />
                                                </div>
                                            </td>

                                            <td className="p-3 border">{s.provider || "-"}</td>
                                            <td className="p-3 border">{formatCurrency(s.totalFee)}</td>
                                            <td className="p-3 border">
                                                {formatDateTime(s.estimatedPickupTime || s.pickedUpAt)}
                                            </td>
                                            <td className="p-3 border">
                                                {formatDateTime(s.estimatedDelivery || s.shippedAt)}
                                            </td>
                                            <td className="p-3 border">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-medium ${statusBadgeClass(
                                                        s.status as ShipmentStatus
                                                    )}`}
                                                    title={s.status}
                                                >
                                                    {ShipmentStatusText[s.status as ShipmentStatus] ??
                                                        s.status}
                                                </span>
                                            </td>
                                            <td className="p-3 border text-center">
                                                {s.status === ShipmentStatus.PROCESSING && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={completeShipmentMutation.isPending}
                                                        onClick={() =>
                                                            completeShipmentMutation.mutate(
                                                                { shipmentId: s.id },
                                                                { onSuccess: fetchData }
                                                            )
                                                        }
                                                    >
                                                        Hoàn thành
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <PaginationFooter
                        currentPage={paging.pageIndex}
                        totalPages={paging.totalPages}
                        totalItems={paging.totalItems}
                        pageSize={paging.pageSize}
                        onPageSizeChange={handlePageSizeChange}
                        onPageChange={handlePageChange}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
