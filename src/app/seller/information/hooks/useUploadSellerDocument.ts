// hooks/useUploadSellerDocument.ts
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useServiceUploadSellerDocument } from "@/services/seller/services";

type UploadFormData = {
  file: FileList;
};

export default function useUploadSellerDocument(onSuccessCallback?: () => void) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<UploadFormData>();

  const { mutate, isPending } = useServiceUploadSellerDocument();

  const onSubmit = (data: UploadFormData) => {
    const file = data.file?.[0];
    if (!file) {
      setError("file", { message: "Vui lòng chọn file PDF." });
      return;
    }

    if (file.type !== "application/pdf") {
      setError("file", { message: "Chỉ chấp nhận định dạng PDF." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    mutate(formData, {
      onSuccess: () => {
        // Chỉ gọi callback, không redirect
        onSuccessCallback?.();
        reset();
      },
    });
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting: isPending,
  };
}