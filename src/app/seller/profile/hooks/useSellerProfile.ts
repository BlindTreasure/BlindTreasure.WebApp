import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useServiceGetSellerProfile,
  useServiceUpdateProfileSeller,
} from "@/services/account/services";
import useToast from "@/hooks/use-toast";
import {
  UpdateSellerProfileSchema,
  UpdateSellerProfileType,
} from "@/utils/schema-validations/seller-profile.schema";

export default function useSellerProfile() {
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const { data: sellerData, isLoading, error } = useServiceGetSellerProfile();
  const updateSellerMutation = useServiceUpdateProfileSeller();

  const seller = sellerData?.value?.data;

  const form = useForm<UpdateSellerProfileType>({
    resolver: zodResolver(UpdateSellerProfileSchema),
  });

  const { reset } = form;

  useEffect(() => {
    if (seller) {
      reset({
        fullName: seller.fullName || "",
        phoneNumber: seller.phoneNumber || "",
        dateOfBirth: seller.dateOfBirth ? seller.dateOfBirth.split("T")[0] : "",
        companyName: seller.companyName || "",
        taxId: seller.taxId || "",
        companyAddress: seller.companyAddress || "",
      });
    }
  }, [seller, reset]);

  const onSubmit = async (data: UpdateSellerProfileType) => {
    try {
      await updateSellerMutation.mutateAsync(data);
      setIsEditing(false);
    } catch (error) {
      addToast({
        type: "error",
        description: "Cập nhật thất bại. Vui lòng thử lại.",
        duration: 5000,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (seller) {
      reset({
        fullName: seller.fullName || "",
        phoneNumber: seller.phoneNumber || "",
        dateOfBirth: seller.dateOfBirth ? seller.dateOfBirth.split("T")[0] : "",
        companyName: seller.companyName || "",
        taxId: seller.taxId || "",
        companyAddress: seller.companyAddress || "",
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return {
    seller,
    isLoading,
    error,
    form,
    isEditing,
    isSubmitting: form.formState.isSubmitting,
    onSubmit,
    handleCancel,
    handleEdit,
    updateSellerMutation,
  };
}
