'use client'
import React, { useEffect, useState } from 'react'
import { useGetLoginLink, useGetOnboardingLink, useVerifySellerAccount } from '../hooks/useCreateAccountStripe';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useSellerProfile from "@/app/seller/profile/hooks/useSellerProfile";
import { useServiceCalculateUpcoming, useServiceRequestPayout } from '@/services/payout/services';
import useToast from '@/hooks/use-toast';

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

  useEffect(() => {
    if (sellerStripeAccountId) {
      verifyMutation.mutate({ sellerStripeAccountId });
    }
  }, [sellerStripeAccountId]);

  const isVerified = verifyMutation.data?.value?.data === true;

  const handleVerify = () => {
    onboardingMutation.mutate(undefined, {
      onSuccess: (data) => {
        const url = data?.value?.data;
        if (url) {
          window.open(url, "_blank");
        }
      },
    });
  };

  const handleLoginStripe = () => {
    loginMutation.mutate(undefined, {
      onSuccess: (data) => {
        const url = data?.value?.data;
        if (url) {
          window.open(url, "_blank");
        }
      },
    });
  };

  const handleWithdraw = () => {
    requestPayoutMutation.mutate(undefined, {
      onSuccess: () => {
        setShowSuccessMessage(true);
      },
    })
  };

  const canPayout = payoutData?.value.data?.canPayout ?? false;
  const payoutBlockReason = payoutData?.value.data?.payoutBlockReason;

  const renderContent = () => {
    if (isPayoutLoading) {
      return <p>Loading...</p>;
    }

    if (showSuccessMessage) {
      return <p className="text-green-600">Yêu cầu rút tiền của bạn đã được gửi đi và đang được xử lý.</p>;
    }

    if (isError || !payoutData?.value.data) {
      return <p>Hiện tại không có khoản thanh toán nào sắp tới.</p>;
    }

    // return (
    //     <div className="flex flex-col gap-4 items-center">
    //       <p className="text-green-600">Yêu cầu rút tiền của bạn đã được gửi đi và đang được xử lý.</p>
    //       <Button
    //         onClick={async () => await exportHistoryApi()}
    //         disabled={isExportPending}
    //         className="mt-2"
    //       >
    //         Xuất file lịch sử giao dịch
    //       </Button>
    //     </div>
    //   );

    return (
      <div className="flex flex-col gap-4">
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
        <div className="flex items-center gap-2 mt-4">
          <span>Trạng thái tài khoản Stripe:</span>
          {isVerified ? (
            <Badge className='bg-green-500 hover:bg-opacity-80'>Đã xác minh</Badge>
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
          <Button onClick={handleWithdraw} disabled={!isVerified || !canPayout || requestPayoutMutation.isPending}>
            Rút tiền
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Ví của bạn</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}

