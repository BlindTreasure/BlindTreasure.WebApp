'use client';

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
            <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-xl">Sản phẩm bên trong hộp</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex flex-row w-full gap-6 p-4 bg-white h-80"
                        >
                            <div className="w-1/2 h-full">
                                <div className="w-full h-full overflow-hidden rounded-md border">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.productName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="w-1/2 flex flex-col text-sm space-y-2">
                                <p className="text-xl font-semibold">{item.productName}</p>
                                <p className={`${getRarityColor(item.rarity)} font-medium`}>
                                    Độ hiếm: {getRarityLabel(item.rarity)}
                                </p>
                                <p className="text-gray-700">
                                    Tỷ lệ rơi: {item.dropRate}%
                                </p>
                            </div>
                        </div>
                    ))}
                </div>



            </SheetContent>
        </Sheet>
    );
};
