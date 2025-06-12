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
import { BlindBox } from "@/services/blindboxes/typings"
import { Checkbox } from "../ui/checkbox"

type Props = {
    mode?: "create" | "edit";
    blindboxId?: string;
    blindbox?: BlindBox;
    onSubmitCreateBox: (data: any, callback: () => void) => void;
};

export default function CreateBlindbox({
    mode = "create",
    blindboxId,
    blindbox,
    onSubmitCreateBox,
}: Props) {
    const {
        register,
        handleSubmit,
        watch,
        control,
        errors,
        isPending: isCreatingBox,
        setValue,
        reset,
    } = useCreateBlindboxForm();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const hasSecretItem = watch("hasSecretItem", false);
    const imageFile = watch('imageFile');

    useEffect(() => {
        if (mode === "edit" && blindbox) {
            reset({
                name: blindbox.name,
                price: blindbox.price,
                totalQuantity: blindbox.totalQuantity,
                releaseDate: blindbox.releaseDate,
                description: blindbox.description,
                hasSecretItem: blindbox.hasSecretItem,
                secretProbability: blindbox.secretProbability,
                imageFile: blindbox.imageUrl
            });
        }
    }, [mode, blindbox, reset]);

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

    useEffect(() => {
        if (blindbox?.releaseDate) {
            setSelectedDate(new Date(blindbox.releaseDate));
            setValue("releaseDate", new Date(blindbox.releaseDate).toISOString());
        }
    }, [blindbox, setValue]);

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date) {
            setValue("releaseDate", date.toISOString());
        }
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setValue('imageFile', file, { shouldValidate: true });
    };

    const handleRemoveImage = () => {
        setValue('imageFile', null, { shouldValidate: true });
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit((data) => {
            onSubmitCreateBox(data, () => { });
        })}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="name">Tên túi mù <span className='text-red-600'>*</span></Label>
                    <Input {...register("name")} />
                </div>
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
                </div>
                <div>
                    <Label htmlFor="releaseDate">Ngày phát hành</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-between text-left font-normal",
                                    !selectedDate && "text-muted-foreground"
                                )}
                            >
                                {selectedDate
                                    ? format(new Date(selectedDate), "dd/MM/yyyy")
                                    : "Chọn ngày phát hành"}
                                <CalendarIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateChange}
                                disabled={(date) => isBefore(date, startOfDay(new Date()))}
                            />
                        </PopoverContent>
                    </Popover>
                    <Input type="hidden" {...register("releaseDate", { required: "Ngày phát hành là bắt buộc" })} />
                    {errors.releaseDate && (
                        <p className="text-sm text-red-600">{errors.releaseDate.message}</p>
                    )}
                </div>
                {hasSecretItem && (
                    <div>
                        <Label htmlFor="secretProbability">Tỉ lệ vật phẩm bí mật (%)</Label>
                        <Input
                            type="number"
                            min={0}
                            max={100}
                            {...register("secretProbability", {
                                valueAsNumber: true,
                                required: "Tỉ lệ là bắt buộc",
                                min: { value: 0, message: "Tối thiểu là 0%" },
                                max: { value: 100, message: "Tối đa là 100%" },
                            })}
                        />
                        {errors.secretProbability && (
                            <p className="text-red-600 text-sm">{errors.secretProbability.message}</p>
                        )}
                    </div>
                )}
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                    <Label htmlFor="description">Mô tả <span className='text-red-600'>*</span></Label>
                    <Textarea {...register("description")} />
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
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="hasSecretItem"
                    checked={hasSecretItem}
                    onCheckedChange={(checked) => setValue("hasSecretItem", checked === true)}
                />
                <Label htmlFor="hasSecretItem">Có vật phẩm bí mật</Label>
            </div>

            <div className="flex justify-end">
                <Button type="submit" className="bg-[#d02a2a] text-white hover:bg-opacity-80">
                    Tạo mới
                </Button>
            </div>
        </form>
    )
}
