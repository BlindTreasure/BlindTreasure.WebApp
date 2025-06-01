'use client'

import React from 'react'
import { ChevronDown, ChevronRight, Pencil, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type CategoryRow = {
  id: string
  name: string
  description: string
  parentId?: string
  children?: CategoryRow[]
}

type Props = {
  categories: CategoryRow[]
  expandedIds: string[]
  onToggleExpand: (id: string) => void
  onEdit?: (category: CategoryRow) => void // ✅ Nhận category object thay vì chỉ ID
  onDelete?: (categoryId: string) => void
  onDetail?: (category: CategoryRow) => void // ✅ Nhận category object thay vì chỉ ID
  isLoadingEdit?: boolean // ✅ Loading state cho edit
}

export default function CategoryTable({
  categories,
  expandedIds,
  onToggleExpand,
  onEdit,
  onDelete,
  onDetail,
  isLoadingEdit = false
}: Props) {
  const renderRow = (category: CategoryRow, level = 0): JSX.Element[] => {
    const isExpanded = expandedIds.includes(category.id)
    const hasChildren = category.children && category.children.length > 0

    const row = (
      <tr key={category.id} className="border-t border-gray-200 hover:bg-gray-50">
        <td className="px-4 py-3 bg-white">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 20}px` }}>
            {hasChildren ? (
              <button
                type="button"
                onClick={() => onToggleExpand(category.id)}
                className="focus:outline-none"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
            ) : (
              <div className="w-4 h-4" />
            )}
            <span className="font-medium text-gray-900">{category.name}</span>
          </div>
        </td>
        <td className="px-4 py-3 bg-white text-gray-700">{category.description}</td>
        <td className="px-4 py-3 bg-white text-right space-x-2">
          
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(category)}
              disabled={isLoadingEdit}
            >
              <Pencil size={16} className="mr-1" /> 
              {isLoadingEdit ? 'Đang tải...' : 'Sửa'}
            </Button>
          )}

          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(category.id)}
            >
              <Trash2 size={16} className="mr-1" /> Xoá
            </Button>
          )}
        </td>
      </tr>
    )

    const childrenRows =
      isExpanded && hasChildren
        ? category.children!.flatMap((child) => renderRow(child, level + 1))
        : []

    return [row, ...childrenRows]
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm px-2 sm:px-4">
      <table className="w-full min-w-[600px] bg-white text-sm">
        <thead className="bg-white text-gray-700 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left">Tên danh mục</th>
            <th className="px-4 py-3 text-left">Mô tả</th>
            <th className="px-4 py-3 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>{categories.flatMap((category) => renderRow(category))}</tbody>
      </table>
    </div>
  )
}