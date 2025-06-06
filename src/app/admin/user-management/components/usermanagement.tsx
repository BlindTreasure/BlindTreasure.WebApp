'use client'

import React, { useEffect, useState } from 'react'
import UserTable, { UserRow } from '@/components/user-table'
import useGetAllUser from '../hooks/useGetAllUser'

export default function UserPage() {
  const { isPending, getAllUserApi } = useGetAllUser()
  const [users, setUsers] = useState<UserRow[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getAllUserApi({})
      if (res?.value?.data) {
        const formattedUsers: UserRow[] = res.value.data.result.map((user: any) => ({
          id: user.userId,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          status: user.status,
          roleName: user.roleName,
        }))
        setUsers(formattedUsers)
      }
    }

    fetchUsers()
  }, [])

  // Hàm xử lý toggle status với lý do ban
  const handleToggleStatus = async (userId: string, reason?: string) => {
    try {
      console.log('Toggle status for user:', userId)
      if (reason) {
        console.log('Ban reason:', reason)
      }
      
      // Tìm user hiện tại
      const currentUser = users.find(user => user.id === userId)
      if (!currentUser) return

      // Đây là nơi bạn gọi API để thay đổi status
      // Ví dụ:
      // if (currentUser.status === 'Active') {
      //   await banUserApi(userId, reason) // Gửi lý do ban lên server
      // } else {
      //   await unbanUserApi(userId)
      // }
      
      // Cập nhật state local (tạm thời)
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
            : user
        )
      )
      
      // Hoặc refetch data sau khi update
      // fetchUsers()
      
    } catch (error) {
      console.error('Error toggling user status:', error)
      // Hiển thị toast error nếu cần
    }
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý người dùng</h1>
      <UserTable 
        users={users} 
        isLoadingEdit={isPending}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  )
}