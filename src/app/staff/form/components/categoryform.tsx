'use client';

import CategoryForm from '@/components/category-form';
import { useCreateCategoryForm } from '../hooks/useCreateCategory';
import useGetCategory from '../../category-management/hooks/useGetCategory';

export default function CreateCategoryPage() {
  const {
    register,
    handleSubmit,
    errors,
    previewImage,
    handleImageChange,
    isSubmitting,
    onSubmit,
    setValue,
    ...formMethods
  } = useCreateCategoryForm();

  const { getCategoryApi } = useGetCategory();

  // Tạo form object để pass vào CategoryForm
  const form = {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    ...formMethods
  };

  return (
    <CategoryForm
      form={form}
      onSubmit={onSubmit}
      previewImage={previewImage}
      handleImageChange={handleImageChange}
      getCategoryApi={getCategoryApi}
      isSubmitting={isSubmitting}
      mode="create"
    />
  );
} 