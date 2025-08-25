'use client'
import React, { useEffect, useState } from 'react'
import { useGetLoginLink, useGetOnboardingLink, useVerifySellerAccount } from '../hooks/useCreateAccountStripe';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useSellerProfile from "@/app/seller/profile/hooks/useSellerProfile";
import { useServiceCalculateUpcoming, useServiceRequestPayout } from '@/services/payout/services';
import useToast from '@/hooks/use-toast';
import useGetPayoutSeller from '../hooks/useGetPayoutSeller';
import { PayoutHistoryItem, PayoutHistoryResponse } from '@/services/payout/typings';
import useExportHistory from '../hooks/useExportHistory';
import { PayoutStatus, PayoutStatusText, PeriodType, PeriodTypeText } from '@/const/payout';
import { PaginationFooter } from '@/components/pagination-footer';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import useGetPayoutId from '../hooks/useGetPayoutId';
import { Clipboard, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { BsEye } from 'react-icons/bs';
import ProofImageGrid from '@/app/admin/payouts/components/ProofImageGrid';

export default function Wallet() {
  const { data: payoutData, isLoading: isPayoutLoading, isError } = useServiceCalculateUpcoming();
  const requestPayoutMutation = useServiceRequestPayout();
  const { addToast } = useToast();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const onboardingMutation = useGetOnboardingLink();
  const loginMutation = useGetLoginLink();
  const verifyMutation = useVerifySellerAccount();

  const { seller } = useSellerProfile();
  const sellerStripeAccountId = seller?.stripeAccountId;

  const { getPayoutSellerApi, isPending: isHistoryLoading } = useGetPayoutSeller();
  const [history, setHistory] = useState<PayoutHistoryItem[]>([]);

  const { exportApi, isPending: isExporting } = useExportHistory();

  const [payoutDetail, setPayoutDetail] = useState<PayoutHistoryItem | null>(null);
  const { isPending, getPayoutIdApi } = useGetPayoutId();
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedPayoutId, setSelectedPayoutId] = useState<string | null>(null);

  const [status, setStatus] = useState<PayoutStatus | string>("all");
  const [periodStart, setPeriodStart] = useState<string>("");
  const [periodEnd, setPeriodEnd] = useState<string>("");
  const [paging, setPaging] = useState({
    pageIndex: 1,
    pageSize: 5,
    totalPages: 0,
    totalItems: 0,
  });

  useEffect(() => {
    if (sellerStripeAccountId) {
      verifyMutation.mutate({ sellerStripeAccountId });
    }
  }, [sellerStripeAccountId]);

  const toISODate = (d: string, isEnd = false) => {
    if (!d) return "";
    return isEnd ? new Date(d + 'T23:59:59').toISOString() : new Date(d + 'T00:00:00').toISOString();
  };
  const fetchHistory = async () => {
    const res = await getPayoutSellerApi({
      status: status !== "all" ? (status as PayoutStatus) : undefined,
      PeriodStart: toISODate(periodStart),
      PeriodEnd: toISODate(periodEnd, true),
      PageIndex: paging.pageIndex,
      PageSize: paging.pageSize,
    });

    if (res) {
      const response = res.value.data as PayoutHistoryResponse;
      setHistory(response.result);
      setPaging((prev) => ({
        ...prev,
        totalPages: response.totalPages,
        totalItems: response.count,
      }));
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [status, periodStart, periodEnd, paging.pageIndex, paging.pageSize]);

  // useEffect(() => {
  //   if (!payoutId) return;

  //   (async () => {
  //     const res = await getPayoutIdApi(payoutId);
  //     if (res?.value?.data) setData(res.value.data);
  //   })();
  // }, [payoutId]);

  useEffect(() => {
    if (!selectedPayoutId) return;
    const fetchDetail = async () => {
      const res = await getPayoutIdApi(selectedPayoutId);
      if (res && res.value && res.value.data) {
        setPayoutDetail(res.value.data);
      } else {
        setPayoutDetail(null);
      }
    };
    fetchDetail();
  }, [selectedPayoutId]);

  const isVerified = verifyMutation.data?.value?.data === true;

  const handleVerify = () => {
    onboardingMutation.mutate(undefined, {
      onSuccess: (data) => {
        const url = data?.value?.data;
        if (url) window.open(url, "_blank");
      },
    });
  };

  const handleLoginStripe = () => {
    loginMutation.mutate(undefined, {
      onSuccess: (data) => {
        const url = data?.value?.data;
        if (url) window.open(url, "_blank");
      },
    });
  };

  const handleWithdraw = () => {
    requestPayoutMutation.mutate(undefined, {
      onSuccess: () => {
        setShowSuccessMessage(true);
        fetchHistory();
      },
    });
  };

  const handleExport = async () => {
    const blob = await exportApi();
    if (blob) {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "payout-history.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > paging.totalPages) return;
    setPaging((prev) => ({ ...prev, pageIndex: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPaging((prev) => ({ ...prev, pageSize: newSize, pageIndex: 1 }));
  };

  const canPayout = payoutData?.value.data?.canPayout ?? false;
  const payoutBlockReason = payoutData?.value.data?.payoutBlockReason;

  return (
    <div className="py-8 space-y-6">
      <div className='max-w-2xl mx-auto'>
        <Card>
          <CardHeader>
            <CardTitle>Ví của bạn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPayoutLoading ? (
              <p>Loading...</p>
            ) : isError || !payoutData?.value.data ? (
              <p>Hiện tại không có khoản thanh toán nào sắp tới.</p>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Số dư khả dụng</span>
                  <span className="text-lg font-bold text-green-600">
                    {`${payoutData.value.data.netAmount.toLocaleString()} đ`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tổng doanh thu</span>
                  <span className="text-lg font-bold">
                    {`${payoutData.value.data.grossAmount.toLocaleString()} đ`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tổng số đơn hàng</span>
                  <span className="text-lg font-bold">
                    {payoutData.value.data.totalOrders}
                  </span>
                </div>
              </>
            )}

            <div className="flex items-center gap-2">
              <span>Trạng thái tài khoản Stripe:</span>
              {isVerified ? (
                <span className="px-2 py-1 rounded text-xs font-medium bg-green-500 text-white">
                  Đã xác minh
                </span>
              ) : (
                <span className="px-2 py-1 rounded text-xs font-medium bg-red-500 text-white">
                  Chưa xác minh
                </span>
              )}
            </div>

            {payoutBlockReason && (
              <div className="text-red-500 text-sm">
                Lý do không thể rút tiền: {payoutBlockReason}
              </div>
            )}

            <div className="flex gap-2 mt-2">
              {!isVerified && (
                <Button onClick={handleVerify} disabled={onboardingMutation.isPending}>
                  Xác minh tài khoản Stripe
                </Button>
              )}
              {isVerified && (
                <Button onClick={handleLoginStripe} disabled={loginMutation.isPending}>
                  Đăng nhập Stripe
                </Button>
              )}
              <Button
                onClick={handleWithdraw}
                disabled={!isVerified || !canPayout || requestPayoutMutation.isPending}
              >
                Rút tiền
              </Button>
            </div>

            {showSuccessMessage && (
              <p className="text-green-600">
                Yêu cầu rút tiền của bạn đã được gửi đi và đang được xử lý.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <div className='flex justify-between items-center mb-4'>
            <h2 className="text-xl font-semibold pt-4">Lịch sử thanh toán</h2>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4 mt-4">
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

                <div className="flex gap-2 items-center">
                  <span className="text-gray-500 text-sm">Từ</span>
                  <Input type="date" value={periodStart} onChange={e => setPeriodStart(e.target.value)} className="w-1/2 date-icon-black dark:date-icon-white" />
                  <span className="text-gray-500 text-sm">Đến</span>
                  <Input type="date" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)} className="w-1/2 date-icon-black dark:date-icon-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="p-2 border">Người bán</th>
                  <th className="p-2 border">Kỳ hạn</th>
                  <th className="p-2 border">Tổng</th>
                  <th className="p-2 border">Phí nền tảng</th>
                  <th className="p-2 border">Thực nhận</th>
                  <th className="p-2 border">Trạng thái</th>
                  <th className="p-2 border">Hành động</th>
                  <th className="p-2 border">Xem ảnh giao dịch</th>
                  <th className="p-2 border">Xem chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {isHistoryLoading ? (
                  <tr>
                    <td colSpan={9} className="text-center p-4">
                      Đang tải...
                    </td>
                  </tr>
                ) : !history || history.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center p-4">
                      <img
                        src="https://static.vecteezy.com/system/resources/previews/009/007/135/non_2x/desert-landscape-404-error-page-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
                        alt="Lịch sử trống"
                        className="mx-auto mb-2 w-24 h-24"
                      />
                      <div>Chưa có lịch sử rút tiền</div>
                    </td>
                  </tr>
                ) : (
                  history.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2 border text-center">{item.sellerName}</td>
                      <td className="p-2 border text-center">
                        {new Date(item.periodStart).toLocaleDateString("vi-VN")} -{" "}
                        {new Date(item.periodEnd).toLocaleDateString("vi-VN")} (
                        {PeriodTypeText[item.periodType as PeriodType] ?? item.periodType})
                      </td>
                      <td className="p-2 border text-center">{item.grossAmount.toLocaleString()} đ</td>
                      <td className="p-2 border text-center">{item.platformFeeAmount.toLocaleString()} đ</td>
                      <td className="p-2 border font-semibold text-green-600 text-center">
                        {item.netAmount.toLocaleString()} đ
                      </td>
                      <td className="p-2 border text-center">
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
                            maxWidth: "120px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "inline-block",
                            cursor: "default",
                          }}
                          title={PayoutStatusText[item.status as PayoutStatus] ?? item.status}
                        >
                          {PayoutStatusText[item.status as PayoutStatus] ?? item.status}
                        </span>
                      </td>
                      <td className="p-2 border text-center">
                        {item.status !== PayoutStatus.PENDING && item.status !== PayoutStatus.REQUESTED && (
                          <Button
                            className='bg-green-500 hover:bg-opacity-80'
                            size="sm"
                            onClick={handleExport}
                            disabled={isExporting}
                          >
                            {isExporting ? "Đang xuất..." : "Xuất file"}
                          </Button>
                        )}
                      </td>

                      <td className="p-3 border text-center">
                        <div className="flex flex-col items-center gap-2">
                          {item.proofImageUrls && item.proofImageUrls.length > 0 ? (
                            <>
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
                            </>
                          ) : (
                            <span className="text-gray-400 text-sm">_</span>
                          )}
                        </div>
                      </td>

                      <td className="p-3 border text-center">
                        <Button variant="outline" size="icon" onClick={() => {
                          setSelectedPayoutId(item.id);
                          setOpenDetailDialog(true);
                        }}>
                          <BsEye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <PaginationFooter
              currentPage={paging.pageIndex}
              totalPages={paging.totalPages}
              totalItems={paging.totalItems}
              pageSize={paging.pageSize}
              onPageSizeChange={handlePageSizeChange}
              onPageChange={handlePageChange}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={openDetailDialog}
        onOpenChange={(open) => {
          setOpenDetailDialog(open);
          if (!open) {
            setSelectedPayoutId(null);
            setPayoutDetail(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết</DialogTitle>
          </DialogHeader>

          {isPending ? (
            <div>Đang tải chi tiết...</div>
          ) : payoutDetail ? (
            <div className="space-y-6 text-sm mt-2">
              <div className="border rounded p-3 bg-white dark:bg-gray-900">
                <div className="font-semibold mb-4">📝 Thông tin</div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div>
                    <div className="flex gap-2">
                      <span className='font-semibold'>Người bán:</span>
                      <span>{payoutDetail.sellerName}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className='font-semibold'>Email:</span>
                      <span>{payoutDetail.sellerEmail}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className='font-semibold'>Kỳ hạn:</span>
                      <span>
                        {new Date(payoutDetail.periodStart).toLocaleDateString("vi-VN")} -{" "}
                        {new Date(payoutDetail.periodEnd).toLocaleDateString("vi-VN")} (
                        {PeriodTypeText[payoutDetail.periodType as PeriodType] ?? payoutDetail.periodType})
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className='font-semibold'>Tổng:</span>
                      <span>{payoutDetail.grossAmount.toLocaleString()} đ</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex gap-2">
                      <span className='font-semibold'>Phí nền tảng:</span>
                      <span>{payoutDetail.platformFeeAmount.toLocaleString()} đ</span>
                    </div>
                    <div className="flex gap-2 font-semibold text-green-600">
                      <span className='font-semibold'>Thực nhận:</span>
                      <span>{payoutDetail.netAmount.toLocaleString()} đ</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className='font-semibold'>Trạng thái:</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium
       ${payoutDetail.status === PayoutStatus.COMPLETED
                            ? "bg-green-100 text-green-700"
                            : payoutDetail.status === PayoutStatus.FAILED
                              ? "bg-red-100 text-red-700"
                              : payoutDetail.status === PayoutStatus.CANCELLED
                                ? "bg-gray-100 text-gray-700"
                                : payoutDetail.status === PayoutStatus.PENDING
                                  ? "bg-yellow-100 text-yellow-700"
                                  : payoutDetail.status === PayoutStatus.REQUESTED
                                    ? "bg-blue-100 text-blue-700"
                                    : payoutDetail.status === PayoutStatus.PROCESSING
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-gray-200 text-gray-600"}
    `}
                        style={{
                          maxWidth: "100px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          display: "inline-block",
                          cursor: "default",
                        }}
                        title={PayoutStatusText[payoutDetail.status as PayoutStatus] ?? payoutDetail.status}
                      >
                        {PayoutStatusText[payoutDetail.status as PayoutStatus] ?? payoutDetail.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className='font-semibold'>Ngày tạo:</span>
                      <span>{new Date(payoutDetail.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className='font-semibold'>Ngày xử lý:</span>
                      <span>{payoutDetail.processedAt ? new Date(payoutDetail.processedAt).toLocaleDateString("vi-VN") : "-"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {payoutDetail.payoutDetails && payoutDetail.payoutDetails.length > 0 && (
                <div className="border rounded p-3 bg-white dark:bg-gray-900">
                  <div className="font-semibold mb-2">💰 Chi tiết đơn hàng</div>
                  <table className="w-full text-sm border-t border-gray-200">
                    <thead>
                      <tr className="text-left border-b bg-gray-100 dark:bg-gray-800">
                        <th className="p-2">Mã đơn</th>
                        <th className="p-2 text-center">SL</th>
                        <th className="p-2 text-right">Giá gốc</th>
                        <th className="p-2 text-right">Giảm giá</th>
                        <th className="p-2 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payoutDetail.payoutDetails.map((d) => (
                        <tr key={d.orderDetailId} className="border-b">
                          <td className="p-3"><div
                            className="flex items-center gap-2 cursor-pointer group"
                            onClick={() => navigator.clipboard.writeText(payoutDetail.id)}
                          >
                            <span>#{payoutDetail.id.substring(0, 8).toUpperCase()}...</span>
                            <Clipboard size={14} className="text-gray-400 group-hover:text-gray-600 dark:hover:text-black" />
                          </div></td>
                          <td className="p-2 text-center">{d.quantity}</td>
                          <td className="p-2 text-right">{d.originalAmount.toLocaleString()} đ</td>
                          <td className="p-2 text-right">{d.discountAmount.toLocaleString()} đ</td>
                          <td className="p-2 text-right">{d.finalAmount.toLocaleString()} đ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {payoutDetail.payoutLogs && payoutDetail.payoutLogs.length > 0 && (
                <div className="border rounded p-3 bg-white dark:bg-gray-900">
                  <div className="font-semibold mb-2">📝 Lịch sử trạng thái rút tiền</div>
                  <table className="w-full text-sm border-t border-gray-200">
                    <thead>
                      <tr className="text-left border-b bg-gray-100 dark:bg-gray-800">
                        <th
                          className="p-2 max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap"
                          title="Thời gian"
                        >
                          Thời gian
                        </th>
                        <th
                          className="p-2 max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap"
                          title="Từ trạng thái"
                        >
                          Từ trạng thái
                        </th>
                        <th
                          className="p-2 max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap"
                          title="Đến trạng thái"
                        >
                          Đến trạng thái
                        </th>
                        <th
                          className="p-2 max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap"
                          title="Hành động"
                        >
                          Hành động
                        </th>
                        <th
                          className="p-2 max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap"
                          title="Người thực hiện"
                        >
                          Người thực hiện
                        </th>
                        <th
                          className="p-2 max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap"
                          title="Chi tiết"
                        >
                          Chi tiết
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {payoutDetail.payoutLogs.map((log) => (
                        <tr key={log.id} className="border-b">
                          <td
                            className="p-2 max-w-[80px] truncate"
                            title={new Date(log.loggedAt).toLocaleString("vi-VN")}
                          >
                            {new Date(log.loggedAt).toLocaleString("vi-VN")}
                          </td>

                          <td className="p-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium
            ${log.fromStatus === PayoutStatus.COMPLETED
                                  ? "bg-green-500 text-white"
                                  : log.fromStatus === PayoutStatus.FAILED
                                    ? "bg-red-500 text-white"
                                    : log.fromStatus === PayoutStatus.CANCELLED
                                      ? "bg-gray-400 text-white"
                                      : log.fromStatus === PayoutStatus.PENDING
                                        ? "bg-yellow-500 text-white"
                                        : log.fromStatus === PayoutStatus.REQUESTED
                                          ? "bg-blue-500 text-white"
                                          : log.fromStatus === PayoutStatus.PROCESSING
                                            ? "bg-purple-500 text-white"
                                            : "bg-gray-200 text-black"}`}
                              style={{
                                maxWidth: '100px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'inline-block',
                                cursor: 'default',
                              }}
                              title={PayoutStatusText[log.fromStatus as PayoutStatus] ?? log.fromStatus}

                            >
                              {PayoutStatusText[log.fromStatus as PayoutStatus] ?? log.fromStatus}
                            </span>
                          </td>

                          <td className="p-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium
            ${log.toStatus === PayoutStatus.COMPLETED
                                  ? "bg-green-500 text-white"
                                  : log.toStatus === PayoutStatus.FAILED
                                    ? "bg-red-500 text-white"
                                    : log.toStatus === PayoutStatus.CANCELLED
                                      ? "bg-gray-400 text-white"
                                      : log.toStatus === PayoutStatus.PENDING
                                        ? "bg-yellow-500 text-white"
                                        : log.toStatus === PayoutStatus.REQUESTED
                                          ? "bg-blue-500 text-white"
                                          : log.toStatus === PayoutStatus.PROCESSING
                                            ? "bg-purple-500 text-white"
                                            : "bg-gray-200 text-black"}`}
                              title={PayoutStatusText[log.toStatus as PayoutStatus] ?? log.toStatus}
                              style={{
                                maxWidth: '100px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'inline-block',
                                cursor: 'default',
                              }}
                            >
                              {PayoutStatusText[log.toStatus as PayoutStatus] ?? log.toStatus}
                            </span>
                          </td>

                          <td
                            className="p-2 max-w-[80px] truncate"
                            title={log.action}
                          >
                            {log.action}
                          </td>

                          <td
                            className="p-2 max-w-[80px] truncate"
                            title={log.triggeredByUserName || "-"}
                          >
                            {log.triggeredByUserName || "-"}
                          </td>

                          <td
                            className="p-2 max-w-[80px] truncate"
                            title={log.details || log.errorMessage || "-"}
                          >
                            {log.details || log.errorMessage || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              )}
            </div>
          ) : (
            <div>Không có thông tin chi tiết.</div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button>Đóng</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
