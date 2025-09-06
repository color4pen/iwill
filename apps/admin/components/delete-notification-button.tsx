"use client"

import { DeleteButton } from "@repo/ui/delete-button"
import { deleteNotification } from "@/app/actions/notifications"

interface DeleteNotificationButtonProps {
  notificationId: string
}

export default function DeleteNotificationButton({ notificationId }: DeleteNotificationButtonProps) {
  return (
    <DeleteButton
      onDelete={() => deleteNotification(notificationId)}
      confirmMessage="このお知らせを削除してもよろしいですか？"
      className="text-red-500 hover:text-red-700"
    />
  )
}