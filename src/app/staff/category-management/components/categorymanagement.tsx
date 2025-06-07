'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Search, X } from 'lucide-react'
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
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 3 
  })
  const [totalPages, setTotalPages] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)

  const { getCategoryApi } = useGetCategory()
  const { deleteCategoryApi, isPending: isDeleting } = useDeleteCategory()
  const { getCategoryByIdApi } = useGetCategoryById()

  const fetchData = async (search?: string) => {
    setIsSearching(true)
    try {
      const res = await getCategoryApi({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        search: search || searchTerm || undefined
      })

      const result = res?.value?.data
      const nestedCategories: CategoryRow[] = result?.result ?? []

      setCategories(nestedCategories)
      setAllCategories(nestedCategories)
      setTotalRecords(result?.count ?? 0)
      setTotalPages(result?.totalPages ?? 0)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [pagination.pageIndex, pagination.pageSize])

  // Debounce search - tự động search khi có thay đổi
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setPagination(prev => ({ ...prev, pageIndex: 1 }))
      fetchData(searchTerm)
    }, 500)

    return () => clearTimeout(delayedSearch)
  }, [searchTerm])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    // Không cần xử lý thêm gì vì useEffect sẽ tự động handle
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submit không cần thiết nữa vì đã có auto search
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    // Không cần gọi fetchData ở đây vì useEffect sẽ tự động handle khi searchTerm thay đổi
  }

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleEdit = async (category: CategoryRow) => {
    router.push(`/staff/form/${category.id}`)
  }

  const handleDelete = async (categoryId: string) => {
    const success = await deleteCategoryApi(categoryId)
    if (success?.isSuccess === true) {
      await fetchData()
    }
  }

  const handleAddNew = () => {
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
    <div className="space-y-6">
      {/* Header với Search và Add button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="relative">
              <Search 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Tìm kiếm danh mục..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Xóa tìm kiếm"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          {searchTerm && (
            <div className="mt-1 text-sm text-gray-500">
              {isSearching ? 'Đang tìm kiếm...' : `Kết quả cho: "${searchTerm}"`}
            </div>
          )}
        </div>

        {/* Add New Button */}
        <Button onClick={handleAddNew} className="whitespace-nowrap">
          <Plus size={16} className="mr-1" />
          Thêm danh mục
        </Button>
      </div>

      {/* Category Table */}
      <CategoryTable
        categories={categories}
        expandedIds={expandedIds}
        onToggleExpand={toggleExpand}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDetail={handleDetail}
        isLoadingEdit={isLoadingEdit}
      />

      {/* Pagination */}
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
            {searchTerm && ` (đã lọc)`}
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