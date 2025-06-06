// import { CreateProductForm, Product } from "@/services/product-seller/typings";
// import useUpdateProductForm from "../../allproduct/hooks/useUpdateProduct";
// import ProductForm from "@/components/product-form";
// import { ProductType, Status } from "@/const/products";

// type EditProductSellerProps = {
//     productData: Product;
//     onUpdateSuccess: () => void;
// };

// export default function EditProductSeller({ productData, onUpdateSuccess }: EditProductSellerProps) {
//     const { id, ...rest } = productData;

//     const createFormData: CreateProductForm = {
//         name: rest.name,
//         description: rest.description,
//         categoryId: rest.categoryId,
//         price: rest.price,
//         stock: rest.stock,
//         status: Status.Active,
//         height: rest.height,
//         material: rest.material,
//         productType: rest.productType as ProductType,
//         brand: rest.brand,
//         images: rest.imageUrls || [],
//     };
//     const { onSubmit: onUpdateHook, isPending } = useUpdateProductForm(id);

//     const handleUpdate = (data: CreateProductForm, clearImages: () => void) => {
//         const filesOnly = data.images?.filter((img): img is File => img instanceof File) || [];

//         const updatePayload: CreateProductForm = {
//             ...data,
//             images: filesOnly,
//         };

//         onUpdateHook(updatePayload, clearImages, onUpdateSuccess);
//     };

//     return (
//         <ProductForm
//             defaultValues={createFormData}
//             onSubmit={handleUpdate}
//             isPending={isPending}
//         />
//     );
// }

import { CreateProductForm, Product } from "@/services/product-seller/typings";
import useUpdateProductForm from "../../allproduct/hooks/useUpdateProduct";
import ProductForm from "@/components/product-form";
import { ProductType, Status } from "@/const/products";
import useUpdateImageProductForm from "../../allproduct/hooks/useUpdateImages";
import ProductImageUploader from "@/components/productImageUploader";
import { UpdateProductImagesType } from "@/utils/schema-validations/create-product.schema";
import { useState } from "react";

type EditProductSellerProps = {
    productData: Product;
    onUpdateSuccess: () => void;
};

export default function EditProductSeller({ productData, onUpdateSuccess }: EditProductSellerProps) {
    const { id, ...rest } = productData;
    const [currentImageUrls, setCurrentImageUrls] = useState<string[]>(rest.imageUrls || []);

    const createFormData: CreateProductForm = {
        name: rest.name,
        description: rest.description,
        categoryId: rest.categoryId,
        price: rest.price,
        stock: rest.stock,
        status: Status.Active,
        height: rest.height,
        material: rest.material,
        productType: rest.productType as ProductType,
        brand: rest.brand,
        images: [],
    };

    const { onSubmit: onUpdateInfo, isPending: isUpdatingInfo } = useUpdateProductForm(id);
    const { form: imageForm, onSubmit: onUpdateImages, isPending: isUpdatingImages } = useUpdateImageProductForm(id, {
        images: [],
    });


    const handleUpdateInfo = (data: CreateProductForm, clearImages: () => void) => {
        const payload = { ...data, images: [] };
        onUpdateInfo(payload, clearImages, onUpdateSuccess);
    };

    const handleUpdateImages = (data: UpdateProductImagesType, clearImages: () => void) => {
        onUpdateImages(data, clearImages, (newImageUrls: string[]) => {
            setCurrentImageUrls(newImageUrls);
        });
    };

    return (
        <div className="space-y-6">
            <ProductImageUploader
                form={imageForm}
                onSubmit={handleUpdateImages}
                isPending={isUpdatingImages}
                initialImageUrls={currentImageUrls}
            />
            <ProductForm
                defaultValues={createFormData}
                onSubmit={handleUpdateInfo}
                isPending={isUpdatingInfo}
                showImageField={false}
            />
        </div>
    );
}
