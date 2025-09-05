"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { deleteNotification } from "@/app/actions/notifications"

interface DeleteNotificationButtonProps {
  notificationId: string
}

export default function DeleteNotificationButton({ notificationId }: DeleteNotificationButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("このお知らせを削除してもよろしいですか？")) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteNotification(notificationId)
      router.refresh()
    } catch (error) {
      alert("削除に失敗しました")
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-red-500 hover:text-red-700 disabled:opacity-50"
      aria-label="削除"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  )
}