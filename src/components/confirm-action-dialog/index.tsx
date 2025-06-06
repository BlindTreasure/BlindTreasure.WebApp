'use client'

import * as React from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

type ConfirmActionDialogProps = {
  title: string
  description: string
  onConfirm: (reason?: string) => void
  trigger: React.ReactNode
  isPending?: boolean
  requireReason?: boolean // Thêm prop để yêu cầu lý do
  actionType?: 'ban' | 'unban' // Thêm prop để phân biệt loại action
}

export default function ConfirmActionDialog({
  title,
  description,
  onConfirm,
  trigger,
  isPending = false,
  requireReason = false,
  actionType = 'ban',
}: ConfirmActionDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [reason, setReason] = React.useState('')

  const handleConfirm = () => {
    onConfirm(reason)
    setOpen(false)
    setReason('') // Reset reason sau khi confirm
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setReason('') // Reset reason khi đóng dialog
    }
  }

  const isReasonRequired = requireReason && actionType === 'ban'
  const canConfirm = !isReasonRequired || (isReasonRequired && reason.trim().length > 0)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        {isReasonRequired && (
          <div className="space-y-2">
            <Label htmlFor="ban-reason">Lý do ban *</Label>
            <Textarea
              id="ban-reason"
              placeholder="Nhập lý do ban người dùng này..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              disabled={isPending}
            />
            {reason.trim().length === 0 && (
              <p className="text-sm text-red-500">Vui lòng nhập lý do ban</p>
            )}
          </div>
        )}

        <DialogFooter className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)} 
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm} 
            disabled={isPending || !canConfirm}
          >
            {isPending ? 'Đang xử lý...' : 'Xác nhận'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}