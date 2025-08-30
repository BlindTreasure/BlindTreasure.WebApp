"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface ConfirmTimeoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  tradeRequestId: string;
}

export function ConfirmTimeoutDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  tradeRequestId,
}: ConfirmTimeoutDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Xác nhận hết hạn yêu cầu
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn thiết lập hết hạn cho yêu cầu trao đổi{" "}
            <span className="font-medium">{tradeRequestId}</span>? Thao tác này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy bỏ
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm} 
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận hết hạn"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
