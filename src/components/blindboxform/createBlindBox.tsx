import { cn } from "@/lib/utils"
import { CalendarIcon, X } from "lucide-react"
import { format, isBefore, startOfDay } from "date-fns"
import { Controller, useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Calendar } from "../ui/calendar"
import { Textarea } from "../ui/textarea"
import { LuImagePlus } from "react-icons/lu"
import useCreateBlindboxForm from "@/app/seller/blindbox/hooks/useCreateBlindbox"
import { BlindBox, CreateBlindboxForm } from "@/services/blindboxes/typings"
import { Checkbox } from "../ui/checkbox"
import useUpdateBlindboxForm from "@/app/seller/allblindboxes/hooks/useUpdateBllindbox"
import useGetCategory from "@/app/staff/category-management/hooks/useGetCategory"
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/select';
type Props = {
    mode?: "create" | "edit";
    blindboxId?: string;
    blindbox?: BlindBox;
    defaultValues?: CreateBlindboxForm;
    onSubmit?: (
        data: CreateBlindboxForm,
        clearImages: () => void,
        onSuccessCallback?: () => void
    ) => void;
    onSuccess?: () => void;
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

export default function CreateBlindbox({
    mode = "create",
    blindboxId,
    blindbox,
    defaultValues,
    onSubmit,
    onSuccess
}: Props) {

    const updateHook = mode === "edit" && blindboxId
        ? useUpdateBlindboxForm(blindboxId, defaultValues)
        : null;

    const {
        register,
        handleSubmit,
        watch,
        control,
        errors,
        isPending: isCreatingBox,
        setValue,
        reset,
        onSubmit: onSubmitCreateBox,
    } = useCreateBlindboxForm(defaultValues);

    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const imageFile = watch('imageFile');
    const [categories, setCategories] = useState<API.ResponseDataCategory>();
    const [clearSignal, setClearSignal] = useState(0);

    const releaseDate = watch("releaseDate");
    const { getCategoryApi } = useGetCategory();
    const displayDate = releaseDate ? new Date(releaseDate) : undefined;

    useEffect(() => {
        (async () => {
            const res = await getCategoryApi({});
            if (res) {
                setCategories(res.value.data || []);
            }
        })();
    }, []);

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

    useEffect(() => {
        if (mode === "edit" && blindbox && categories?.result?.length) {
            const editDate = new Date(blindbox.releaseDate);
            reset({
                name: blindbox.name,
                categoryId: blindbox.categoryId,
                price: blindbox.price,
                totalQuantity: blindbox.totalQuantity,
                releaseDate: editDate.toISOString().split('T')[0],
                description: blindbox.description,
                imageFile: blindbox.imageUrl
            });
        }
    }, [mode, blindbox, categories, reset]);


    useEffect(() => {
        if (imageFile) {
            if (typeof imageFile === "string") {
                setImagePreview(imageFile);
            } else if (imageFile instanceof File) {
                const url = URL.createObjectURL(imageFile);
                setImagePreview(url);
                return () => {
                    URL.revokeObjectURL(url);
                    setImagePreview(null);
                };
            }
        } else {
            setImagePreview(null);
        }
    }, [imageFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setValue('imageFile', file, { shouldValidate: true });
    };

    const handleRemoveImage = () => {
        setValue('imageFile', null, { shouldValidate: true });
    };

    const clearImages = () => {
        setClearSignal(prev => prev + 1);
    };

    const handleSubmitForm = (data: CreateBlindboxForm) => {
        const transformedData = {
            ...data,
            releaseDate: data.releaseDate ? new Date(data.releaseDate).toISOString() : undefined
        };

        if (mode === "edit" && updateHook) {
            updateHook.onSubmit(transformedData, clearImages, () => {
                onSuccess?.();
            });
        } else if (onSubmit) {
            onSubmit(transformedData, clearImages);
        } else {
            onSubmitCreateBox(transformedData, clearImages);
            onSuccess?.();
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit(handleSubmitForm)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="name">Tên túi mù <span className='text-red-600'>*</span></Label>
                    <Input {...register("name")} />
                    {errors.name && (
                        <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                </div>

                <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <Label htmlFor="categoryId">
                                Danh mục <span className="text-red-600">*</span>
                            </Label>
                            <Select
                                onValueChange={(value) => field.onChange(value)}
                                value={field.value}
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
                                <p className="text-sm text-red-600">{errors.categoryId.message}</p>
                            )}
                        </div>
                    )}
                />

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
                            <div className="w-full">
                                <Label htmlFor="price">
                                    Giá (VNĐ) <span className="text-red-600">*</span>
                                </Label>

                                <div className="relative">
                                    <Input
                                        id="price"
                                        type="text"
                                        inputMode="numeric"
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
                                {errors.price && (
                                    <p className="text-sm text-red-600">{errors.price.message}</p>
                                )}
                            </div>
                        );
                    }}
                />
                <div>
                    <Label htmlFor="totalQuantity">Số lượng</Label>
                    <Input
                        id="totalQuantity"
                        type="number"
                        min={1}
                        onWheel={(e) => e.currentTarget.blur()}
                        {...register("totalQuantity", { valueAsNumber: true })}
                    />
                    {errors.totalQuantity && (
                        <p className="text-sm text-red-600">{errors.totalQuantity.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="releaseDate">Ngày phát hành</Label>
                    <Input
                        id="releaseDate"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        {...register("releaseDate", {
                            required: "Ngày phát hành là bắt buộc",
                            validate: (value) => {
                                if (!value) return true;
                                const selectedDate = new Date(value);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                            }
                        })}
                    />
                    {errors.releaseDate && (
                        <p className="text-sm text-red-600">{errors.releaseDate.message}</p>
                    )}
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                    <Label htmlFor="description">Mô tả <span className='text-red-600'>*</span></Label>
                    <Textarea {...register("description")} />
                    {errors.description && (
                        <p className="text-sm text-red-600">{errors.description.message}</p>
                    )}
                </div>
                <div>
                    <Label className="block text-base mb-2">Upload ảnh đại diện <span className='text-red-600'>*</span></Label>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                        {imagePreview ? (
                            <div className="relative border-2 rounded overflow-hidden border-blue-500 group w-full h-32">
                                <img
                                    src={imagePreview}
                                    alt="Ảnh preview"
                                    className="w-full h-full object-cover cursor-pointer"

                                />
                                <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                                    Ảnh bìa
                                </span>
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <label
                                htmlFor="uploadFile1"
                                className="w-full h-32 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed rounded bg-white text-slate-500 font-semibold text-base"
                            >
                                <LuImagePlus className="text-3xl" />
                                Thêm hình ảnh (0/1)
                                <input
                                    id="uploadFile1"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    multiple={false}
                                />
                                <p className="text-xs font-medium text-slate-400 mt-2 text-center">
                                    Cho phép sử dụng PNG, JPG, SVG, WEBP, và GIF.
                                </p>
                            </label>
                        )}
                    </div>
                    {errors.imageFile && (
                        <p className="text-sm text-red-600">{errors.imageFile.message}</p>
                    )}
                </div>
            </div>
           
            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    onClick={() => {
                        reset(defaultValues);
                        clearImages();
                    }}
                    className="px-4 py-2 bg-white text-gray-800 rounded hover:bg-gray-300"
                >
                    Hủy
                </Button>
                <Button type="submit" className="bg-[#d02a2a] text-white hover:bg-opacity-80">
                    Lưu
                </Button>
            </div>
        </form>
    )
}
