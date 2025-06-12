// components/admin/blindbox/AddItemToBlindboxForm.tsx

import { HiOutlineTrash } from "react-icons/hi";
import { GoPlus } from "react-icons/go";
import { Rarity } from "@/const/products";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { BlindBoxItemRequest } from "@/services/blindboxes/typings";

import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useState } from "react";

type Blindbox = { id: string; name: string };
type Product = { id: string; name: string; productType: string };

type Item = {
    productId: string;
    quantity: number;
    dropRate: number;
    rarity: Rarity;
};

type Props = {
    item?: BlindBoxItemRequest;
    mode?: "create" | "edit";
    blindboxes: { result: Blindbox[] };
    products: { result: Product[] };
    selectedBoxId: string;
    setSelectedBoxId: (value: string) => void;
    selectedRarities: Rarity[];
    setSelectedRarities: React.Dispatch<React.SetStateAction<Rarity[]>>;
    rarityRates: Record<string, number>;
    setRarityRates: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    items: Item[];
    handleItemChange: (index: number, field: keyof Item, value: any) => void;
    handleRarityChange: (index: number, value: Rarity) => void;
    removeItem: (index: number) => void;
    addItem: () => void;
    onSubmit: () => void;
    isPending: boolean;
    error?: string;
    setError?: (value: string | undefined) => void;
    rarityRateError?: string;
    setrarityRateError?: (value: string | undefined) => void;
    onTotalItemsChange: (value: number) => void;
    totalItemsToAdd?: number | null;
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
    totalItemsToAdd = null
}: Props) => {
    const RARITY_LABELS_VI: Record<Rarity, string> = {
        [Rarity.Common]: "Phổ biến",
        [Rarity.Rare]: "Hiếm",
        [Rarity.Epic]: "Cao cấp",
        [Rarity.Secret]: "Cực hiếm",
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
                <Select value={selectedBoxId} onValueChange={setSelectedBoxId}>
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
                <Select onValueChange={(value) => onTotalItemsChange(Number(value))}>
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
                {Object.values(Rarity).map((rarity) => {
                    const count = items.filter((item) => item.rarity === rarity).length; 

                    return (
                        <div key={rarity} className="flex items-center gap-4">
                            <Checkbox
                                id={rarity}
                                checked={selectedRarities.includes(rarity)}
                                onCheckedChange={(checked) => {
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
                            />
                            <Label htmlFor={rarity} className="w-24">
                                {RARITY_LABELS_VI[rarity as Rarity]}
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

                {rarityRateError && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertCircleIcon className="h-5 w-5" />
                        <AlertTitle>Lỗi tỉ lệ</AlertTitle>
                        <AlertDescription>{rarityRateError}</AlertDescription>
                    </Alert>
                )}
            </div>

            {items.map((item, index) => (
                <div
                    key={index}
                    className="grid grid-cols-5 gap-4 items-end mb-4 border-b pb-4"
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
                                {products?.result
                                    ?.filter((p) => p.productType === "BlindBoxOnly")
                                    .map((p) => (
                                        <SelectItem key={p.id} value={p.id}>
                                            {p.name}
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
                        <Label>Tỉ lệ rơi (%)</Label>
                        <Input
                            type="number"
                            min={0}
                            max={100}
                            step={0.0001}
                            value={item.dropRate}
                            onChange={(e) => handleItemChange(index, "dropRate", Number(e.target.value))}
                            required
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
                                <SelectItem value={Rarity.Common}>Phổ biến</SelectItem>
                                <SelectItem value={Rarity.Rare}>Hiếm</SelectItem>
                                <SelectItem value={Rarity.Epic}>Cao cấp</SelectItem>
                                <SelectItem value={Rarity.Secret}>Cực hiếm</SelectItem>
                            </SelectContent>
                        </Select>
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
                    disabled={!!rarityRateError || (totalItemsToAdd !== null && items.length >= totalItemsToAdd)}
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
                    disabled={isPending}
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
