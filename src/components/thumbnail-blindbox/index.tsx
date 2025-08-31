"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Rarity } from "@/const/products";

interface Item {
  imageUrl: string;
  productName: string;
  rarity: Rarity;
  dropRate: number;
  quantity: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  items: Item[];
}

export const BlindboxItemSheet = ({ open, onClose, items }: Props) => {
  const getRarityColor = (rarity: Rarity) => {
    switch (rarity) {
      case Rarity.Secret:
        return "text-purple-700";
      case Rarity.Epic:
        return "text-pink-600";
      case Rarity.Rare:
        return "text-blue-600";
      case Rarity.Common:
      default:
        return "text-gray-500";
    }
  };

  const getRarityLabel = (rarity: Rarity): string => {
    switch (rarity) {
      case Rarity.Common:
        return "Phổ biến";
      case Rarity.Rare:
        return "Cao Cấp";
      case Rarity.Epic:
        return "Hiếm";
      case Rarity.Secret:
        return "Cực hiếm";
      default:
        return rarity;
    }
  };
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto p-0">
        {/* header sticky */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <SheetHeader>
            <SheetTitle className="text-xl pl-4 py-2">
              Sản phẩm bên trong hộp
            </SheetTitle>
          </SheetHeader>
        </div>

        <div className="mt-6 space-y-6">
          {items.map((item, idx) => (
            <div className="w-full flex items-center justify-center bg-gray-50 rounded-md border pt-4">
              <div className="w-1/2 h-full">
                <div className="w-full flex items-center justify-center bg-gray-50 rounded-md border">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="max-w-full max-h-[60vh] object-contain mx-auto"
                  />
                </div>
              </div>
              <div className="w-1/2 flex flex-col justify-center space-y-3 px-2">
                {/* Tên sản phẩm */}
                <p className="text-2xl font-bold text-gray-900">
                  {item.productName}
                </p>

                {/* Độ hiếm */}
                <p
                  className={`text-base font-medium ${getRarityColor(
                    item.rarity
                  )}`}
                >
                  Độ hiếm:{" "}
                  <span className="font-semibold">
                    {getRarityLabel(item.rarity)}
                  </span>
                </p>

                {/* Tỷ lệ rơi */}
                <p className="text-base text-gray-600">
                  Tỷ lệ rơi:{" "}
                  <span className="font-semibold">{item.dropRate}%</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
