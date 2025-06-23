'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/select';
import useCreateProductForm from '@/app/seller/create-product/hooks/useCreateProduct';
import { ProductType } from '@/const/products';
import React from 'react';
import { Controller } from 'react-hook-form';

type Props = {
    register: ReturnType<typeof useCreateProductForm>["register"];
    setValue: ReturnType<typeof useCreateProductForm>["setValue"];
    errors: ReturnType<typeof useCreateProductForm>["errors"];
    watch: ReturnType<typeof useCreateProductForm>["watch"];
    categories?: API.ResponseDataCategory;
    control: ReturnType<typeof useCreateProductForm>["control"];
};

function findCategoryLabelById(cats: API.Category[], id: string): string | undefined {
    const traverse = (nodes: API.Category[], path: string[] = []): string | undefined => {
        for (const node of nodes) {
            const newPath = [...path, node.name];
            if (node.id === id) return newPath.join(" > ");
            if (node.children) {
                const found = traverse(node.children, newPath);
                if (found) return found;
            }
        }
        return undefined;
    };
    return traverse(cats);
}

export default function Detail({ register, setValue, errors, watch, categories, control }: Props) {
    const topLevelCats = categories?.result?.filter(c => !c.parentId) || [];

    function renderCategories(cats: API.Category[], level = 0): React.ReactElement[] {
        return cats.flatMap((cat) => {
            const indent = Array(level).fill('\u00A0\u00A0\u00A0').join('');
            const label = cat.name;
            const isLeaf = !!cat.parentId && Array.isArray(cat.children) && cat.children.length === 0;
            const currentItem = (
                <SelectItem
                    key={cat.id}
                    value={cat.id}
                    disabled={!isLeaf} 
                    className={level === 0 ? 'font-semibold' : 'font-normal'}
                >
                    {indent}{label}
                </SelectItem>
            );

            const children = Array.isArray(cat.children) ? cat.children : [];

            return [currentItem, ...renderCategories(children, level + 1)];
        });
    }

    const selectedCategoryId = watch("categoryId");
    const selectedCategoryLabel = selectedCategoryId && categories?.result
        ? findCategoryLabelById(categories.result, selectedCategoryId)
        : "";

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* <div className="space-y-2">
                    <Label htmlFor="brand">Thương hiệu</Label>
                    <Input
                        id="brand"
                        {...register("brand")}
                    />
                </div> */}

                <div className="space-y-2">
                    <Label htmlFor="categoryId">
                        Danh mục <span className="text-red-600">*</span>
                    </Label>
                    <Select
                        onValueChange={(value) => setValue("categoryId", value)}
                        value={selectedCategoryId}
                    >
                        <SelectTrigger id="categoryId">
                            <SelectValue placeholder="Chọn danh mục">
                                {selectedCategoryLabel}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="max-h-80 overflow-y-auto">
                            {renderCategories(topLevelCats)}
                        </SelectContent>
                    </Select>
                    {errors.categoryId && (
                        <p className="text-red-500">{errors.categoryId.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="height">Kích cỡ sản phẩm</Label>
                    <div className="relative">
                        <Input
                            id="height"
                            {...register("height", {
                                setValueAs: (v) => {
                                    const n = parseFloat(v);
                                    return isNaN(n) ? undefined : n;
                                }
                            })}
                            type="number"
                            min={1}
                            step="0.1"
                            onWheel={(e) => e.currentTarget.blur()}
                            placeholder="Cao"
                            className="pr-12"
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm pointer-events-none">
                            | cm
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="material">Chất liệu sản phẩm</Label>
                    <Input
                        id="material"
                        {...register("material")}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price">
                        Giá sản phẩm (VNĐ) <span className="text-red-600">*</span>
                    </Label>

                    <Controller
                        name="price"
                        control={control}
                        defaultValue={undefined}
                        render={({ field }) => {
                            const formatCurrency = (value: number | undefined) => {
                                if (!value) return "";
                                return new Intl.NumberFormat("vi-VN").format(value);
                            };

                            const parseCurrency = (value: string) => {
                                return Number(value.replace(/[^0-9]/g, ""));
                            };

                            return (
                                <div className="relative">
                                    <Input
                                        id="price"
                                        type="text"
                                        inputMode="numeric"
                                        onWheel={(e) => e.currentTarget.blur()}
                                        className="pr-14"
                                        value={field.value === undefined ? "" : formatCurrency(field.value)}
                                        onChange={(e) => {
                                            const numberValue = parseCurrency(e.target.value);
                                            field.onChange(numberValue);
                                        }}
                                        onFocus={(e) => {
                                            e.target.value = field.value?.toString() || "";
                                        }}
                                        onBlur={(e) => {
                                            const numberValue = parseCurrency(e.target.value);
                                            e.target.value = formatCurrency(numberValue);
                                        }}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
                                        VNĐ
                                    </span>
                                </div>
                            );
                        }}
                    />

                    {errors.price && (
                        <p className="text-red-500 text-sm">{errors.price.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="stock">
                        Số lượng kho <span className="text-red-600">*</span>
                    </Label>
                    <Input
                        id="stock"
                        type="number"
                        inputMode="numeric"
                        {...register("stock", {
                            required: "Vui lòng nhập số lượng kho",
                            setValueAs: (v) => {
                                const n = parseInt(v);
                                return isNaN(n) ? undefined : n;
                            },
                        })}
                        onWheel={(e) => e.currentTarget.blur()}
                        onFocus={(e) => e.target.select()}
                    />
                    {errors.stock && (
                        <p className="text-sm text-red-500">{errors.stock.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="productType">Loại sản phẩm</Label>
                    <Select
                        onValueChange={(value: ProductType) => setValue("productType", value)}
                        value={watch("productType") || ""}
                    >
                        <SelectTrigger id="productType" className="w-full">
                            <SelectValue placeholder="Chọn loại sản phẩm" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="DirectSale">Bán trực tiếp</SelectItem>
                            <SelectItem value="BlindBoxOnly">Túi mù</SelectItem>
                            <SelectItem value="Both">Cả hai</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
