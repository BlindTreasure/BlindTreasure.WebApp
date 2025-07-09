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
      // Enhanced date parsing for ISO format with default date filtering
      const formatDateOfBirth = (dateString: string | null | undefined) => {
        if (!dateString) return "";

        // Check for default/null dates from backend
        if (
          dateString.startsWith("0001-01-01") ||
          dateString.startsWith("1900-01-01")
        ) {
          return "";
        }

        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return "";

          // Check if date is too old (likely default value)
          if (date.getFullYear() < 1920) {
            return "";
          }

          // Format to YYYY-MM-DD for input[type="date"]
          return date.toISOString().split("T")[0];
        } catch (error) {
          console.error("Date parsing error:", error);
          return "";
        }
      };

      const formData = {
        fullName: seller.fullName || "",
        phoneNumber: seller.phoneNumber || "",
        dateOfBirth: formatDateOfBirth(seller.dateOfBirth),
        companyName: seller.companyName || "",
        taxId: seller.taxId || "",
        companyAddress: seller.companyAddress || "",
      };

      // Force form reset with new data
      reset(formData, { keepDefaultValues: false });
    }
  }, [seller, reset]);

  const onSubmit = async (data: UpdateSellerProfileType) => {
    try {
      // Transform data before sending to API (similar to blindbox pattern)
      const transformedData = {
        ...data,
        // Convert YYYY-MM-DD to ISO string for backend
        dateOfBirth: data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString()
          : "",
      };

      await updateSellerMutation.mutateAsync(transformedData);
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
      // Reuse the same enhanced date formatting function
      const formatDateOfBirth = (dateString: string | null | undefined) => {
        if (!dateString) return "";

        // Check for default/null dates from backend
        if (
          dateString.startsWith("0001-01-01") ||
          dateString.startsWith("1900-01-01")
        ) {
          return "";
        }

        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return "";

          // Check if date is too old (likely default value)
          if (date.getFullYear() < 1920) {
            return "";
          }

          return date.toISOString().split("T")[0];
        } catch (error) {
          console.error("Date parsing error:", error);
          return "";
        }
      };

      reset({
        fullName: seller.fullName || "",
        phoneNumber: seller.phoneNumber || "",
        dateOfBirth: formatDateOfBirth(seller.dateOfBirth),
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
