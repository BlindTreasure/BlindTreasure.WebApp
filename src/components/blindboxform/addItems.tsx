import { HiOutlineTrash } from "react-icons/hi";
import { GoPlus } from "react-icons/go";
import { Rarity, RarityText, RarityColorClass } from "@/const/products";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { BlindBox, BlindBoxItemRequest } from "@/services/blindboxes/typings";
import { AlertCircleIcon, CheckCircle2Icon, GiftIcon, X, Check } from "lucide-react"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Product } from "@/services/product-seller/typings";

type BlindboxOption = Pick<BlindBox, "id" | "name" | "hasSecretItem" | "secretProbability" | "categoryId">;

type ProductOption = Pick<Product, "id" | "name" | "productType" | "categoryId" | "imageUrls">;

type Props = {
    mode?: "create" | "edit";
    blindboxes: { result: BlindboxOption[] };
    products: { result: ProductOption[] };
    selectedBoxId: string;
    setSelectedBoxId: (value: string) => void;
    selectedRarities: Rarity[];
    setSelectedRarities: React.Dispatch<React.SetStateAction<Rarity[]>>;
    rarityRates: Record<string, number>;
    setRarityRates: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    items: BlindBoxItemRequest[];
    handleItemChange: (index: number, field: keyof BlindBoxItemRequest, value: any) => void;
    handleRarityChange: (index: number, value: Rarity) => void;
    removeItem: (index: number) => void;
    addItem: () => void;
    onSubmit: () => void;
    isPending: boolean;
    error?: string;
    setError?: (value: string | undefined) => void;
    rarityRateError?: string;
    setrarityRateError?: (value: string | undefined) => void;
    onTotalItemsChange: (value: number | undefined) => void;
    totalItemsToAdd?: number | null;
    totalItems?: number | null;
    selectKey: number;
};

