'use client'

import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CategoryTable, { CategoryRow } from '@/components/category-table'
import useGetCategory from '../hooks/useGetCategory'
import useCreateCategory from '../hooks/useCreateCategory'
import useUpdateCategory from '../hooks/useUpdateCategory'
import useDeleteCategory from "../hooks/useDeleteCategory";
import useGetCategoryById from '../hooks/useGetCategoryById'
import Pagination from '@/components/pagination'
import CategoryFormModal from '@/components/category-form-modal'

export default function CategoryPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [expandedIds, setExpandedIds] = useState<string[]>([])
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingEdit, setIsLoadingEdit] = useState(false)

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 20
  })
  const [totalPages, setTotalPages] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)

  const { getCategoryApi } = useGetCategory()
  const { createCategoryApi, isPending: isCreating } = useCreateCategory()
  const { updateCategoryApi, isPending: isUpdating } = useUpdateCategory()
  const { deleteCategoryApi, isPending: isDeleting } = useDeleteCategory();
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
    const res = await getCategoryApi({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize
    })

    const flatList = res?.value?.data?.result ?? []
    
    // ✅ Filter chỉ lấy categories chưa bị xóa (isDeleted === false)
    const activeCategories = flatList.filter((item) => item.isDeleted === false)

    // ✅ Filter chỉ lấy categories cấp 0 để tính pagination
    const rootCategories = activeCategories.filter((item) => !item.parentId)
    
    // ✅ Pagination chỉ dựa trên số lượng categories cấp 0
    const rootCount = rootCategories.length
    const totalPages = Math.ceil(rootCount / pagination.pageSize)

    setTotalRecords(rootCount)
    setTotalPages(totalPages)

    const mapped: CategoryRow[] = activeCategories.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      parentId: item.parentId,
    }))

    const nested = buildNestedCategories(mapped)
    setCategories(nested)
  }

  useEffect(() => {
    fetchData()
  }, [pagination.pageIndex, pagination.pageSize])

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  // ✅ Sửa lại handleEdit để call API get by ID
  const handleEdit = async (category: CategoryRow) => {
    try {
      setIsLoadingEdit(true)
      
      // ✅ Gọi API để lấy chi tiết category
      const categoryDetail = await getCategoryByIdApi(category.id)
      
      if (categoryDetail?.isSuccess) {
        // ✅ Set dữ liệu chi tiết từ API thay vì dữ liệu từ table
        setEditingCategory({
          id: categoryDetail.value.data.id,
          name: categoryDetail.value.data.name,
          description: categoryDetail.value.data.description,
          parentId: categoryDetail.value.data.parentId,
        })
        setShowModal(true)
      } else {
        // ✅ Fallback nếu API failed
        console.error('Failed to fetch category details')
        setEditingCategory(category)
        setShowModal(true)
      }
    } catch (error) {
      console.error('Error fetching category details:', error)
      // ✅ Fallback nếu có lỗi
      setEditingCategory(category)
      setShowModal(true)
    } finally {
      setIsLoadingEdit(false)
    }
  }

  const handleDelete = async (categoryId: string) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xoá danh mục này?");
    if (!confirmed) return;

    const success = await deleteCategoryApi(categoryId);

    if (success?.isSuccess === true) {
      await fetchData();
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
      // ✅ Create new category
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
      pageIndex: 1,
      pageSize: newPageSize
    })
  }

  // ✅ Handle detail view (nếu cần)
  const handleDetail = async (category: CategoryRow) => {
    try {
      const categoryDetail = await getCategoryByIdApi(category.id)
      if (categoryDetail?.isSuccess) {
        // ✅ Xử lý hiển thị detail - có thể mở modal khác hoặc navigate
        console.log('Category detail:', categoryDetail.value.data)
        // Implement detail view logic here
      }
    } catch (error) {
      console.error('Error fetching category details:', error)
    }
  }

  console.log(categories);

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
            <span className="text-sm text-gray-600">mục/trang</span>
          </div>
          <div className="text-sm text-gray-600">
            Tổng cộng: {totalRecords} mục
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
        categories={categories}
        isSubmitting={isSubmitting || isCreating || isUpdating}
        onSubmit={handleSubmit}
        isLoadingEdit={isLoadingEdit}
      />
    </div>
  )
}