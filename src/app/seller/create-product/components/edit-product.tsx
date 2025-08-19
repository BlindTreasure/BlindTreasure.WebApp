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
        realSellingPrice: rest.realSellingPrice,
        listedPrice: rest.listedPrice,
        totalStockQuantity: rest.totalStockQuantity,
        status: Status.Active,
        height: rest.height,
        material: rest.material,
        productType: rest.productType as ProductType,
        // brand: rest.brand,
        images: [],
    };

    const { onSubmit: onUpdateInfo, isPending: isUpdatingInfo } = useUpdateProductForm(id, createFormData);
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
