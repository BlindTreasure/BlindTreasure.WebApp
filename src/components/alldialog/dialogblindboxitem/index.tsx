import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RarityText } from "@/const/products";
import { BlindBoxItem } from "@/services/blindboxes/typings";

type Props = {
  item: BlindBoxItem | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function BlindboxItemDetailDialog({ item, isOpen, onClose }: Props) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chi tiết sản phẩm</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <img src={item.imageUrl} alt={item.productName} className="w-full h-48 object-cover rounded" />
          <div><strong>Tên:</strong> {item.productName}</div>
          <div><strong>Số lượng:</strong> {item.quantity}</div>
          <div><strong>Tỷ lệ rơi:</strong> {item.dropRate}%</div>
          <div>
            <strong>Độ hiếm:</strong>{" "}
            <span className={`px-2 py-1 rounded text-xs font-medium ${item.rarity === "Secret"
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-100 text-gray-700"
              }`}>
              {RarityText[item.rarity]}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
