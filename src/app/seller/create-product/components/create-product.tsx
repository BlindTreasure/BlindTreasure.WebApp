'use client';

import { CreateProductForm } from '@/services/product-seller/typings';
import useCreateProductForm from '../hooks/useCreateProduct';
import ProductForm from '@/components/product-form';
export default function CreateProductSeller() {
  const { isPending } = useCreateProductForm();

  return <ProductForm isPending={isPending} showImageField={true}/>;
}
