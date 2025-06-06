'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import ConfirmActionDialog from '@/components/confirm-action-dialog'

export type UserRow = {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  status: string // 'Active' | 'Inactive'
  roleName: string
}

type Props = {
  users: UserRow[]
  onToggleStatus?: (userId: string, reason?: string) => void
  isLoadingEdit?: boolean
}

export default function UserTable({
  users,
  onToggleStatus,
  isLoadingEdit = false,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border-y border-gray-200 shadow-sm">
      <table className="w-full min-w-[800px] bg-white text-sm">
        <thead className="bg-white text-gray-700 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left">Họ tên</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Số điện thoại</th>
            <th className="px-4 py-3 text-left">Trạng thái</th>
            <th className="px-4 py-3 text-left">Vai trò</th>
            <th className="px-4 py-3 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              <td className="px-4 py-3 bg-white">{user.fullName}</td>
              <td className="px-4 py-3 bg-white">{user.email}</td>
              <td className="px-4 py-3 bg-white">{user.phoneNumber}</td>
              <td className="px-4 py-3 bg-white">
                <span
                  className={`inline-block px-3 py-1 text-xs rounded-full font-semibold ${
                    user.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {user.status === 'Active' ? 'Active' : 'Locked'}
                </span>
              </td>
              <td className="px-4 py-3 bg-white">{user.roleName}</td>
              <td className="px-4 py-3 bg-white text-right">
                {onToggleStatus && (
                  <ConfirmActionDialog
                    onConfirm={(reason) => onToggleStatus(user.id, reason)}
                    isPending={isLoadingEdit}
                    title={`Xác nhận ${user.status === 'Active' ? 'ban' : 'bỏ ban'} người dùng`}
                    description={`Bạn có chắc chắn muốn ${
                      user.status === 'Active' ? 'ban' : 'bỏ ban'
                    } người dùng "${user.fullName}" không?`}
                    requireReason={user.status === 'Active'} // Chỉ yêu cầu lý do khi ban
                    actionType={user.status === 'Active' ? 'ban' : 'unban'}
                    trigger={
                      <Button
                        variant={user.status === 'Active' ? 'destructive' : 'outline'}
                        size="sm"
                      >
                        {user.status === 'Active' ? 'Ban' : 'Bỏ ban'}
                      </Button>
                    }
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}