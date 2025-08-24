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
                <Badge className="bg-green-500 hover:bg-opacity-80">Đã xác minh</Badge>
              ) : (
                <Badge variant="destructive">Chưa xác minh</Badge>
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
                  <Input type="date" value={periodStart} onChange={e => setPeriodStart(e.target.value)} className="w-36" />
                  <span className="text-gray-500 text-sm">đến</span>
                  <Input type="date" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)} className="w-36" />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Người bán</th>
                  <th className="p-2 border">Kỳ hạn</th>
                  <th className="p-2 border">Tổng</th>
                  <th className="p-2 border">Phí nền tảng</th>
                  <th className="p-2 border">Thực nhận</th>
                  <th className="p-2 border">Trạng thái</th>
                  <th className="p-2 border">Ngày tạo</th>
                  <th className="p-2 border">Ngày xử lý</th>
                  <th className="p-2 border">Hành động</th>
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
                        <Badge
                          className={
                            item.status === PayoutStatus.COMPLETED
                              ? "bg-green-500"
                              : item.status === PayoutStatus.FAILED
                                ? "bg-red-500"
                                : item.status === PayoutStatus.CANCELLED
                                  ? "bg-gray-400"
                                  : item.status === PayoutStatus.PENDING
                                    ? "bg-yellow-500"
                                    : item.status === PayoutStatus.REQUESTED
                                      ? "bg-blue-500"
                                      : item.status === PayoutStatus.PROCESSING
                                        ? "bg-purple-500"
                                        : "bg-gray-200"
                          }
                        >
                          {PayoutStatusText[item.status as PayoutStatus] ?? item.status}
                        </Badge>
                      </td>
                      <td className="p-2 border text-center">
                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="p-2 border text-center">
                        {item.processedAt ? new Date(item.processedAt).toLocaleDateString("vi-VN") : "-"}
                      </td>
                      <td className="p-2 border text-center">
                        {item.status === PayoutStatus.PROCESSING && (
                          <Button
                            className='bg-green-500'
                            size="sm"
                            onClick={handleExport}
                            disabled={isExporting}
                          >
                            {isExporting ? "Đang xuất..." : "Xuất file"}
                          </Button>
                        )}
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
    </div>
  );
}
