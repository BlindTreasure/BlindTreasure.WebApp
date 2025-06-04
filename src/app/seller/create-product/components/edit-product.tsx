import { CreateProductForm, Product } from "@/services/product-seller/typings";
import useUpdateProductForm from "../../allproduct/hooks/useUpdateProduct";
import ProductForm from "@/components/product-form";
import { Status } from "@/const/products";

type EditProductSellerProps = {
    productData: Product;
    onUpdateSuccess: () => void;
};

export default function EditProductSeller({ productData, onUpdateSuccess }: EditProductSellerProps) {
    const { id, ...rest } = productData;

    const createFormData: CreateProductForm = {
        name: rest.name,
        description: rest.description,
        categoryId: rest.categoryId,
        price: rest.price,
        stock: rest.stock,
        status: Status.Active,
        height: undefined,
        material: undefined,
        productType: null,
        brand: undefined,
        productImageUrl: undefined,
    };
    const { onSubmit: onUpdateHook, isPending } = useUpdateProductForm(id);

    const handleUpdate = (data: CreateProductForm, clearImages: () => void) => {
        onUpdateHook(data, clearImages, onUpdateSuccess);
    };

    return (
        <ProductForm
            defaultValues={createFormData}
            onSubmit={handleUpdate}
            isPending={isPending}
        />
    );
}
