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

type Props = {
    register: ReturnType<typeof useCreateProductForm>["register"];
    setValue: ReturnType<typeof useCreateProductForm>["setValue"];
    errors: ReturnType<typeof useCreateProductForm>["errors"];
    watch: ReturnType<typeof useCreateProductForm>["watch"];
    categories?: API.ResponseDataCategory;
};

export default function Detail({ register, setValue, errors, watch, categories }: Props) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="brand">Thương hiệu</Label>
                    <Input
                        id="brand"
                        {...register("brand")}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="categoryId">Danh mục <span className='text-red-600'>*</span></Label>
                    <Select
                        onValueChange={(value) => setValue("categoryId", value)}
                        value={watch("categoryId")}
                    >
                        <SelectTrigger id="categoryId">
                            <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories?.result?.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.categoryId && <p className="text-red-500">{errors.categoryId.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="height">Kích cỡ sản phẩm</Label>
                    <div className="relative">
                        <Input
                            id="height"
                            {...register("height", {
                                setValueAs: (v) => (v === "" ? undefined : Number(v))
                            })}
                            type="number"
                            min={0}
                            step="0.01"
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
                    <Label htmlFor="price">Giá sản phẩm (VNĐ) <span className='text-red-600'>*</span></Label>
                    <Input
                        id="price"
                        type="number"
                        min={1}
                        {...register("price", { valueAsNumber: true })}
                    />{errors.price && <p className="text-red-500">{errors.price.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="stock">Số lượng kho</Label>
                    <Input
                        id="stock"
                        type="number"
                        min={0}
                        {...register("stock", { valueAsNumber: true })}
                    />
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
                            <SelectItem value="Directsale">Bán trực tiếp</SelectItem>
                            <SelectItem value="BlindBoxOnly">Túi mù</SelectItem>
                            <SelectItem value="Both">Cả hai</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

            </div>
        </div>
    );
}
