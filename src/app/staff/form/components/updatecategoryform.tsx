'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, useRef } from 'react';
import CategoryForm from '@/components/category-form';
import useGetCategoryById from '../../category-management/hooks/useGetCategoryById';
import useGetCategory from '../../category-management/hooks/useGetCategory';
import useUpdateCategoryForm from '../hooks/useUpdateCategory';

type CategoryData = {
  id: string;
  name: string;
  description: string;
  parentId?: string | null;
  imageUrl?: string | null;
};

export default function UpdateCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [initialData, setInitialData] = useState<CategoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ Sử dụng ref để tránh dependency hell
  const isDataLoadedRef = useRef(false);

  const { getCategoryByIdApi } = useGetCategoryById();
  const { getCategoryApi } = useGetCategory();

  // ✅ Tạo form hook với defaultValues cố định
  const formHook = useUpdateCategoryForm(categoryId);

  // ✅ Fetch dữ liệu chỉ 1 lần khi component mount
  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!categoryId || isDataLoadedRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await getCategoryByIdApi(categoryId);

        if (response?.value?.data) {
          const categoryData = response.value.data;

          const data: CategoryData = {
            id: categoryData.id,
            name: categoryData.name,
            description: categoryData.description || '',
            parentId: categoryData.parentId,
            imageUrl: categoryData.imageUrl,
          };

          setInitialData(data);
          isDataLoadedRef.current = true;

          // ✅ Set form values chỉ 1 lần sau khi fetch xong
          formHook.setValue('name', data.name);
          formHook.setValue('description', data.description);
          formHook.setValue('parentId', data.parentId);

          if (data.imageUrl) {
            formHook.setValue('imageUrl', data.imageUrl);
            formHook.setPreviewImage(data.imageUrl);
            formHook.setOriginalImageUrl(data.imageUrl);
          }
        } else {
          setError('Không tìm thấy danh mục');
        }
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <div className="text-lg text-red-500">
            {error || 'Không tìm thấy danh mục!'}
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <CategoryForm
      form={formHook}
      onSubmit={formHook.onSubmit}
      previewImage={formHook.previewImage}
      handleImageChange={formHook.handleImageChange}
      getCategoryByIdApi={getCategoryByIdApi}
      getCategoryApi={getCategoryApi}
      isSubmitting={formHook.isSubmitting}
      mode="update"
      initialData={initialData}
      onCancel={() => router.back()}
    />
  );
}