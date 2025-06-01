'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CategoryRow } from '@/components/category-table'
import { Loader2 } from 'lucide-react'

type CategoryFormModalProps = {
  open: boolean
  onClose: () => void
  initialData?: CategoryRow | null
  categories: CategoryRow[]
  isSubmitting: boolean
  isLoadingEdit?: boolean
  onSubmit: (formData: {
    name: string
    description: string
    parentId: string
  }) => void
}

export default function CategoryFormModal({
  open,
  onClose,
  initialData,
  categories,
  isSubmitting,
  isLoadingEdit = false,
  onSubmit,
}: CategoryFormModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [parentId, setParentId] = useState('')
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    parentId: ''
  })

  // ✅ Reset form khi modal đóng/mở
  useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.name || '')
        setDescription(initialData.description || '')
        setParentId(initialData.parentId || '')
      } else {
        setName('')
        setDescription('')
        setParentId('')
      }
      // Reset errors khi mở modal
      setErrors({ name: '', description: '', parentId: '' })
    }
  }, [initialData, open])

  // ✅ Validation function
  const validateForm = () => {
    const newErrors = { name: '', description: '', parentId: '' }
    let isValid = true

    if (!name.trim()) {
      newErrors.name = 'Tên danh mục không được để trống'
      isValid = false
    } else if (name.trim().length < 2) {
      newErrors.name = 'Tên danh mục phải có ít nhất 2 ký tự'
      isValid = false
    } else if (name.trim().length > 100) {
      newErrors.name = 'Tên danh mục không được vượt quá 100 ký tự'
      isValid = false
    }

    if (description.trim().length > 500) {
      newErrors.description = 'Mô tả không được vượt quá 500 ký tự'
      isValid = false
    }

    // ✅ Kiểm tra xem có tạo vòng lặp không (khi edit)
    if (initialData && parentId && initialData.id === parentId) {
      newErrors.parentId = 'Không thể chọn chính nó làm danh mục cha'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // ✅ Helper function để check xem một category có phải là descendant không
  const isDescendant = (category: CategoryRow, ancestorId: string): boolean => {
    if (!category.children) return false
    
    for (const child of category.children) {
      if (child.id === ancestorId || isDescendant(child, ancestorId)) {
        return true
      }
    }
    return false
  }

  // ✅ Helper function để check circular reference
  const wouldCreateCircularReference = (categoryId: string, potentialParentId: string): boolean => {
    if (!potentialParentId) return false
    
    // Tìm category với potentialParentId
    const findCategory = (cats: CategoryRow[], id: string): CategoryRow | null => {
      for (const cat of cats) {
        if (cat.id === id) return cat
        if (cat.children) {
          const found = findCategory(cat.children, id)
          if (found) return found
        }
      }
      return null
    }

    const potentialParent = findCategory(categories, potentialParentId)
    return potentialParent ? isDescendant(potentialParent, categoryId) : false
  }

  const flattenCategories = (
    cats: CategoryRow[],
    level = 0,
    excludeId?: string
  ): Array<{ id: string; name: string; level: number }> => {
    const result: Array<{ id: string; name: string; level: number }> = []

    cats.forEach((cat) => {
      // ✅ Exclude category đang edit và tất cả children của nó
      if (excludeId && (cat.id === excludeId || isDescendant(cat, excludeId))) {
        return
      }
      
      if (level <= 2) { // ✅ Giới hạn 3 cấp (0, 1, 2)
        result.push({ id: cat.id, name: cat.name, level })
        if (cat.children && cat.children.length > 0) {
          result.push(...flattenCategories(cat.children, level + 1, excludeId))
        }
      }
    })

    return result
  }

  const flatCategories = flattenCategories(categories, 0, initialData?.id)

  const handleSubmit = () => {
    if (!validateForm()) return
    
    // ✅ Double check circular reference
    if (initialData && parentId && wouldCreateCircularReference(initialData.id, parentId)) {
      setErrors(prev => ({
        ...prev,
        parentId: 'Việc chọn danh mục này sẽ tạo ra vòng lặp'
      }))
      return
    }
    
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      parentId: parentId || '', // ✅ Keep empty string if no parent selected
    })
  }

  const handleClose = () => {
    if (isSubmitting || isLoadingEdit) return // ✅ Không cho đóng khi đang loading
    
    onClose()
    // ✅ Reset form sau khi đóng
    setTimeout(() => {
      setName('')
      setDescription('')
      setParentId('')
      setErrors({ name: '', description: '', parentId: '' })
    }, 200)
  }

  // ✅ Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting && !isLoadingEdit) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // ✅ Handle ESC key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && !isSubmitting && !isLoadingEdit) {
        handleClose()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscKey)
      return () => document.removeEventListener('keydown', handleEscKey)
    }
  }, [open, isSubmitting, isLoadingEdit])

  const isFormDisabled = isSubmitting || isLoadingEdit
  const canSubmit = name.trim() && !isFormDisabled && !isLoadingEdit

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => {
        if (isFormDisabled) e.preventDefault()
      }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isLoadingEdit && <Loader2 className="h-4 w-4 animate-spin" />}
            {initialData ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
          </DialogTitle>
        </DialogHeader>

        {/* ✅ Loading overlay khi đang load edit data */}
        {isLoadingEdit ? (
          <div className="py-8 flex items-center justify-center">
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Đang tải dữ liệu...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  // ✅ Clear error khi user bắt đầu nhập
                  if (errors.name && e.target.value.trim()) {
                    setErrors(prev => ({ ...prev, name: '' }))
                  }
                }}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tên danh mục"
                disabled={isFormDisabled}
                className={errors.name ? 'border-red-500 focus:ring-red-500' : ''}
                autoFocus={!isLoadingEdit}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mô tả</label>
              <Input
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  // ✅ Clear error khi user sửa
                  if (errors.description) {
                    setErrors(prev => ({ ...prev, description: '' }))
                  }
                }}
                onKeyPress={handleKeyPress}
                placeholder="Nhập mô tả danh mục"
                disabled={isFormDisabled}
                className={errors.description ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
              <p className="text-xs text-gray-500">
                {description.length}/500 ký tự
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Danh mục cha</label>
              <select
                value={parentId}
                onChange={(e) => {
                  setParentId(e.target.value)
                  // ✅ Clear error khi user thay đổi
                  if (errors.parentId) {
                    setErrors(prev => ({ ...prev, parentId: '' }))
                  }
                }}
                disabled={isFormDisabled}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.parentId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">-- Không có danh mục cha --</option>
                {flatCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {'—'.repeat(cat.level)} {cat.name}
                  </option>
                ))}
              </select>
              {errors.parentId && (
                <p className="text-sm text-red-500">{errors.parentId}</p>
              )}
              <p className="text-xs text-gray-500">
                Chỉ hiển thị tối đa 3 cấp danh mục
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isFormDisabled}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="min-w-[100px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {initialData ? 'Đang cập nhật...' : 'Đang thêm...'}
              </>
            ) : (
              initialData ? 'Cập nhật' : 'Thêm mới'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}