// Product Selection Modal Component
const ProductSelectionModal = ({
    products,
    selectedProductId,
    onSelectProduct,
    isOpen,
    onOpenChange,
    usedProductIds,
    currentSlotIndex
}: {
    products: ProductOption[];
    selectedProductId?: string;
    onSelectProduct: (productId: string) => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    usedProductIds: string[];
    currentSlotIndex: number;
}) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectProduct = (productId: string) => {
        // Only allow selection if product is not used in other slots
        if (!usedProductIds.includes(productId)) {
            onSelectProduct(productId);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Chọn sản phẩm - Slot {currentSlotIndex + 1}</DialogTitle>
                </DialogHeader>

                <div className="mb-4">
                    <Input
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.map((product) => {
                            const isUsedInOtherSlot = usedProductIds.includes(product.id);
                            const isCurrentlySelected = selectedProductId === product.id;
                            const isClickable = !isUsedInOtherSlot || isCurrentlySelected;

                            return (
                                <div
                                    key={product.id}
                                    className={`relative border p-3 transition-all ${
                                        isClickable 
                                            ? `cursor-pointer hover:shadow-md ${
                                                isCurrentlySelected
                                                    ? 'border-blue-500 shadow-md'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`
                                            : 'border-gray-100 opacity-50 cursor-not-allowed'
                                    }`}
                                    onClick={() => isClickable && handleSelectProduct(product.id)}
                                >
                                    {isCurrentlySelected && (
                                        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 z-10">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}

                                    {isUsedInOtherSlot && !isCurrentlySelected && (
                                        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 z-10">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}

                                    <div className="aspect-square mb-2 overflow-hidden bg-gray-100">
                                        {product.imageUrls && product.imageUrls.length > 0 ? (
                                            <img
                                                src={product.imageUrls[0]}
                                                alt={product.name}
                                                className={`w-full h-full object-cover ${
                                                    isUsedInOtherSlot && !isCurrentlySelected ? 'grayscale' : ''
                                                }`}
                                                onError={(e) => {
                                                    e.currentTarget.src = '/placeholder-product.jpg';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <GiftIcon className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className={`font-medium text-sm line-clamp-2 ${
                                            isUsedInOtherSlot && !isCurrentlySelected ? 'text-gray-400' : ''
                                        }`}>
                                            {product.name}
                                        </h4>
                                        {isUsedInOtherSlot && !isCurrentlySelected && (
                                            <p className="text-xs text-gray-400 mt-1">Đã được sử dụng</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <GiftIcon className="w-12 h-12 mb-4" />
                            <p>Không tìm thấy sản phẩm nào</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

// Selected Product Display Component
const SelectedProductDisplay = ({
    product,
    onClear,
    onClick
}: {
    product?: ProductOption;
    onClear: () => void;
    onClick: () => void;
}) => {
    if (!product) {
        return (
            <div
                className="border-2 border-dashed border-gray-300 p-4 cursor-pointer hover:border-gray-400 transition-colors"
                onClick={onClick}
            >
                <div className="flex flex-col items-center justify-center text-gray-500">
                    <GiftIcon className="w-8 h-8 mb-2" />
                    <span className="text-sm">Chọn sản phẩm</span>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-all group"
            onClick={onClick}
        >
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
                <X className="w-3 h-3" />
            </button>

            <div className="flex items-center justify-center gap-3">
                <div className="w-16 h-16 overflow-hidden bg-gray-100 flex-shrink-0">
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                        <img
                            src={product.imageUrls[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = '/placeholder-product.jpg';
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <GiftIcon className="w-4 h-4" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0 text-center">
                    <h4 className="font-medium text-sm line-clamp-2">
                        {product.name}
                    </h4>
                </div>
            </div>
        </div>
    );
};

export const AddItemToBlindboxForm = ({
    blindboxes,
    products,
    selectedBoxId,
    setSelectedBoxId,
    selectedRarities,
    setSelectedRarities,
    rarityRates,
    setRarityRates,
    items,
    handleItemChange,
    handleRarityChange,
    removeItem,
    addItem,
    onSubmit,
    isPending,
    error,
    rarityRateError,
    setError,
    setrarityRateError,
    onTotalItemsChange,
    totalItemsToAdd = null,
    totalItems,
    selectKey
}: Props) => {

    const [filteredProducts, setFilteredProducts] = useState<ProductOption[]>([]);
    const [productModalStates, setProductModalStates] = useState<Record<number, boolean>>({});

    const handleBlindboxChange = (boxId: string) => {
        setSelectedBoxId(boxId);
        const selectedBox = blindboxes?.result?.find((b) => b.id === boxId);
        if (!selectedBox) return;

        // Always require Secret rarity and initialize with empty rates
        setSelectedRarities([Rarity.Secret]);
        setRarityRates({});

        const matchingProducts = products?.result?.filter(
            (p) =>
                p.categoryId === selectedBox.categoryId &&
                p.id !== selectedBox.id
        );

        setFilteredProducts(matchingProducts ?? []);
    };

    const handleProductModalToggle = (index: number, isOpen: boolean) => {
        setProductModalStates(prev => ({
            ...prev,
            [index]: isOpen
        }));
    };

    const handleProductSelect = (index: number, productId: string) => {
        handleItemChange(index, "productId", productId);
    };

    const handleProductClear = (index: number) => {
        handleItemChange(index, "productId", "");
    };

    const getSelectedProduct = (productId: string): ProductOption | undefined => {
        return filteredProducts.find(p => p.id === productId);
    };

    // Get list of product IDs that are used in other slots
    const getUsedProductIds = (excludeSlotIndex: number): string[] => {
        return items
            .filter((item, index) => index !== excludeSlotIndex && item.productId)
            .map(item => item.productId);
    };

    return (
        <>
            <form
                className="space-y-6 mt-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
            >
                <div>
                    <Label>Chọn BlindBox</Label>
                    <Select value={selectedBoxId} onValueChange={handleBlindboxChange}>
                        <SelectTrigger className="w-1/2">
                            <SelectValue placeholder="Chọn hộp" />
                        </SelectTrigger>
                        <SelectContent>
                            {blindboxes?.result?.map((box) => (
                                <SelectItem key={box.id} value={box.id}>
                                    {box.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="mb-4">
                    <Label>Chọn theo bộ</Label>
                    <Select
                        key={selectKey}
                        value={typeof totalItems === "number" ? totalItems.toString() : undefined}
                        onValueChange={(value) => {
                            const numberValue = Number(value);
                            onTotalItemsChange(numberValue);
                        }}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Chọn số lượng" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="6">6</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4 border p-4 rounded-md shadow-sm">
                    <h3 className="font-semibold">Thiết lập độ hiếm & tỉ lệ rơi (%)</h3>
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            <strong>Lưu ý:</strong> Bắt buộc phải có độ hiếm "Cực hiếm" và tổng tỷ lệ phải bằng 100%
                        </p>
                    </div>
                    {Object.values(Rarity).map((rarity) => {
                        const count = items.filter((item) => item.rarity === rarity).length;
                        const isSecret = rarity === Rarity.Secret;

                        return (
                            <div key={rarity} className="flex items-center gap-4">
                                <Checkbox
                                    id={rarity}
                                    checked={selectedRarities.includes(rarity)}
                                    onCheckedChange={(checked) => {
                                        // Secret is always required, cannot be unchecked
                                        if (isSecret && !checked) return;

                                        setSelectedRarities((prev) =>
                                            checked ? [...prev, rarity] : prev.filter((r) => r !== rarity)
                                        );

                                        if (!checked) {
                                            setRarityRates((prev) => {
                                                const updated = { ...prev };
                                                delete updated[rarity];
                                                return updated;
                                            });
                                        }
                                    }}
                                    disabled={isSecret} // Secret checkbox is always disabled (always checked)
                                />
                                <Label htmlFor={rarity} className={`w-24 ${isSecret ? 'text-yellow-600 font-medium' : 'text-muted-foreground'}`}>
                                    {RarityText[rarity]} {isSecret && '*'}
                                </Label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={100}
                                    className="w-32"
                                    value={
                                        selectedRarities.includes(rarity)
                                            ? rarityRates[rarity] !== undefined
                                                ? String(rarityRates[rarity])
                                                : ""
                                            : ""
                                    }
                                    onWheel={(e) => e.currentTarget.blur()}
                                    onChange={(e) =>
                                        setRarityRates((prev) => ({
                                            ...prev,
                                            [rarity]: Number(e.target.value),
                                        }))
                                    }
                                    disabled={!selectedRarities.includes(rarity)}
                                    placeholder="% tỉ lệ"
                                />
                                <span className="text-sm text-muted-foreground">({count} sản phẩm)</span>
                            </div>
                        );
                    })}

                    {/* Total percentage validation */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Tổng tỷ lệ:</span>
                            <span className={`font-bold ${Object.values(rarityRates).reduce((sum, rate) => sum + (rate || 0), 0) === 100
                                ? 'text-green-600'
                                : 'text-red-600'
                                }`}>
                                {Object.values(rarityRates).reduce((sum, rate) => sum + (rate || 0), 0)}%
                                {Object.values(rarityRates).reduce((sum, rate) => sum + (rate || 0), 0) === 100 ? ' ✓' : ' (Phải = 100%)'}
                            </span>
                        </div>
                    </div>

                    {rarityRateError && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertCircleIcon className="h-5 w-5" />
                            <AlertTitle>Lỗi tỉ lệ</AlertTitle>
                            <AlertDescription>{rarityRateError}</AlertDescription>
                        </Alert>
                    )}

                    {/* Weight validation display */}
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Kiểm tra trọng số:</h4>
                        {Object.values(Rarity).map((rarity) => {
                            if (!selectedRarities.includes(rarity)) return null;

                            const rarityItems = items.filter(item => item.rarity === rarity);
                            const totalWeight = rarityItems.reduce((sum, item) => sum + (item.weight || 0), 0);
                            const expectedWeight = rarityRates[rarity] || 0;
                            const isValid = totalWeight === expectedWeight;

                            return (
                                <div key={rarity} className={`flex justify-between items-center py-1 ${isValid ? 'text-green-700' : 'text-red-700'}`}>
                                    <span>{RarityText[rarity]}:</span>
                                    <span className="font-medium">
                                        {totalWeight} / {expectedWeight}
                                        {isValid ? ' ✓' : ' ✗'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {items.map((item, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-6 gap-4 items-center mb-4 border-b pb-4"
                    >
                        <div>
                            <Label className="mb-2 block text-center">
                                Chọn sản phẩm (Slot {index + 1})
                            </Label>
                            <SelectedProductDisplay
                                product={getSelectedProduct(item.productId)}
                                onClear={() => handleProductClear(index)}
                                onClick={() => handleProductModalToggle(index, true)}
                            />
                        </div>

                        <div>
                            <Label className="mb-2 block text-center">Số lượng</Label>
                            <Input
                                type="number"
                                min={1}
                                step={1}
                                value={item.quantity || ''}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value) || 0;
                                    handleItemChange(index, "quantity", value);
                                }}
                                onWheel={(e) => e.currentTarget.blur()}
                                placeholder="Nhập số lượng"
                                className="w-full text-center"
                            />
                        </div>

                        <div>
                            <Label className="mb-2 block text-center">Độ hiếm</Label>
                            <Select
                                value={item.rarity}
                                onValueChange={(value) => handleRarityChange(index, value as Rarity)}
                            >
                                <SelectTrigger className="w-full">
                                    {item.rarity ? (
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${RarityColorClass[item.rarity]}`}
                                        >
                                            {RarityText[item.rarity]}
                                        </span>
                                    ) : (
                                        <SelectValue placeholder="Chọn độ hiếm" />
                                    )}
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedRarities.map((rarity) => (
                                        <SelectItem key={rarity} value={rarity}>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-medium ${RarityColorClass[rarity]}`}
                                                >
                                                    {RarityText[rarity]}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="mb-2 block text-center">Trọng số</Label>
                            <Input
                                type="number"
                                min={1}
                                step={1}
                                value={item.weight || ''}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value) || 0;
                                    handleItemChange(index, "weight", value);
                                }}
                                onWheel={(e) => e.currentTarget.blur()}
                                placeholder="Nhập trọng số"
                                className="w-full text-center"
                            />
                        </div>

                        <div className="flex items-center justify-center">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => removeItem(index)}
                                className="text-red-500"
                            >
                                <HiOutlineTrash className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                <div className="flex items-center gap-4 mb-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={addItem}
                        disabled={
                            !!rarityRateError ||
                            (totalItemsToAdd !== null && items.length >= totalItemsToAdd) ||
                            Object.values(rarityRates).reduce((sum, rate) => sum + (rate || 0), 0) !== 100 ||
                            !selectedRarities.includes(Rarity.Secret)
                        }
                    >
                        <GoPlus className="w-4 h-4 mr-2" />
                        Thêm sản phẩm
                    </Button>

                    {typeof totalItemsToAdd === "number" && (
                        <span
                            className={`text-sm ${items.length >= totalItemsToAdd! ? "text-red-500 font-semibold" : "text-gray-600"
                                }`}
                        >
                            Đã thêm: <strong>{items.length}</strong> / {totalItemsToAdd}
                        </span>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={
                            isPending ||
                            Object.values(rarityRates).reduce((sum, rate) => sum + (rate || 0), 0) !== 100 ||
                            !selectedRarities.includes(Rarity.Secret) ||
                            items.length === 0
                        }
                        className="bg-[#d02a2a] text-white hover:bg-opacity-80"
                    >
                        Thêm sản phẩm vào túi
                    </Button>
                </div>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Lỗi</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </form>

            {/* Render Product Selection Modals for each item */}
            {items.map((item, index) => (
                <ProductSelectionModal
                    key={`modal-${index}`}
                    products={filteredProducts}
                    selectedProductId={item.productId}
                    onSelectProduct={(productId) => handleProductSelect(index, productId)}
                    isOpen={productModalStates[index] || false}
                    onOpenChange={(isOpen) => handleProductModalToggle(index, isOpen)}
                    usedProductIds={getUsedProductIds(index)}
                    currentSlotIndex={index}
                />
            ))}
        </>
    );
};