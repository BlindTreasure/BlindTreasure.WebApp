'use client'

import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import CategoryTable, { CategoryRow } from '@/components/category-table'
import useGetCategory from '../hooks/useGetCategory'
import useDeleteCategory from '../hooks/useDeleteCategory'
import useGetCategoryById from '../hooks/useGetCategoryById'
import Pagination from '@/components/pagination'

export default function CategoryPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [allCategories, setAllCategories] = useState<CategoryRow[]>([])
  const [expandedIds, setExpandedIds] = useState<string[]>([])
  const [isLoadingEdit, setIsLoadingEdit] = useState(false)

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 3 
  })
  const [totalPages, setTotalPages] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)

  const { getCategoryApi } = useGetCategory()
  const { deleteCategoryApi, isPending: isDeleting } = useDeleteCategory()
  const { getCategoryByIdApi } = useGetCategoryById()

  const fetchData = async () => {
    const res = await getCategoryApi({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize
    })

    const result = res?.value?.data

    const nestedCategories: CategoryRow[] = result?.result ?? []

    setCategories(nestedCategories)
    setAllCategories(nestedCategories)
    setTotalRecords(result?.count ?? 0)
    setTotalPages(result?.totalPages ?? 0)
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
    // Chuyển hướng đến trang edit với ID
    router.push(`/staff/form/${category.id}`)
  }

  const handleDelete = async (categoryId: string) => {
    const success = await deleteCategoryApi(categoryId)
    if (success?.isSuccess === true) {
      await fetchData()
    }
  }

  const handleAddNew = () => {
    // Chuyển hướng đến trang form để tạo mới
    router.push('/staff/form')
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

  const handleDetail = async (category: CategoryRow) => {
    try {
      const categoryDetail = await getCategoryByIdApi(category.id)
      // Optional: xử lý nếu cần hiển thị chi tiết
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
    </div>
  )
}