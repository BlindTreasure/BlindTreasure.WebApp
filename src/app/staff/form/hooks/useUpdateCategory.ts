'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CreateCategoryBody,
  CreateCategoryBodyType,
} from '@/utils/schema-validations/category.schema'
import { useState, useEffect, useCallback } from 'react'
import { useServiceUpdateCategory } from '@/services/category/services'
import { useRouter } from 'next/navigation'

function useUpdateCategoryForm(categoryId: string) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const router = useRouter()
  const { mutateAsync: updateCategory } = useServiceUpdateCategory()

  // ✅ Form với defaultValues cố định - không thay đổi
  const form = useForm<CreateCategoryBodyType>({
    resolver: zodResolver(CreateCategoryBody),
    defaultValues: {
      name: '',
      description: '',
      imageUrl: undefined,
      parentId: null,
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = form

  const imageFile = watch('imageUrl')

  // ✅ Effect để handle preview image
  useEffect(() => {
    if (imageFile instanceof File) {
      const url = URL.createObjectURL(imageFile)
      setPreviewImage(url)

      return () => {
        URL.revokeObjectURL(url)
      }
    } else if (typeof imageFile === 'string') {
      // Trường hợp imageUrl là string (URL từ server)
      setPreviewImage(imageFile)
    } else {
      setPreviewImage(null)
    }
  }, [imageFile])

  // ✅ Stable function với useCallback
  const handleImageChange = useCallback((file?: File) => {
    if (!file) {
      setValue('imageUrl', undefined)
      return
    }
    setValue('imageUrl', file)
  }, [setValue])

  // ✅ Stable function để set preview image từ bên ngoài
  const setPreviewImageHandler = useCallback((url: string | null) => {
    setPreviewImage(url)
  }, [])

  // ✅ Stable function để set original image URL
  const setOriginalImageUrlHandler = useCallback((url: string) => {
    setOriginalImageUrl(url)
  }, [])

  // ✅ Stable onSubmit function
  const onSubmit = useCallback(async (values: CreateCategoryBodyType) => {
    try {
      const categoryData = {
        name: values.name,
        description: values.description,
        parentId: values.parentId === null ? undefined : values.parentId,
        imageUrl: values.imageUrl instanceof File ? values.imageUrl : undefined,
      }
      
      await updateCategory({ categoryId, ...categoryData })
      router.push('/staff/category-management')
    } catch (error) {
      console.error('Update category error:', error)
    }
  }, [categoryId, updateCategory, router])

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
    setPreviewImage: setPreviewImageHandler,
    setOriginalImageUrl: setOriginalImageUrlHandler,
    imageFile,
  }
}

export default useUpdateCategoryForm