'use client'

import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CategoryTable, { CategoryRow } from '@/components/category-table'
import useGetCategory from '../hooks/useGetCategory'
import useCreateCategory from '../hooks/useCreateCategory'
import useUpdateCategory from '../hooks/useUpdateCategory'
import useDeleteCategory from '../hooks/useDeleteCategory'
import useGetCategoryById from '../hooks/useGetCategoryById'
import Pagination from '@/components/pagination'
import CategoryFormModal from '@/components/category-form-modal'

export default function CategoryPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [allCategories, setAllCategories] = useState<CategoryRow[]>([]) // Store all nested categories
  const [expandedIds, setExpandedIds] = useState<string[]>([])
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingEdit, setIsLoadingEdit] = useState(false)

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 3
  })
  const [totalPages, setTotalPages] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)

  const { getCategoryApi } = useGetCategory()
  const { createCategoryApi, isPending: isCreating } = useCreateCategory()
  const { updateCategoryApi, isPending: isUpdating } = useUpdateCategory()
  const { deleteCategoryApi, isPending: isDeleting } = useDeleteCategory()
  const { getCategoryByIdApi } = useGetCategoryById()

  const buildNestedCategories = (flatList: CategoryRow[]): CategoryRow[] => {
    const map = new Map<string, CategoryRow>()
    const roots: CategoryRow[] = []

    flatList.forEach((item) => {
      map.set(item.id, { ...item, children: [] })
    })

    map.forEach((item) => {
      if (item.parentId && map.has(item.parentId)) {
        map.get(item.parentId)!.children!.push(item)
      } else {
        roots.push(item)
      }
    })

    return roots
  }

  const fetchData = async () => {
    // Fetch all categories first to build complete nested structure
    const res = await getCategoryApi({
      pageIndex: 1,
      pageSize: 1000 // Get all categories to build proper nested structure
    })

    const flatList = res?.value?.data?.result ?? []

    const mapped: CategoryRow[] = flatList.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      parentId: item.parentId,
    }))

    // Build complete nested structure
    const allNested = buildNestedCategories(mapped)
    setAllCategories(allNested)

    // Count only parent categories (root level)
    const rootCategories = allNested
    const totalRootCount = rootCategories.length
    const totalPages = Math.ceil(totalRootCount / pagination.pageSize)

    setTotalRecords(totalRootCount)
    setTotalPages(totalPages)

    // Apply pagination to parent categories only
    const startIndex = (pagination.pageIndex - 1) * pagination.pageSize
    const endIndex = startIndex + pagination.pageSize
    const paginatedRootCategories = rootCategories.slice(startIndex, endIndex)

    setCategories(paginatedRootCategories)
  }

  useEffect(() => {
    fetchData()
  }, [pagination.pageIndex, pagination.pageSize])

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleEdit = async (category: CategoryRow) => {
    try {
      setIsLoadingEdit(true)
      const categoryDetail = await getCategoryByIdApi(category.id)
      if (categoryDetail?.isSuccess) {
        setEditingCategory({
          id: categoryDetail.value.data.id,
          name: categoryDetail.value.data.name,
          description: categoryDetail.value.data.description,
          parentId: categoryDetail.value.data.parentId,
        })
      } else {
        console.error('Failed to fetch category details')
        setEditingCategory(category)
      }
      setShowModal(true)
    } catch (error) {
      console.error('Error fetching category details:', error)
      setEditingCategory(category)
      setShowModal(true)
    } finally {
      setIsLoadingEdit(false)
    }
  }

  const handleDelete = async (categoryId: string) => {
    const success = await deleteCategoryApi(categoryId)
    if (success?.isSuccess === true) {
      await fetchData()
    }
  }

  const handleAddNew = () => {
    setEditingCategory(null)
    setShowModal(true)
  }

  const handleSubmit = async (data: {
    name: string
    description: string
    parentId: string
  }) => {
    setIsSubmitting(true)
    let success

    if (editingCategory) {
      success = await updateCategoryApi(editingCategory.id, {
        name: data.name,
        description: data.description,
        parentId: data.parentId
      })
    } else {
      success = await createCategoryApi({
        name: data.name,
        description: data.description,
        parentId: data.parentId
      })
    }

    setIsSubmitting(false)

    if (success?.isSuccess === true) {
      setShowModal(false)
      setEditingCategory(null)
      await fetchData()
    }
  }

  const handlePageChange = (newPageIndex: number) => {
    if (newPageIndex >= 1 && newPageIndex <= totalPages) {
      setPagination(prev => ({
        ...prev,
        pageIndex: newPageIndex
      }))
    }
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination({
      pageIndex: 1, // Reset to first page when changing page size
      pageSize: newPageSize
    })
  }

  const handleDetail = async (category: CategoryRow) => {
    try {
      const categoryDetail = await getCategoryByIdApi(category.id)
    } catch (error) {
      console.error('Error fetching category details:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddNew}>
          <Plus size={16} className="mr-1" />
          Thêm danh mục
        </Button>
      </div>

      <CategoryTable
        categories={categories}
        expandedIds={expandedIds}
        onToggleExpand={toggleExpand}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDetail={handleDetail}
        isLoadingEdit={isLoadingEdit}
      />

      <div className="mt-10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Hiển thị:</span>
            <select 
              value={pagination.pageSize} 
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span className="text-sm text-gray-600">danh mục cha/trang</span>
          </div>
          <div className="text-sm text-gray-600">
            Tổng cộng: {totalRecords} danh mục cha
          </div>
        </div>

        <div className="flex justify-center">
          <Pagination
            currentPage={pagination.pageIndex}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <CategoryFormModal
        open={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingCategory(null)
        }}
        initialData={editingCategory}
        categories={allCategories} // Pass all categories for parent selection
        isSubmitting={isSubmitting || isCreating || isUpdating}
        onSubmit={handleSubmit}
        isLoadingEdit={isLoadingEdit}
      />
    </div>
  )
}