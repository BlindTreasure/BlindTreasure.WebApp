import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface MarketplaceGuideDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  forceShow?: boolean; // Để force show dialog khi click icon
}

export default function MarketplaceGuideDialog({ 
  open, 
  onOpenChange, 
  forceShow = false 
}: MarketplaceGuideDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Check localStorage only on mount, not on every render
  useEffect(() => {
    if (!forceShow) {
      const shouldShow = localStorage.getItem("hideMarketplaceGuide");
      if (!shouldShow) {
        setIsOpen(true);
      }
    }
  }, [forceShow]);

  // Handle external control
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleClose = () => {
    if (dontShowAgain && !forceShow) {
      localStorage.setItem("hideMarketplaceGuide", "true");
    }
    setIsOpen(false);
    onOpenChange?.(false);
    // Reset checkbox state when closing
    setDontShowAgain(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>🏪 Chào mừng đến với Marketplace!</DialogTitle>
          <DialogDescription>
            Marketplace là nơi bạn có thể <b>bán hoặc trao đổi</b> sản phẩm đã mở từ Blind Box với người chơi khác.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-1">1. Tạo bài niêm yết mới</h3>
            <ul className="list-disc list-inside">
              <li>Nhấn <b>"Tạo bài niêm yết mới"</b></li>
              <li>Chọn sản phẩm từ kho cá nhân</li>
              <li>Viết mô tả, có thể bật cho phép trao đổi</li>
              <li>Nhấn <b>"Đăng tin"</b> để công khai sản phẩm</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-1">2. Gửi yêu cầu trao đổi</h3>
            <ul className="list-disc list-inside">
              <li>Chọn sản phẩm mong muốn, nhấn <b>"Yêu cầu trao đổi"</b></li>
              <li>Đợi người đăng <b>chấp nhận yêu cầu</b></li>
              <li>Hai bên cùng <b>Khoá sản phẩm</b> trong vòng 10 phút để hoàn tất giao dịch</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-1">📂 Các mục cần biết</h3>
            <ul className="list-disc list-inside">
              <li><b>Đang trao đổi:</b> Yêu cầu chưa được chấp nhận</li>
              <li><b>Lịch sử giao dịch:</b> Giao dịch đã hoàn tất thành công</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-1">🤔 Mẹo nhỏ</h3>
            <ul className="list-disc list-inside">
              <li>Dùng bộ lọc như <b>Miễn phí</b>, <b>Trao đổi</b>, <b>Đang bán</b> để lọc sản phẩm</li>
              <li>Luôn đọc kỹ mô tả sản phẩm trước khi trao đổi</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between pt-4">
          {!forceShow && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hide-guide" 
                checked={dontShowAgain} 
                onCheckedChange={(checked) => setDontShowAgain(!!checked)} 
              />
              <label htmlFor="hide-guide" className="text-sm">Không hiển thị lại lần sau</label>
            </div>
          )}
          <Button onClick={handleClose}>Tôi đã hiểu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}