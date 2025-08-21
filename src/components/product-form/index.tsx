'use client';

import { useState, useEffect } from 'react';
import Basic from '@/components/tabs-seller/Basic';
import Detail from '@/components/tabs-seller/Detail';
import { Button } from '@/components/ui/button';
import { Backdrop } from '@/components/backdrop';
import { CreateProductForm } from '@/services/product-seller/typings';
import { CreateProductBodyType } from '@/utils/schema-validations/create-product.schema';
import useGetCategory from '@/app/staff/category-management/hooks/useGetCategory';
import useCreateProductForm from '@/app/seller/create-product/hooks/useCreateProduct';

interface ProductFormProps {
  defaultValues?: CreateProductForm;
  onSubmit?: (data: CreateProductForm,
    clearImages: () => void) => void;
  isPending: boolean;
  showImageField?: boolean;
}

export default function ProductForm({ defaultValues, onSubmit, isPending, showImageField = true }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    onSubmit: onSubmitHook,
    control,
    errors,
    setValue,
    reset,
    watch,
  } = useCreateProductForm(defaultValues);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (defaultValues && !isInitialized) {
      reset(defaultValues);
      setIsInitialized(true);
    }
  }, [defaultValues, reset, isInitialized]);

  const [categories, setCategories] = useState<API.ResponseDataCategory>();
  const { getCategoryApi } = useGetCategory();
  const [clearSignal, setClearSignal] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await getCategoryApi({});
      if (res) {
        setCategories(res.value.data || []);
      }
    })();
  }, []);

  const clearImages = () => {
    setClearSignal(prev => prev + 1);
  };

  const handleSubmitForm = (data: CreateProductBodyType) => {
    if (onSubmit) {
      onSubmit(data as CreateProductForm, clearImages);
    } else {
      onSubmitHook(data as CreateProductForm, clearImages);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="space-y-8">
          {/* Thông tin cơ bản */}
          <section className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-900">
            <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
            <Basic
              register={register}
              setValue={setValue}
              errors={errors}
              watch={watch}
              clearSignal={clearSignal}
              defaultValues={defaultValues}
              showImageField={showImageField}
            />
          </section>

          {/* Thông tin chi tiết */}
          <section className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Thông tin chi tiết</h2>
            <Detail
              categories={categories}
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
              control={control}
            />
          </section>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            onClick={() => {
              reset(defaultValues);
              clearImages();
            }}
            className="px-4 py-2 bg-white text-gray-800 rounded hover:bg-gray-300"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 bg-[#1cd12b] text-white rounded hover:bg-opacity-80"
          >
            Lưu
          </Button>
        </div>
      </form>
      <Backdrop open={isPending} />
    </div>
  );
}