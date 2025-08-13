import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Ribbon from "../blindbox";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BlindBox } from "@/services/blindboxes/typings";
import { Rarity, StockStatus, stockStatusMap } from "@/const/products";
import useToggleWishlist from "@/app/(user)/wishlist/hooks/useToggleWishlist";

interface BlindboxCardProps {
    blindbox: BlindBox;
    onViewDetail: (id: string) => void;
    onAddToCart?: (blindBoxId: string, quantity: number) => Promise<void>;
    ribbonTypes?: ("new" | "sale" | "blindbox")[];
    initialIsInWishlist?: boolean;
    initialWishlistId?: string;
    onWishlistChange?: () => void;
}

const BlindboxCard: React.FC<BlindboxCardProps> = ({
    blindbox,
    onViewDetail,
    onAddToCart,
    ribbonTypes = [],
    initialIsInWishlist = false,
    initialWishlistId,
    onWishlistChange
}) => {
    const [open, setOpen] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const image = blindbox.imageUrl || "/images/cart.webp";
    const [quantity, setQuantity] = useState<number>(1);

    const {
        isInWishlist,
        toggleWishlist,
        isPending: isToggling
    } = useToggleWishlist({
        initialIsInWishlist,
        initialWishlistId,
        onWishlistChange
    });

    const handleDecrease = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

    const handleAddToCart = async (quantityToAdd: number = 1) => {
        if (!onAddToCart || isAddingToCart) return;
        
        setIsAddingToCart(true);
        try {
            await onAddToCart(blindbox.id, quantityToAdd);
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleToggleWishlist = async () => {
        if (isToggling) return;

        try {
            const result = await toggleWishlist({
                blindBoxId: blindbox.id,
                type: "BlindBox"
            });

            if (result?.success) {
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    const isReleased = (() => {
        if (!blindbox?.releaseDate) return false;

        const today = new Date();
        const release = new Date(blindbox.releaseDate);
        today.setHours(0, 0, 0, 0);
        release.setHours(0, 0, 0, 0);

        return release <= today;
    })();

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
                                            {isReleased && (
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

                                                    <Button 
                                                        className="py-5"
                                                        onClick={() => handleAddToCart(quantity)}
                                                        disabled={isAddingToCart}
                                                    >
                                                        {isAddingToCart ? "Đang thêm..." : "Mua ngay"}
                                                    </Button>
                                                </div>
                                            )}

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
                    {isReleased ? (
                        <Button 
                            className="text-xs px-3 py-2 rounded-md bg-[#252424] text-white hover:bg-opacity-70 transition-all duration-300 transform hover:scale-105"
                            onClick={() => handleAddToCart(1)}
                            disabled={isAddingToCart}
                        >
                            {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                        </Button>
                    ) : (
                        <Button 
                            className="text-xs px-3 py-2 rounded-md bg-gray-400 text-white cursor-not-allowed"
                            disabled
                        >
                            Chưa phát hành
                        </Button>
                    )}
                    <button
                        onClick={handleToggleWishlist}
                        disabled={isToggling}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        {isInWishlist ? (
                            <FaHeart className="text-2xl text-red-500" />
                        ) : (
                            <FaRegHeart className="text-2xl hover:text-red-500 transition-colors" />
                        )}
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default BlindboxCard;