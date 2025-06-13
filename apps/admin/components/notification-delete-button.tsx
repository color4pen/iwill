"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { deleteNotification } from "@/app/actions/notifications"

interface NotificationDeleteButtonProps {
  notificationId: string
}

export default function NotificationDeleteButton({ notificationId }: NotificationDeleteButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("このお知らせを削除しますか？")) return

    setIsDeleting(true)
    try {
      await deleteNotification(notificationId)
      router.refresh()
    } catch (error) {
      console.error("Error:", error)
      alert("削除に失敗しました")
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-gray-500 hover:text-red-600 disabled:opacity-50"
      title="削除"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  )
}