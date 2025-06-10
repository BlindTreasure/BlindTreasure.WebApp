import { cn } from "@/lib/utils"
import { CalendarIcon, X } from "lucide-react"
import { format, isBefore, startOfDay } from "date-fns"
import { useForm } from "react-hook-form"
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
        errors,
        isPending: isCreatingBox,
        setValue,
        reset,
    } = useCreateBlindboxForm();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [imagePreview, setImagePreview] = useState<string | null>(null)
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
                <div>
                    <Label htmlFor="price">Giá <span className='text-red-600'>*</span></Label>
                    <Input
                        id="price"
                        type="number"
                        min={1}
                        {...register("price", { valueAsNumber: true })}
                    />
                </div>
                <div>
                    <Label htmlFor="totalQuantity">Số lượng</Label>
                    <Input type="number" min={1} {...register("totalQuantity", { valueAsNumber: true })} />
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
                <div>
                    <Label htmlFor="secretProbability">Tỉ lệ vật phẩm bí mật (%)</Label>
                    <Input
                        type="number"
                        step="0.01"
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
            <div>
                <Label htmlFor="hasSecretItem" className="flex items-center space-x-2">
                    <input type="checkbox" id="hasSecretItem" {...register("hasSecretItem")} />
                    <span>Có vật phẩm bí mật</span>
                </Label>
            </div>


            <div className="flex justify-end">
                <Button type="submit" className="bg-[#d02a2a] text-white hover:bg-opacity-80">
                    Tạo mới
                </Button>
            </div>
        </form>
    )
}
