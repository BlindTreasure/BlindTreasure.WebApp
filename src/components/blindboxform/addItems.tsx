import { HiOutlineTrash } from "react-icons/hi";
import { GoPlus } from "react-icons/go";
import { Rarity, RarityText } from "@/const/products";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { BlindBox, BlindBoxItemRequest } from "@/services/blindboxes/typings";

import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Product } from "@/services/product-seller/typings";

type BlindboxOption = Pick<BlindBox, "id" | "name" | "hasSecretItem" | "secretProbability" | "categoryId">;

type ProductOption = Pick<Product, "id" | "name" | "productType" | "categoryId">;

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

    return (
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
                    className="grid grid-cols-6 gap-4 items-end mb-4 border-b pb-4"
                >
                    <div>
                        <Label>Chọn sản phẩm</Label>
                        <Select
                            value={item.productId}
                            onValueChange={(value) => handleItemChange(index, "productId", value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn sản phẩm" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredProducts.map(product => (
                                    <SelectItem key={product.id} value={product.id}>
                                        {product.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Số lượng</Label>
                        <Input
                            type="text"
                            inputMode="numeric"
                            value={item.quantity?.toString() ?? ""}
                            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                            onWheel={(e) => e.currentTarget.blur()}
                        />
                    </div>

                    <div>
                        <Label>Độ hiếm</Label>
                        <Select
                            value={item.rarity}
                            onValueChange={(value) => handleRarityChange(index, value as Rarity)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn độ hiếm" />
                            </SelectTrigger>
                            <SelectContent>
                                {selectedRarities.map((rarity) => (
                                    <SelectItem key={rarity} value={rarity}>
                                        {RarityText[rarity]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Trọng số</Label>
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
                            className="w-full"
                        />
                    </div>

                    <div>
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
    );
};
