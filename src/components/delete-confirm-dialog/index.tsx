'use client'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ReactNode } from 'react'

interface DeleteConfirmDialogProps {
  trigger: ReactNode
  onConfirm: () => void
  isPending?: boolean
  title?: ReactNode
  description?: ReactNode
}

export default function DeleteConfirmDialog({
  trigger,
  onConfirm,
  isPending,
  title = 'Xác nhận xoá',
  description = 'Bạn có chắc chắn muốn xoá mục này? Hành động này không thể hoàn tác.',
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <Button onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Đang xoá...' : 'Xoá'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
