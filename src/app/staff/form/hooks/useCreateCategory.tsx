'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CreateCategoryBody,
  CreateCategoryBodyType,
} from '@/utils/schema-validations/category.schema'
import { useState, useEffect } from 'react'
import { useServiceCreateCategory } from '@/services/category/services'
import { useRouter } from 'next/navigation'

export function useCreateCategoryForm(defaultValues?: Partial<CreateCategoryBodyType>) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const router = useRouter()
  const { mutateAsync: createCategory } = useServiceCreateCategory()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CreateCategoryBodyType>({
    resolver: zodResolver(CreateCategoryBody),
    defaultValues: {
      name: '',
      description: '',
      imageUrl: undefined,
      parentId: null,
      ...defaultValues,
    },
  })

  const imageFile = watch('imageUrl')
  useEffect(() => {
    if (imageFile instanceof File) {
      const url = URL.createObjectURL(imageFile)
      setPreviewImage(url)

      return () => {
        URL.revokeObjectURL(url)
      }
    } else if (typeof imageFile === 'string') {
      // Trường hợp imageUrl là string URL
      setPreviewImage(imageFile)
    } else {
      setPreviewImage(null)
    }
  }, [imageFile])

  const handleImageChange = (file?: File) => {
    if (!file) {
      setValue('imageUrl', undefined)
      return
    }

    setValue('imageUrl', file)
  }

  const onSubmit = async (values: CreateCategoryBodyType) => {
    try {
      // ✅ Xử lý null case cho parentId và imageUrl
      const categoryData = {
        name: values.name,
        description: values.description,
        parentId: values.parentId === null ? undefined : values.parentId,
        // ✅ Chỉ gửi File, không gửi string URL
        imageUrl: values.imageUrl instanceof File ? values.imageUrl : undefined,
      }
      
      await createCategory(categoryData)
      router.push('/staff/category-management')
    } catch (error) {
      console.error('Create category error:', error)
    }
  }

  return {
    register,
    handleSubmit,
    errors,
    previewImage,
    handleImageChange,
    isSubmitting,
    onSubmit,
    setValue,
    watch,
    reset,
    setPreviewImage,
    imageFile,
  }
}

export default useCreateCategoryForm