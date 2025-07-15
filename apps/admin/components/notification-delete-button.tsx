"use client"

import { DeleteButton } from "@repo/ui/delete-button"
import { deleteNotification } from "@/app/actions/notifications"

interface NotificationDeleteButtonProps {
  notificationId: string
}

export default function NotificationDeleteButton({ notificationId }: NotificationDeleteButtonProps) {
  return (
    <DeleteButton
      onDelete={() => deleteNotification(notificationId)}
      confirmMessage="このお知らせを削除しますか？"
      variant="icon"
      size="md"
    />
  )
}