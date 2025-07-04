import { UseFormReturn } from "react-hook-form";
import { X, ImagePlus } from "lucide-react";
import { Button } from "../ui/button";
import { UpdateProductImagesType } from "@/utils/schema-validations/create-product.schema";
import { useEffect, useState } from "react";
import { LuImagePlus } from "react-icons/lu";

type Props = {
    form: UseFormReturn<UpdateProductImagesType>;
    onSubmit: (data: UpdateProductImagesType, clearImages: () => void) => void;
    isPending: boolean;
    initialImageUrls: string[];
};

export default function ProductImageUploader({ form, onSubmit, isPending, initialImageUrls }: Props) {
    const { watch, handleSubmit, setValue, reset } = form;

    const images = watch("images") || [];
    const [thumbnailIndex, setThumbnailIndex] = useState<number | null>(images.length > 0 ? 0 : null);

    useEffect(() => {
        if (images.length && thumbnailIndex === null) {
            setThumbnailIndex(0);
        }
    }, [images]);

    const updateImagesWithThumbnail = (imgs: (string | File)[], thumbnailIdx: number | null) => {
        if (thumbnailIdx !== null && imgs.length > 0) {
            const thumbnail = imgs[thumbnailIdx];
            const rest = imgs.filter((_, idx) => idx !== thumbnailIdx);
            const ordered = [thumbnail, ...rest];
            setValue("images", ordered, { shouldValidate: true, shouldDirty: true });
        } else {
            setValue("images", imgs, { shouldValidate: true, shouldDirty: true });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newImages = [...images, ...files].slice(0, 9);
        setThumbnailIndex(thumbnailIndex ?? 0);
        updateImagesWithThumbnail(newImages, thumbnailIndex ?? 0);
    };

    const handleRemove = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);

        let newThumbnail = thumbnailIndex;
        if (thumbnailIndex === index) {
            newThumbnail = newImages.length > 0 ? 0 : null;
        } else if (thumbnailIndex !== null && index < thumbnailIndex) {
            newThumbnail = thumbnailIndex - 1;
        }

        setThumbnailIndex(newThumbnail);
        updateImagesWithThumbnail(newImages, newThumbnail);
    };

    const handleSetThumbnail = (index: number) => {
        setThumbnailIndex(index);
        updateImagesWithThumbnail(images, index);
    };

    const clearImages = () => {
        setThumbnailIndex(null);
        setValue("images", []);
        reset({ images: [] });
    };

    return (
        <form
            onSubmit={handleSubmit(
                (data) => {
                    onSubmit(data, clearImages);
                },
            )}
            className="space-y-4 p-6"
        >
            <div>
                <h3 className="text-base font-semibold mb-2">Ảnh hiện tại</h3>
                <div className="grid grid-cols-3 gap-4">
                    {initialImageUrls.map((url, i) => (
                        <img
                            key={i}
                            src={url}
                            alt={`old-${i}`}
                            className="w-full h-32 object-cover rounded border"
                        />
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-base font-semibold mb-2">Cập nhật ảnh mới</h3>
                <div className="grid grid-cols-3 gap-4">
                    {images.map((img, i) => {
                        const url = typeof img === "string" ? img : URL.createObjectURL(img);
                        return (
                            <div
                                key={i}
                                className={`relative border-2 rounded overflow-hidden ${i === 0 ? "border-blue-500" : "border-gray-300"}`}
                            >
                                <img
                                    src={url}
                                    alt={`Image ${i}`}
                                    className="w-full h-32 object-cover cursor-pointer"
                                    onClick={() => handleSetThumbnail(i)}
                                />
                                {i === 0 && (
                                    <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                                        Ảnh bìa
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleRemove(i)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        );
                    })}

                    {images.length < 9 && (
                        <label className="cursor-pointer border-2 border-dashed h-32 flex flex-col justify-center items-center rounded text-gray-500">
                            <LuImagePlus className='text-3xl' />
                            Thêm hình ảnh ({images.length}/{9})
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <p className="text-xs font-medium text-slate-400 mt-2">Cho phép sử dụng PNG, JPG, SVG, WEBP, và GIF.</p>
                        </label>
                    )}
                </div>
            </div>
            <Button
                type="submit"
                className="px-4 py-2 bg-[#d02a2a] text-white rounded hover:bg-opacity-80"
                disabled={isPending}
            >
                {isPending ? "Đang cập nhật..." : "Cập nhật ảnh"}
            </Button>
        </form>
    );
}


// import { UseFormReturn } from "react-hook-form";
// import { X, ImagePlus } from "lucide-react";
// import { Button } from "../ui/button";
// import { UpdateProductImagesType } from "@/utils/schema-validations/create-product.schema";
// import { useEffect, useState } from "react";
// import { LuImagePlus } from "react-icons/lu";
// import { removeBackground } from "@/utils/backgroundRemoval";

// type Props = {
//     form: UseFormReturn<UpdateProductImagesType>;
//     onSubmit: (data: UpdateProductImagesType, clearImages: () => void) => void;
//     isPending: boolean;
//     initialImageUrls: string[];
// };

// export default function ProductImageUploader({ form, onSubmit, isPending, initialImageUrls }: Props) {
//     const { watch, handleSubmit, setValue, reset } = form;

//     const images = watch("images") || [];
//     const [thumbnailIndex, setThumbnailIndex] = useState<number | null>(images.length > 0 ? 0 : null);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [processingStatus, setProcessingStatus] = useState<string>("");

//     useEffect(() => {
//         if (images.length && thumbnailIndex === null) {
//             setThumbnailIndex(0);
//         }
//     }, [images]);

//     const updateImagesWithThumbnail = (imgs: (string | File)[], thumbnailIdx: number | null) => {
//         if (thumbnailIdx !== null && imgs.length > 0) {
//             const thumbnail = imgs[thumbnailIdx];
//             const rest = imgs.filter((_, idx) => idx !== thumbnailIdx);
//             const ordered = [thumbnail, ...rest];
//             setValue("images", ordered, { shouldValidate: true, shouldDirty: true });
//         } else {
//             setValue("images", imgs, { shouldValidate: true, shouldDirty: true });
//         }
//     };

//     const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const files = Array.from(e.target.files || []);
//         if (files.length === 0) return;

//         setIsProcessing(true);
//         setProcessingStatus('Đang xử lý ảnh...');

//         try {
//             // Process each file for background removal
//             const processedFiles: File[] = [];

//             for (let i = 0; i < files.length; i++) {
//                 const file = files[i];
//                 setProcessingStatus(`Đang xử lý ảnh ${i + 1}/${files.length}: ${file.name}`);

//                 // Remove background from image
//                 const processedFile = await removeBackground(file);
//                 processedFiles.push(processedFile);
//             }

//             // Add processed files to existing images
//             const newImages = [...images, ...processedFiles].slice(0, 9);
//             setThumbnailIndex(thumbnailIndex ?? 0);
//             updateImagesWithThumbnail(newImages, thumbnailIndex ?? 0);

//             setProcessingStatus('✅ Hoàn thành xử lý ảnh!');
//             setTimeout(() => setProcessingStatus(''), 2000);
//         } catch (error) {
//             console.error('Error processing images:', error);
//             setProcessingStatus('❌ Lỗi khi xử lý ảnh');
//             setTimeout(() => setProcessingStatus(''), 3000);
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     const handleRemove = (index: number) => {
//         const newImages = [...images];
//         newImages.splice(index, 1);

//         let newThumbnail = thumbnailIndex;
//         if (thumbnailIndex === index) {
//             newThumbnail = newImages.length > 0 ? 0 : null;
//         } else if (thumbnailIndex !== null && index < thumbnailIndex) {
//             newThumbnail = thumbnailIndex - 1;
//         }

//         setThumbnailIndex(newThumbnail);
//         updateImagesWithThumbnail(newImages, newThumbnail);
//     };

//     const handleSetThumbnail = (index: number) => {
//         setThumbnailIndex(index);
//         updateImagesWithThumbnail(images, index);
//     };

//     const clearImages = () => {
//         setThumbnailIndex(null);
//         setValue("images", []);
//         reset({ images: [] });
//     };

//     return (
//         <form
//             onSubmit={handleSubmit(
//                 (data) => {
//                     onSubmit(data, clearImages);
//                 },
//             )}
//             className="space-y-4 p-6"
//         >
//             <div>
//                 <h3 className="text-base font-semibold mb-2">Ảnh hiện tại</h3>
//                 <div className="grid grid-cols-3 gap-4">
//                     {initialImageUrls.map((url, i) => (
//                         <img
//                             key={i}
//                             src={url}
//                             alt={`old-${i}`}
//                             className="w-full h-32 object-cover rounded border"
//                         />
//                     ))}
//                 </div>
//             </div>

//             <div>
//                 <h3 className="text-base font-semibold mb-2">Cập nhật ảnh mới</h3>
//                 <div className="grid grid-cols-3 gap-4">
//                     {images.map((img, i) => {
//                         const url = typeof img === "string" ? img : URL.createObjectURL(img);
//                         return (
//                             <div
//                                 key={i}
//                                 className={`relative border-2 rounded overflow-hidden ${i === 0 ? "border-blue-500" : "border-gray-300"}`}
//                             >
//                                 <img
//                                     src={url}
//                                     alt={`Image ${i}`}
//                                     className="w-full h-32 object-cover cursor-pointer"
//                                     onClick={() => handleSetThumbnail(i)}
//                                 />
//                                 {i === 0 && (
//                                     <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
//                                         Ảnh bìa
//                                     </span>
//                                 )}
//                                 <button
//                                     type="button"
//                                     onClick={() => handleRemove(i)}
//                                     className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
//                                 >
//                                     <X size={14} />
//                                 </button>
//                             </div>
//                         );
//                     })}

//                     {images.length < 9 && (
//                         <label className={`cursor-pointer border-2 border-dashed h-32 flex flex-col justify-center items-center rounded text-gray-500 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
//                             <LuImagePlus className='text-3xl' />
//                             {isProcessing ? 'Đang xử lý...' : `Thêm hình ảnh (${images.length}/${9})`}
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 multiple
//                                 onChange={handleFileChange}
//                                 className="hidden"
//                                 disabled={isProcessing}
//                             />
//                             <p className="text-xs font-medium text-slate-400 mt-2">
//                                 {isProcessing ? 'Vui lòng đợi...' : 'Cho phép sử dụng PNG, JPG, SVG, WEBP, và GIF.'}
//                             </p>
//                         </label>
//                     )}
//                 </div>
//             </div>

//             {/* Processing Status */}
//             {processingStatus && (
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
//                     <p className="text-blue-800 text-sm font-medium">{processingStatus}</p>
//                 </div>
//             )}

//             <Button
//                 type="submit"
//                 className="px-4 py-2 bg-[#d02a2a] text-white rounded hover:bg-opacity-80"
//                 disabled={isPending || isProcessing}
//             >
//                 {isPending ? "Đang cập nhật..." : isProcessing ? "Đang xử lý ảnh..." : "Cập nhật ảnh"}
//             </Button>
//         </form>
//     );
// }
