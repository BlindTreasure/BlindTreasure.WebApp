import useToast from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { handleError } from "@/hooks/error";
import {
  BlindBox,
  BlindBoxItemsRequest,
  BlindBoxListResponse,
  CreateBlindboxForm,
  CreateBlindboxItemsParam,
  ReviewBlindboxParams
} from "./typings";
import {
  createBlindbox,
  createBlindboxItems,
  deleteAllItemBlindbox,
  deleteBlindbox,
  submitBlindbox,
  updateBlindBox,
  reviewBlindbox
} from "./api-services";

export const buildBlindboxFormData = (data: CreateBlindboxForm) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("description", data.description);

  if (data.price !== undefined) {
    formData.append("price", data.price.toString());
  }

  if (data.imageFile instanceof File) {
    formData.append("imageFile", data.imageFile);
  }

  if (data.totalQuantity !== undefined) {
    formData.append("totalQuantity", data.totalQuantity.toString());
  }

  if (data.releaseDate) {
    formData.append("releaseDate", data.releaseDate);
  }

  if (data.hasSecretItem !== undefined) {
    formData.append("hasSecretItem", data.hasSecretItem.toString());
  }

  if (data.secretProbability !== undefined) {
    formData.append("secretProbability", data.secretProbability.toString());
  }

  return formData;
};

export const useServiceCreateBlindbox = () => {
  const { addToast } = useToast();

  return useMutation<TResponse, Error, CreateBlindboxForm>({
    mutationFn: async (data: CreateBlindboxForm) => {
      const formData = buildBlindboxFormData(data);
      return await createBlindbox(formData);
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

export const useServiceCreateBlindboxItems = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<BlindBoxListResponse>,
    Error,
    CreateBlindboxItemsParam
  >({
    mutationFn: createBlindboxItems,
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

export const useServiceSubmitBlindbox = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<BlindBoxListResponse>, Error, string>({
    mutationFn: submitBlindbox,
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

export const useServiceDeleteAllItemBlindbox = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<BlindBoxListResponse>, Error, string>({
    mutationFn: deleteAllItemBlindbox,
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

export const useServiceDeleteBlindbox = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<BlindBoxListResponse>, Error, string>({
    mutationFn: deleteBlindbox,
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

// export const useServiceUpdateBlindBox = () => {
//   const { addToast } = useToast();

//   return useMutation<
//     TResponseData<BlindBox>,
//     Error,
//     { blindboxesId: string; images: File[] }
//   >({
//     mutationFn: async ({ blindboxesId, images }) => {
//       const formData = new FormData();

//       images.forEach((file) => {
//         formData.append("images", file);
//       });

//       return await updateBlindBox(blindboxesId, formData);
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

export const useServiceUpdateBlindBox = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<BlindBoxListResponse>,
    Error,
    { blindboxesId: string; form: CreateBlindboxForm }
  >({
    mutationFn: async ({ blindboxesId, form }) => {
      const formData = buildBlindboxFormData(form);
      return await updateBlindBox(blindboxesId, formData);
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

export const useServiceReviewBlindbox = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<BlindBoxListResponse>,
    Error,
    ReviewBlindboxParams
  >({
    mutationFn: async ({ blindboxesId, reviewData }: ReviewBlindboxParams) => {
      return await reviewBlindbox(blindboxesId, reviewData);
    },
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