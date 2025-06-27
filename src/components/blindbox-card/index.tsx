import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Ribbon from "../blindbox";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { BlindBox } from "@/services/blindboxes/typings";
<<<<<<< HEAD
import { Rarity } from "@/const/products";
import useAddBlindBoxToCart from "@/app/(user)/detail-blindbox/hooks/useAddBlindboxToCart"
=======
import { Rarity, StockStatus, stockStatusMap } from "@/const/products";
>>>>>>> test

interface BlindboxCardProps {
    blindbox: BlindBox;
    onViewDetail: (id: string) => void;
    ribbonTypes?: ("new" | "sale" | "blindbox")[];
}

const BlindboxCard: React.FC<BlindboxCardProps> = ({ blindbox, onViewDetail, ribbonTypes = [] }) => {
    const [open, setOpen] = useState(false);
    const image = blindbox.imageUrl || "/images/cart.webp";
    const [quantity, setQuantity] = useState<number>(1);
<<<<<<< HEAD
    const { addBlindboxToCartApi, isPending: isAddingToCart } = useAddBlindBoxToCart();
=======
    const [selectedVariant, setSelectedVariant] = useState<string>("Loại A");
>>>>>>> test

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

<<<<<<< HEAD
    const handleAddToCart = async () => {
        if (!blindbox) return;
            
        try {
        const cartItem = {
            blindBoxId: blindbox.id,
            quantity: 1,
            };
            
        const result = await addBlindboxToCartApi(cartItem);          
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
        }
        };

    const getRarityLabel = (rarity: string): string => {
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
=======
    const handleVariantSelect = (variant: string) => {
        setSelectedVariant(variant);
>>>>>>> test
    };
    
    return (
        <div className="relative p-2 mt-6 transition-all duration-300 transform hover:scale-105">
            <Ribbon createdAt={blindbox.releaseDate} types={ribbonTypes} />
            <Card className="relative w-full rounded-xl overflow-hidden p-4 shadow-lg bg-white">
                <div className="w-full h-48 overflow-hidden rounded-md relative group">
                    <img
                        src={image}
                        alt={blindbox.name}
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="text-xs px-3 py-2 rounded-md bg-white text-black hover:bg-gray-300">
                                    Xem nhanh
                                </Button>
                            </DialogTrigger>

                            <DialogContent
                                className="max-w-96 sm:max-w-xl md:max-w-2xl lg:max-w-4xl p-6"
                                onOpenAutoFocus={(e) => e.preventDefault()}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <img
                                            src={image}
                                            alt="Blindbox Preview"
                                            className="w-full h-80 object-cover rounded-xl"
                                        />
                                    </div>

                                    <div className="flex flex-col justify-between">
                                        <div className="space-y-4">
                                            <h2 className="text-3xl font-semibold">{blindbox.name}</h2>
                                            <div className='flex gap-2'>
                                                <div className='flex gap-2'>
                                                    <p>Thương hiệu: <span className='text-[#00579D] text-sm uppercase'>{blindbox.brand}</span></p>
                                                    <div className="w-px h-5 bg-gray-300" />
                                                    <p>Tình trạng: <span className='text-[#00579D]'>{stockStatusMap[blindbox?.blindBoxStockStatus as StockStatus]}</span></p>
                                                    <div className="w-px h-5 bg-gray-300" />
                                                </div>
                                                {blindbox?.hasSecretItem && (
                                                    <p>Xác suất bí mật: <span className='text-[#EF1104]'>{blindbox.secretProbability}%</span></p>
                                                )}
                                            </div>
                                            <p className="text-red-600 font-bold text-3xl">
                                                {blindbox.price.toLocaleString("vi-VN")}₫
                                            </p>
                                            <p>Mô tả: <span className='text-gray-600 text-sm'>{blindbox.description}</span></p>
                                            <div className="mb-6">
                                                <p className="mb-2 text-xl">Chọn bộ:</p>
                                                <div className="flex gap-4">
                                                    {["Loại A", "Loại B", "Loại C"].map((variant, idx) => (
                                                        <div
                                                            key={idx}
                                                            onClick={() => handleVariantSelect(variant)}
                                                            className={`px-4 py-2 rounded-md border cursor-pointer transition-colors ${selectedVariant === variant
                                                                ? 'bg-[#252424] text-white border-[#252424]'
                                                                : 'bg-white text-black border-gray-300 hover:border-gray-400'
                                                                }`}
                                                        >
                                                            {variant}
                                                        </div>
                                                    ))}
                                                </div>
                                                {selectedVariant && (
                                                    <p className="text-sm text-gray-500 mt-2">Đã chọn: <strong>{selectedVariant}</strong></p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 mt-6">
                                                <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                                                    <button
                                                        onClick={handleDecrease}
                                                        className="w-10 h-10 bg-[#252424] text-white text-xl flex items-center justify-center"
                                                    >
                                                        −
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={quantity}
                                                        readOnly
                                                        className="w-12 h-9 text-center"
                                                    />
                                                    <button
                                                        onClick={handleIncrease}
                                                        className="w-10 h-10 bg-[#252424] text-white text-xl flex items-center justify-center"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <Button className="py-5">
                                                    Mua ngay
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Button
                            className="text-xs px-3 py-2 rounded-md bg-white text-black hover:bg-gray-300"
                            onClick={() => onViewDetail(blindbox.id)}
                        >
                            Xem chi tiết
                        </Button>
                    </div>
                </div>

                <div className="mt-4 text-sm">
                    <p className="truncate font-semibold text-gray-800">{blindbox.name}</p>
                    <p className="text-red-600 font-bold text-lg">
                        {blindbox.price.toLocaleString("vi-VN")}₫
                    </p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                    <Button onClick={handleAddToCart} className="text-xs px-3 py-2 rounded-md bg-[#252424] text-white hover:bg-opacity-70 transition-all duration-300 transform hover:scale-105">
                        Thêm vào giỏ hàng
                    </Button>
                    <FaRegHeart className="text-2xl cursor-pointer hover:text-red-500" />
                </div>
            </Card>
        </div>
    );
};

export default BlindboxCard;
