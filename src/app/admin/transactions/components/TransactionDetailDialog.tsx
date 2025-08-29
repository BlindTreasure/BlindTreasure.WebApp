import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StripeTransaction } from "@/services/admin/typings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PayoutStatus, PayoutStatusText, PeriodType, PeriodTypeText } from "@/const/payout";

interface TransactionDetailDialogProps {
  transaction: StripeTransaction | null;
  isPending: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => {
  if (value === null || value === undefined) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100">
      <span className="font-semibold text-gray-600 dark:text-gray-400">{label}:</span>
      <span className="col-span-2 break-words dark:text-gray-200">{value}</span>
    </div>
  );
};


export default function TransactionDetailDialog({
  transaction,
  isPending,
  open,
  onOpenChange,
}: TransactionDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chi tiết giao dịch</DialogTitle>
          <DialogDescription>
            Xem chi tiết thông tin về giao dịch Stripe.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 flex-grow overflow-y-auto pr-4">
          {isPending ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
            </div>
          ) : transaction ? (
            <div className="space-y-4 text-sm">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Thông tin chính</CardTitle>
                </CardHeader>
                <CardContent>
                  <DetailRow label="Mã giao dịch" value={transaction.id} />
                  <DetailRow label="Mã thanh toán" value={transaction.payoutId} />
                  <DetailRow label="Mã chuyển Stripe" value={transaction.stripeTransferId} />
                  <DetailRow label="Mã giao dịch số dư Stripe" value={transaction.stripeBalanceTransactionId} />
                  <DetailRow label="Người bán" value={`${transaction.sellerName}`} />
                  <DetailRow label="Tài khoản Stripe" value={transaction.stripeDestinationAccount} />
                  <DetailRow label="Số tiền" value={<span className="font-bold text-green-600">{transaction.amount.toLocaleString('vi-VN')} {transaction.currency.toUpperCase()}</span>} />
                  <DetailRow
                    label="Trạng thái"
                    value={
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${transaction.status?.toLowerCase() === "succeed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {transaction.status?.toLowerCase() === "succeed" ? "Thành công" : "Thất bại"}
                      </span>
                    }
                  />
                  <DetailRow label="Ngày chuyển" value={new Date(transaction.transferredAt).toLocaleString('vi-VN')} />
                  <DetailRow label="Người khởi tạo" value={`${transaction.initiatedByName}`} />
                  <DetailRow label="Mã tham chiếu ngoài" value={transaction.externalRef} />
                  <DetailRow label="Mã lô" value={transaction.batchId} />
                  <DetailRow label="Mô tả" value={transaction.description} />
                  {transaction.failureReason && <DetailRow label="Lý do thất bại" value={<span className="text-red-600">{transaction.failureReason}</span>} />}
                </CardContent>
              </Card>

              {transaction.payout && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="payout-details">
                    <AccordionTrigger>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Info size={18} /> Chi tiết thanh toán
                      </h3>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Card className="mt-2">
                        <CardContent className="pt-4">
                          {transaction.payout.id && (
                            <DetailRow label="Mã thanh toán" value={transaction.payout.id} />
                          )}

                          {transaction.payout.periodStart && transaction.payout.periodEnd && (
                            <DetailRow
                              label="Kỳ"
                              value={`${new Date(transaction.payout.periodStart).toLocaleDateString("vi-VN")} - ${new Date(transaction.payout.periodEnd).toLocaleDateString("vi-VN")}`}
                            />
                          )}

                          {transaction.payout.periodType && (
                            <DetailRow
                              label="Loại kỳ"
                              value={PeriodTypeText[transaction.payout.periodType as PeriodType] || transaction.payout.periodType}
                            />
                          )}

                          {transaction.payout.grossAmount !== null && (
                            <DetailRow
                              label="Tổng gộp"
                              value={`${transaction.payout.grossAmount.toLocaleString("vi-VN")}₫`}
                            />
                          )}

                          {transaction.payout.platformFeeAmount !== null && (
                            <DetailRow
                              label="Phí nền tảng"
                              value={`${transaction.payout.platformFeeAmount.toLocaleString("vi-VN")}₫`}
                            />
                          )}

                          {transaction.payout.netAmount !== null && (
                            <DetailRow
                              label="Thực nhận"
                              value={
                                <span className="font-bold text-green-600">
                                  {transaction.payout.netAmount.toLocaleString("vi-VN")}₫
                                </span>
                              }
                            />
                          )}

                          {transaction.payout.status && (
                            <DetailRow
                              label="Trạng thái thanh toán"
                              value={PayoutStatusText[transaction.payout.status as PayoutStatus] || transaction.payout.status}
                            />
                          )}

                          {transaction.payout.createdAt && (
                            <DetailRow
                              label="Ngày tạo"
                              value={new Date(transaction.payout.createdAt).toLocaleString("vi-VN")}
                            />
                          )}

                          {transaction.payout.processedAt && (
                            <DetailRow
                              label="Ngày xử lý"
                              value={new Date(transaction.payout.processedAt).toLocaleString("vi-VN")}
                            />
                          )}

                          {transaction.payout.completedAt && (
                            <DetailRow
                              label="Ngày hoàn thành"
                              value={new Date(transaction.payout.completedAt).toLocaleString("vi-VN")}
                            />
                          )}

                          {transaction.payout.retryCount !== null &&
                            transaction.payout.retryCount !== undefined && (
                              <DetailRow
                                label="Số lần thử lại"
                                value={transaction.payout.retryCount}
                              />
                            )}
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          ) : (
            <p>Không tìm thấy thông tin chi tiết cho giao dịch này.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
