'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Check, ChevronDown } from 'lucide-react'
import { CategoryRow } from '@/components/category-table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
    parentId: '',
  })

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
      setErrors({ name: '', description: '', parentId: '' })
    }
  }, [initialData, open])

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

    if (initialData && parentId && initialData.id === parentId) {
      newErrors.parentId = 'Không thể chọn chính nó làm danh mục cha'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const isDescendant = (category: CategoryRow, ancestorId: string): boolean => {
    if (!category.children) return false

    for (const child of category.children) {
      if (child.id === ancestorId || isDescendant(child, ancestorId)) {
        return true
      }
    }
    return false
  }

  const wouldCreateCircularReference = (categoryId: string, potentialParentId: string): boolean => {
    if (!potentialParentId) return false

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
      if (excludeId && (cat.id === excludeId || isDescendant(cat, excludeId))) return

      if (level <= 2) {
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
      parentId: parentId || '',
    })
  }

  const handleClose = () => {
    if (isSubmitting || isLoadingEdit) return

    onClose()
    setTimeout(() => {
      setName('')
      setDescription('')
      setParentId('')
      setErrors({ name: '', description: '', parentId: '' })
    }, 200)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting && !isLoadingEdit) {
      e.preventDefault()
      handleSubmit()
    }
  }

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
              <DialogTitle>
            {initialData ? 'Cập nhật danh mục' : 'Tạo danh mục'}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Chỉnh sửa thông tin danh mục đã có.'
              : 'Nhập thông tin để tạo danh mục mới.'}
          </DialogDescription>
        </DialogHeader>

        {isLoadingEdit ? (
          <div className="py-8 flex items-center justify-center text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <span>Đang tải dữ liệu...</span>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {/* Tên danh mục */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
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
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Mô tả */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mô tả</label>
              <Input
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  if (errors.description) {
                    setErrors(prev => ({ ...prev, description: '' }))
                  }
                }}
                onKeyPress={handleKeyPress}
                placeholder="Nhập mô tả danh mục"
                disabled={isFormDisabled}
                className={errors.description ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              <p className="text-xs text-gray-500">{description.length}/500 ký tự</p>
            </div>

            {/* Danh mục cha - dùng Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Danh mục cha</label>
              <Select
                value={parentId}
                onValueChange={(value) => {
                  setParentId(value)
                  if (errors.parentId) setErrors(prev => ({ ...prev, parentId: '' }))
                }}
                disabled={isFormDisabled}
              >
                <SelectTrigger className={`w-full ${errors.parentId ? 'border-red-500 ring-red-500' : ''}`}>
                  <SelectValue placeholder="-- Không có danh mục cha --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="text-sm">-- Không có danh mục cha --</span>
                  </SelectItem>
                  {flatCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span className={`${cat.level === 0 ? 'font-semibold text-base' : 'text-sm'}`}>
                        {'—'.repeat(cat.level)} {cat.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.parentId && <p className="text-sm text-red-500">{errors.parentId}</p>}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isFormDisabled}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit} className="min-w-[100px]">
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
