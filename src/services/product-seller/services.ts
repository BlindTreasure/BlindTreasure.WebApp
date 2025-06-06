import useToast from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { CreateProductForm, Product, UpdateInfor } from "./typings";
import { createProduct, deleteProduct, updateImageProduct, updateProduct } from "./api-services";
import { handleError } from "@/hooks/error";

export const useServiceCreateProduct = () => {
  const { addToast } = useToast();

  return useMutation<TResponse, Error, CreateProductForm>({
    mutationFn: async (data: CreateProductForm) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("categoryId", data.categoryId);
      formData.append("price", data.price.toString());
      formData.append("stock", data.stock.toString());
      formData.append("status", data.status);

      if (data.height !== undefined)
        formData.append("height", data.height.toString());
      if (data.material) formData.append("material", data.material);
      if (data.productType !== undefined && data.productType !== null)
        formData.append("productType", data.productType);
      if (data.brand) formData.append("brand", data.brand);
      if (data.images && data.images.length > 0) {
        data.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      return await createProduct(formData);
    },
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
  });
};

export const useServiceUpdateProduct = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<Product>,
    Error,
    UpdateInfor & { productId: string }
  >({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};

export const useServiceDeleteProduct = () => {
  const { addToast } = useToast();
  return useMutation<TResponse, unknown, string>({
    mutationFn: deleteProduct,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};

// export const useServiceUpdateImageProduct = () => {
//   const { addToast } = useToast();

//   return useMutation<TResponse, Error, CreateProductForm>({
//     mutationFn: async (data: CreateProductForm) => {
//       const formData = new FormData();
//       formData.append("name", data.name);
//       formData.append("description", data.description);
//       formData.append("categoryId", data.categoryId);
//       formData.append("price", data.price.toString());
//       formData.append("stock", data.stock.toString());
//       formData.append("status", data.status);

//       if (data.height !== undefined)
//         formData.append("height", data.height.toString());
//       if (data.material) formData.append("material", data.material);
//       if (data.productType !== undefined && data.productType !== null)
//         formData.append("productType", data.productType);
//       if (data.brand) formData.append("brand", data.brand);
//       if (data.images && data.images.length > 0) {
//         data.images.forEach((file) => {
//           formData.append("images", file);
//         });
//       }

//       return await createProduct(formData);
//     },
//     onSuccess: (data) => {
//       addToast({
//         type: "success",
//         description: data.value.message,
//         duration: 5000,
//       });
//     },
//   });
// };

export const useServiceUpdateImageProduct = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<Product>, Error, { productId: string; images: File[] }>(
    {
      mutationFn: async ({ productId, images  }) => {
        const formData = new FormData();

        images.forEach((file) => {
        formData.append('images', file); 
      });

        return await updateImageProduct(productId, formData);
      },
      onSuccess: (data) => {
        addToast({
          type: "success",
          description: data.value.message,
          duration: 5000,
        });
      },
    }
  );
};
