"use client";

import React, { useEffect, useState } from "react";
import {
  PayoutHistoryItem,
  PayoutHistoryResponse,
} from "@/services/admin/typings";
import { PayoutStatus, PayoutStatusText } from "@/const/payout";
import useGetPayouts from "../hooks/useGetPayouts";
import { PaginationFooter } from "@/components/pagination-footer";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdminSellerList } from "@/app/admin/orders/hooks/useAdminSellerList";
import { useServiceProcessPayout } from "@/services/payout/services";
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import UploadProofDialog from "./UploadProofDialog";
import ProofImageGrid from "./ProofImageGrid";
import { SlRefresh } from "react-icons/sl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
export default function Payouts() {
  const { isPending, getPayoutsApi } = useGetPayouts();
  const { mutate: approvePayout, isPending: isApproving } = useServiceProcessPayout();
  const [data, setData] = useState<PayoutHistoryItem[]>([]);

  const [paging, setPaging] = useState({
    pageIndex: 1,
    pageSize: 5,
    totalPages: 0,
    totalItems: 0,
  });

  const [status, setStatus] = useState<PayoutStatus | string>("all");
  const [sellerId, setSellerId] = useState("all");
  const [periodStart, setPeriodStart] = useState<string>("");
  const [periodEnd, setPeriodEnd] = useState<string>("");
  const { data: sellers = [], isLoading: isLoadingSellers } = useAdminSellerList(1, 50);

  const toISODate = (d: string, isEnd = false) => {
    if (!d) return "";
    return isEnd ? new Date(d + 'T23:59:59').toISOString() : new Date(d + 'T00:00:00').toISOString();
  };

  const fetchData = async () => {
    const res = await getPayoutsApi({
      status: status !== "all" ? (status as PayoutStatus) : undefined,
      SellerId: sellerId !== "all" ? sellerId : undefined,
      PeriodStart: toISODate(periodStart),
      PeriodEnd: toISODate(periodEnd, true),
      PageIndex: paging.pageIndex,
      PageSize: paging.pageSize,
    });

    if (res) {
      const response = res.value.data as PayoutHistoryResponse;
      setData(response.result);
      setPaging((prev) => ({
        ...prev,
        totalPages: response.totalPages,
        totalItems: response.count,
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [status, sellerId, periodStart, periodEnd, paging.pageIndex, paging.pageSize]);

  const handlePageChange = (page: number) => {
    setPaging((prev) => ({ ...prev, pageIndex: page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPaging((prev) => ({ ...prev, pageSize: size, pageIndex: 1 }));
  };

  return (
    <div className="p-4">
      <Card className="shadow-lg rounded-lg border border-gray-200">
        <CardContent className="space-y-6 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold pt-4">Lịch sử thanh toán</h2>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap gap-4 items-center">
                <Button className='bg-green-500 hover:bg-opacity-80' onClick={fetchData}><SlRefresh />Làm mới</Button>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Trạng thái thanh toán" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    {Object.values(PayoutStatus).map((s) => (
                      <SelectItem key={s} value={s}>{PayoutStatusText[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sellerId} onValueChange={setSellerId}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Chọn seller" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả người bán</SelectItem>
                    {sellers.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-2 items-center">
                  <span className="text-gray-500 text-sm">Từ</span>
                  <Input type="date" value={periodStart} onChange={e => setPeriodStart(e.target.value)} className="w-36" />
                  <span className="text-gray-500 text-sm">đến</span>
                  <Input type="date" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)} className="w-36" />
                </div>

              </div>
            </div>
          </div>
          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-full dark:bg-gray-900 table-fixed border border-gray-200 text-sm bg-white rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-center dark:bg-gray-800">
                  <th className="p-3 border w-40">Người bán</th>
                  <th className="p-3 border w-56">Giai đoạn</th>
                  <th className="p-3 border w-32">Tổng</th>
                  <th className="p-3 border w-32">Thực nhận</th>
                  <th className="p-3 border w-32">Phí</th>
                  <th className="p-3 border w-24">Trạng thái</th>
                  <th className="p-3 border w-24">Ngày tạo</th>
                  <th className="p-3 border w-40">Ảnh minh chứng</th>
                  <th className="p-3 border w-32">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {isPending ? (
                  <tr>
                    <td colSpan={9} className="text-center p-4">
                      Đang tải...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center p-4">
                      <img
                        src="https://static.vecteezy.com/system/resources/previews/009/007/126/non_2x/document-file-not-found-search-no-result-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
                        alt="Lịch sử trống"
                        className="mx-auto mb-2 w-24 h-24"
                      />
                      <div>Không có yêu cầu nào</div>
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-opacity-80 dark:hover:text-black">
                      <td
                        className="p-3 border text-center max-w-[10px] truncate"
                        title={item.sellerName}
                      >
                        {item.sellerName}
                      </td>
                      <td className="p-3 border text-center">
                        {new Date(item.periodStart).toLocaleDateString('vi-VN')} → {new Date(item.periodEnd).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="p-3 border text-center">{item.grossAmount.toLocaleString('vi-VN')}₫</td>
                      <td className="p-3 border text-center">{item.netAmount.toLocaleString('vi-VN')}₫</td>
                      <td className="p-3 border text-center">{item.platformFeeAmount.toLocaleString('vi-VN')}₫</td>
                      <td className="p-3 border text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium
      ${item.status === PayoutStatus.COMPLETED
                              ? "bg-green-100 text-green-700"
                              : item.status === PayoutStatus.FAILED
                                ? "bg-red-100 text-red-700"
                                : item.status === PayoutStatus.CANCELLED
                                  ? "bg-gray-100 text-gray-700"
                                  : item.status === PayoutStatus.PENDING
                                    ? "bg-yellow-100 text-yellow-700"
                                    : item.status === PayoutStatus.REQUESTED
                                      ? "bg-blue-100 text-blue-700"
                                      : item.status === PayoutStatus.PROCESSING
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-gray-200 text-gray-600"}
    `}
                          style={{
                            maxWidth: '100px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'inline-block',
                            cursor: 'default',
                          }}
                          title={PayoutStatusText[item.status as PayoutStatus] ?? item.status}
                        >
                          {PayoutStatusText[item.status as PayoutStatus] ?? item.status}
                        </span>
                      </td>
                      <td className="p-3 border text-center">
                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                      </td>

                      <td className="p-3 border text-center">
                        <div className="flex flex-col items-center gap-2">
                          {![PayoutStatus.PENDING, PayoutStatus.REQUESTED].includes(item.status) && (
                            <>
                              {item.proofImageUrls && item.proofImageUrls.length > 0 ? (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <img
                                      src={item.proofImageUrls[0]}
                                      alt="Proof"
                                      className="rounded-md cursor-pointer object-cover w-16 h-16"
                                    />
                                  </DialogTrigger>

                                  <DialogContent
                                    className="max-w-4xl"
                                    onInteractOutside={(e) => e.preventDefault()}
                                  >
                                    <DialogHeader>
                                      <DialogTitle>Ảnh minh chứng thanh toán</DialogTitle>
                                    </DialogHeader>
                                    <ProofImageGrid images={item.proofImageUrls} />
                                  </DialogContent>
                                </Dialog>
                              ) : (
                                <span className="text-gray-400 text-sm">Chưa có ảnh</span>
                              )}

                              <UploadProofDialog payoutId={item.id} onUploaded={fetchData} />
                            </>
                          )}
                        </div>
                      </td>

                      {/* <td className="p-3 border text-center">
                        {item.status === PayoutStatus.REQUESTED ? (
                          <Button
                            size="sm"
                            onClick={() => approvePayout(item.sellerId, {
                              onSuccess: () => fetchData(),
                            })}
                            disabled={isApproving}
                            className="bg-green-500 hover:bg-opacity-80"
                          >
                            {isApproving ? "Đang duyệt..." : "Duyệt"}
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td> */}

                      {/* <td className="p-3 border text-center">
                        {item.status === PayoutStatus.REQUESTED ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isApproving}
                            onClick={() =>
                              approvePayout(item.sellerId, {
                                onSuccess: () => fetchData(),
                              })
                            }
                          >
                            {isApproving ? "Đang duyệt..." : "Duyệt"}
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td> */}
                      <td className="p-3 border text-center">
                        {item.status === PayoutStatus.REQUESTED ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isApproving}
                              >
                                {isApproving ? "Đang duyệt..." : "Duyệt"}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận duyệt thanh toán</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bạn có chắc chắn muốn duyệt yêu cầu thanh toán cho seller{" "}
                                  <b>{item.sellerId}</b> không?
                                  Hành động này sẽ tiến hành giải ngân và không thể hoàn tác.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    approvePayout(item.sellerId, {
                                      onSuccess: () => fetchData(),
                                    })
                                  }
                                  disabled={isApproving}
                                >
                                  {isApproving ? "Đang duyệt..." : "Xác nhận"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
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