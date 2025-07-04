'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LuImagePlus } from "react-icons/lu";
import useCreateProductForm from '@/app/seller/create-product/hooks/useCreateProduct';

type BasicProps = {
    register: ReturnType<typeof useCreateProductForm>["register"];
    setValue: ReturnType<typeof useCreateProductForm>["setValue"];
    errors: ReturnType<typeof useCreateProductForm>["errors"];
    watch: ReturnType<typeof useCreateProductForm>["watch"];
    clearSignal: number;
    defaultValues?: {
        images?: (string | File)[];
    };
    showImageField?: boolean;
};

export default function Basic({ register, setValue, errors, watch, clearSignal, defaultValues, showImageField }: BasicProps) {
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [thumbnailIndex, setThumbnailIndex] = useState<number | null>(null);
    const [originalImages, setOriginalImages] = useState<(string | File)[]>([]);

    useEffect(() => {
        if (clearSignal > 0 && (!defaultValues || !defaultValues.images?.length)) {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
            setImages([]);
            setPreviewUrls([]);
            setThumbnailIndex(null);
            setValue("images", [], { shouldValidate: true, shouldDirty: true });
        }
    }, [clearSignal]);


    useEffect(() => {
        if (defaultValues?.images?.length) {
            setOriginalImages(defaultValues.images);

            const previewFromDefault = defaultValues.images.map(img => {
                if (typeof img === 'string') return img;
                return URL.createObjectURL(img);
            });

            setPreviewUrls(previewFromDefault);

            const filesOnly = defaultValues.images.filter((img): img is File => img instanceof File);
            setImages(filesOnly);

            setThumbnailIndex(0);
        }
    }, [defaultValues]);


    const updateFormImages = (newImages: File[], newThumbnailIndex: number | null) => {
        if (newThumbnailIndex !== null && newImages.length > 0) {
            const thumbnailImage = newImages[newThumbnailIndex];
            const otherImages = newImages.filter((_, idx) => idx !== newThumbnailIndex);
            const orderedImages = [thumbnailImage, ...otherImages];
            setValue("images", orderedImages, { shouldValidate: true, shouldDirty: true });
        } else {
            setValue("images", newImages, { shouldValidate: true, shouldDirty: true });
        }
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files).slice(0, 9 - images.length);
        const newUrls = newFiles.map(file => URL.createObjectURL(file));

        const updatedImages = [...images, ...newFiles];
        const updatedPreviews = [...previewUrls, ...newUrls];

        setImages(updatedImages);
        setPreviewUrls(updatedPreviews);

        const newThumbnailIndex = thumbnailIndex === null && newFiles.length > 0 ? 0 : thumbnailIndex;

        setThumbnailIndex(newThumbnailIndex);

        updateFormImages(updatedImages, newThumbnailIndex);
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...images];
        const newPreviews = [...previewUrls];

        newImages.splice(index, 1);
        newPreviews.splice(index, 1);

        let newThumbnailIndex = thumbnailIndex;

        if (thumbnailIndex === index) {
            newThumbnailIndex = newImages.length > 0 ? 0 : null;
        } else if (thumbnailIndex !== null && index < thumbnailIndex) {
            newThumbnailIndex = thumbnailIndex - 1;
        }

        setImages(newImages);
        setPreviewUrls(newPreviews);
        setThumbnailIndex(newThumbnailIndex);
        updateFormImages(newImages, newThumbnailIndex);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Tên Sản Phẩm <span className='text-red-600'>*</span></Label>
                    <Input
                        id="name"
                        {...register("name")}
                    />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Mô Tả <span className='text-red-600'>*</span></Label>
                <Textarea
                    id="description"
                    rows={3}
                    {...register("description")}
                />
                {errors.description && <p className="text-red-500">{errors.description.message}</p>}
            </div>

            {showImageField !== false && (
                <div className="space-y-6">
                    <div>
                        <Label className="block text-base font-semibold mb-2">Upload Hình ảnh (tối đa 9)</Label>
                        <div className="grid md:grid-cols-3 gap-4 grid-cols-2">
                            {previewUrls.map((url, index) => (
                                <div
                                    key={index}
                                    className={`relative border-2 rounded overflow-hidden group ${thumbnailIndex === index ? 'border-blue-500' : 'border-gray-300'
                                        }`}
                                >
                                    <img
                                        src={url}
                                        alt={`preview-${index}`}
                                        className="w-full h-32 object-cover cursor-pointer"
                                        onClick={() => {
                                            setThumbnailIndex(index);
                                            updateFormImages(images, index);
                                        }}
                                    />
                                    {thumbnailIndex === index && (
                                        <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                                            Ảnh bìa
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}

                            {images.length < 9 && (
                                <label
                                    htmlFor="uploadFile1"
                                    className=" bg-white text-slate-500 font-semibold text-base rounded h-32 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed"
                                >

                                    <LuImagePlus className='text-3xl' />
                                    Thêm hình ảnh ({images.length}/{9})
                                    <input
                                        type="file"
                                        id="uploadFile1"
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={handleUpload}
                                    />
                                    <p className="text-xs font-medium text-slate-400 mt-2">Cho phép sử dụng PNG, JPG, SVG, WEBP, và GIF.</p>
                                </label>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



// 'use client';

// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { X } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { LuImagePlus } from "react-icons/lu";
// import useCreateProductForm from '@/app/seller/create-product/hooks/useCreateProduct';
// import { removeBackground } from '@/utils/backgroundRemoval';

// type BasicProps = {
//     register: ReturnType<typeof useCreateProductForm>["register"];
//     setValue: ReturnType<typeof useCreateProductForm>["setValue"];
//     errors: ReturnType<typeof useCreateProductForm>["errors"];
//     watch: ReturnType<typeof useCreateProductForm>["watch"];
//     clearSignal: number;
//     defaultValues?: {
//         images?: (string | File)[];
//     };
//     showImageField?: boolean;
// };

// export default function Basic({ register, setValue, errors, watch, clearSignal, defaultValues, showImageField }: BasicProps) {
//     const [images, setImages] = useState<File[]>([]);
//     const [previewUrls, setPreviewUrls] = useState<string[]>([]);
//     const [thumbnailIndex, setThumbnailIndex] = useState<number | null>(null);
//     const [originalImages, setOriginalImages] = useState<(string | File)[]>([]);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [processingStatus, setProcessingStatus] = useState<string>('');

//     useEffect(() => {
//         if (clearSignal > 0 && (!defaultValues || !defaultValues.images?.length)) {
//             previewUrls.forEach((url) => URL.revokeObjectURL(url));
//             setImages([]);
//             setPreviewUrls([]);
//             setThumbnailIndex(null);
//             setValue("images", [], { shouldValidate: true, shouldDirty: true });
//         }
//     }, [clearSignal]);


//     useEffect(() => {
//         if (defaultValues?.images?.length) {
//             setOriginalImages(defaultValues.images);

//             const previewFromDefault = defaultValues.images.map(img => {
//                 if (typeof img === 'string') return img;
//                 return URL.createObjectURL(img);
//             });

//             setPreviewUrls(previewFromDefault);

//             const filesOnly = defaultValues.images.filter((img): img is File => img instanceof File);
//             setImages(filesOnly);

//             setThumbnailIndex(0);
//         }
//     }, [defaultValues]);


//     const updateFormImages = (newImages: File[], newThumbnailIndex: number | null) => {
//         if (newThumbnailIndex !== null && newImages.length > 0) {
//             const thumbnailImage = newImages[newThumbnailIndex];
//             const otherImages = newImages.filter((_, idx) => idx !== newThumbnailIndex);
//             const orderedImages = [thumbnailImage, ...otherImages];
//             setValue("images", orderedImages, { shouldValidate: true, shouldDirty: true });
//         } else {
//             setValue("images", newImages, { shouldValidate: true, shouldDirty: true });
//         }
//     };

//     const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const files = e.target.files;
//         if (!files) return;

//         const newFiles = Array.from(files).slice(0, 9 - images.length);

//         if (newFiles.length === 0) return;

//         setIsProcessing(true);
//         setProcessingStatus('Đang xử lý ảnh...');

//         try {
//             // Process each file for background removal
//             const processedFiles: File[] = [];
//             const processedUrls: string[] = [];

//             for (let i = 0; i < newFiles.length; i++) {
//                 const file = newFiles[i];
//                 setProcessingStatus(`Đang xử lý ảnh ${i + 1}/${newFiles.length}: ${file.name}`);

//                 // Remove background from image
//                 const processedFile = await removeBackground(file);
//                 processedFiles.push(processedFile);

//                 // Create preview URL for processed image
//                 const previewUrl = URL.createObjectURL(processedFile);
//                 processedUrls.push(previewUrl);
//             }

//             // Update state with processed images
//             const updatedImages = [...images, ...processedFiles];
//             const updatedPreviews = [...previewUrls, ...processedUrls];

//             setImages(updatedImages);
//             setPreviewUrls(updatedPreviews);

//             const newThumbnailIndex = thumbnailIndex === null && processedFiles.length > 0 ? 0 : thumbnailIndex;
//             setThumbnailIndex(newThumbnailIndex);

//             updateFormImages(updatedImages, newThumbnailIndex);

//             setProcessingStatus('✅ Hoàn thành xử lý ảnh!');

//             // Clear status after 2 seconds
//             setTimeout(() => {
//                 setProcessingStatus('');
//             }, 2000);

//         } catch (error) {
//             console.error('❌ Lỗi xử lý ảnh:', error);
//             setProcessingStatus('❌ Có lỗi xảy ra khi xử lý ảnh');

//             // Fallback: use original files if processing fails
//             const newUrls = newFiles.map(file => URL.createObjectURL(file));
//             const updatedImages = [...images, ...newFiles];
//             const updatedPreviews = [...previewUrls, ...newUrls];

//             setImages(updatedImages);
//             setPreviewUrls(updatedPreviews);

//             const newThumbnailIndex = thumbnailIndex === null && newFiles.length > 0 ? 0 : thumbnailIndex;
//             setThumbnailIndex(newThumbnailIndex);
//             updateFormImages(updatedImages, newThumbnailIndex);

//             setTimeout(() => {
//                 setProcessingStatus('');
//             }, 3000);
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     const handleRemoveImage = (index: number) => {
//         const newImages = [...images];
//         const newPreviews = [...previewUrls];

//         newImages.splice(index, 1);
//         newPreviews.splice(index, 1);

//         let newThumbnailIndex = thumbnailIndex;

//         if (thumbnailIndex === index) {
//             newThumbnailIndex = newImages.length > 0 ? 0 : null;
//         } else if (thumbnailIndex !== null && index < thumbnailIndex) {
//             newThumbnailIndex = thumbnailIndex - 1;
//         }

//         setImages(newImages);
//         setPreviewUrls(newPreviews);
//         setThumbnailIndex(newThumbnailIndex);
//         updateFormImages(newImages, newThumbnailIndex);
//     };

//     return (
//         <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                     <Label htmlFor="name">Tên Sản Phẩm <span className='text-red-600'>*</span></Label>
//                     <Input
//                         id="name"
//                         {...register("name")}
//                     />
//                     {errors.name && <p className="text-red-500">{errors.name.message}</p>}
//                 </div>
//             </div>

//             <div className="space-y-2">
//                 <Label htmlFor="description">Mô Tả <span className='text-red-600'>*</span></Label>
//                 <Textarea
//                     id="description"
//                     rows={3}
//                     {...register("description")}
//                 />
//                 {errors.description && <p className="text-red-500">{errors.description.message}</p>}
//             </div>

//             {showImageField !== false && (
//                 <div className="space-y-6">
//                     <div>
//                         <Label className="block text-base font-semibold mb-2">Upload Hình ảnh (tối đa 9)</Label>

//                         {/* Processing Status */}
//                         {(isProcessing || processingStatus) && (
//                             <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                                 <div className="flex items-center space-x-2">
//                                     {isProcessing && (
//                                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                                     )}
//                                     <span className="text-sm text-blue-700 font-medium">
//                                         {processingStatus || 'Đang xử lý...'}
//                                     </span>
//                                 </div>
//                                 {isProcessing && (
//                                     <p className="text-xs text-blue-600 mt-1">
//                                         🎯 Đang tự động xóa nền cho ảnh sản phẩm...
//                                     </p>
//                                 )}
//                             </div>
//                         )}
//                         <div className="grid md:grid-cols-3 gap-4 grid-cols-2">
//                             {previewUrls.map((url, index) => (
//                                 <div
//                                     key={index}
//                                     className={`relative border-2 rounded overflow-hidden group ${thumbnailIndex === index ? 'border-blue-500' : 'border-gray-300'
//                                         }`}
//                                 >
//                                     <img
//                                         src={url}
//                                         alt={`preview-${index}`}
//                                         className="w-full h-32 object-cover cursor-pointer"
//                                         onClick={() => {
//                                             setThumbnailIndex(index);
//                                             updateFormImages(images, index);
//                                         }}
//                                     />
//                                     {thumbnailIndex === index && (
//                                         <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
//                                             Ảnh bìa
//                                         </span>
//                                     )}
//                                     <button
//                                         type="button"
//                                         onClick={() => handleRemoveImage(index)}
//                                         className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
//                                     >
//                                         <X size={14} />
//                                     </button>
//                                 </div>
//                             ))}

//                             {images.length < 9 && (
//                                 <label
//                                     htmlFor="uploadFile1"
//                                     className={`bg-white text-slate-500 font-semibold text-base rounded h-32 flex flex-col items-center justify-center border-2 border-gray-300 border-dashed ${isProcessing
//                                             ? 'cursor-not-allowed opacity-50'
//                                             : 'cursor-pointer hover:border-blue-400 hover:bg-blue-50'
//                                         }`}
//                                 >
//                                     <LuImagePlus className='text-3xl' />
//                                     {isProcessing ? 'Đang xử lý...' : `Thêm hình ảnh (${images.length}/9)`}
//                                     <input
//                                         type="file"
//                                         id="uploadFile1"
//                                         className="hidden"
//                                         accept="image/*"
//                                         multiple
//                                         onChange={handleUpload}
//                                         disabled={isProcessing}
//                                     />
//                                     <p className="text-xs font-medium text-slate-400 mt-2">
//                                         {isProcessing
//                                             ? '🎯 Tự động xóa nền cho ảnh sản phẩm'
//                                             : 'Cho phép sử dụng PNG, JPG, SVG, WEBP, và GIF.'
//                                         }
//                                     </p>
//                                 </label>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
