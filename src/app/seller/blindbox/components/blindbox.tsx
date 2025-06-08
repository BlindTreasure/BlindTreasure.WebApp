'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Backdrop } from '@/components/backdrop';
import { LuImagePlus } from 'react-icons/lu';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isBefore, startOfDay } from "date-fns";

interface BlindBoxFormData {
    name: string;
    price: number;
    totalQuantity: number;
    releaseDate: string;
    description: string;
    imageFile: File | null;
    hasSecretItem: boolean;
    secretProbability: number;
}

export default function CreateBlindBoxForm({
    isPending = false,
    onSubmit,
}: {
    isPending?: boolean;
    onSubmit?: (data: FormData) => void;
}) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<BlindBoxFormData>({
        defaultValues: {
            imageFile: null,
            hasSecretItem: false,
            secretProbability: 0,
        }
    });

    const [hasSecret, setHasSecret] = useState(false);
    const imageFile = watch('imageFile');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (selectedDate) {
            setValue('releaseDate', selectedDate.toISOString(), { shouldValidate: true });
        }
    }, [selectedDate, setValue]);

    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setImagePreview(url);

            return () => {
                URL.revokeObjectURL(url);
                setImagePreview(null);
            };
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

    const handleFormSubmit = (data: BlindBoxFormData) => {
        const formData = new FormData();
        formData.append('Name', data.name);
        formData.append('Price', data.price.toString());
        formData.append('TotalQuantity', data.totalQuantity.toString());
        formData.append('ReleaseDate', data.releaseDate);
        formData.append('Description', data.description);
        formData.append('HasSecretItem', hasSecret.toString());
        formData.append('SecretProbability', data.secretProbability.toString());
        if (data.imageFile) {
            formData.append('ImageFile', data.imageFile);
        }

        if (onSubmit) onSubmit(formData);
    };

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-6 bg-white p-6 rounded-lg shadow-md"
        >
            <h2 className="text-xl font-semibold mb-4">Thông tin túi mù</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                    <Label htmlFor="name">Tên Blind Box</Label>
                    <Input id="name" {...register('name', { required: true })} />
                    {errors.name && <p className="text-red-600 text-sm">Tên bắt buộc</p>}
                </div>

                <div>
                    <Label htmlFor="price">Giá</Label>
                    <Input
                        id="price"
                        type="number"
                        min={1}
                        {...register('price', { required: true, valueAsNumber: true })}
                    />
                    {errors.price && <p className="text-red-600 text-sm">Giá bắt buộc</p>}
                </div>


                <div>
                    <Label htmlFor="totalQuantity">Số lượng</Label>
                    <Input
                        id="totalQuantity"
                        type="number"
                        min={1}
                        {...register('totalQuantity', { required: true, valueAsNumber: true })}
                    />
                    {errors.totalQuantity && <p className="text-red-600 text-sm">Số lượng bắt buộc</p>}
                </div>

                <div>
                    <Label htmlFor="releaseDate">Ngày phát hành</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={'outline'}
                                className={cn(
                                    'w-full justify-between text-left font-normal',
                                    !selectedDate && 'text-muted-foreground'
                                )}
                            >
                                {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Chọn ngày phát hành'}
                                <CalendarIcon className="mr-2 h-4 w-4" />

                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                initialFocus
                                disabled={(date) => isBefore(date, startOfDay(new Date()))}
                            />
                        </PopoverContent>
                    </Popover>
                    {errors.releaseDate && <p className="text-red-600 text-sm">Ngày phát hành bắt buộc</p>}
                </div>

                <div>
                    <Label htmlFor="secretProbability">Tỉ lệ vật phẩm bí mật</Label>
                    <Input
                        id="secretProbability"
                        type="number"
                        step="0.01"
                        {...register('secretProbability', {
                            valueAsNumber: true,
                            required: true,
                            min: 0,
                            max: 1,
                        })}
                    />
                    {errors.secretProbability && (
                        <p className="text-red-600 text-sm">Tỉ lệ hợp lệ từ 0 đến 1</p>
                    )}
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea id="description" {...register('description', { required: true })} />
                    {errors.description && <p className="text-red-600 text-sm">Mô tả bắt buộc</p>}
                </div>

                <div>
                    <Label className="block text-base mb-2">Upload ảnh đại diện</Label>
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

            <div className="flex items-center gap-2">
                <Checkbox
                    id="hasSecretItem"
                    checked={hasSecret}
                    onCheckedChange={(val) => setHasSecret(!!val)}
                />
                <Label htmlFor="hasSecretItem">Có vật phẩm bí mật</Label>
            </div>

            <div className="flex justify-end">
                <Button type="submit" className="bg-[#d02a2a] text-white hover:bg-opacity-80">
                    Tạo mới
                </Button>
            </div>

            <Backdrop open={isPending} />
        </form>
    );
}
