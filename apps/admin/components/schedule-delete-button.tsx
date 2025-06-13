"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

interface ScheduleDeleteButtonProps {
  scheduleId: string
}

export default function ScheduleDeleteButton({ scheduleId }: ScheduleDeleteButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("このスケジュールを削除しますか？")) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("削除に失敗しました")
      }
    } catch {
      alert("削除に失敗しました")
    } finally {
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