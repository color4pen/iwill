"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input, Select, Textarea, Button } from "@/components/ui/form-elements"
import { createNotification, updateNotification } from "@/app/actions/notifications"
import { Notification, NotificationCategory } from "@prisma/client"

interface NotificationFormProps {
  notification?: Notification
}

export default function NotificationForm({ notification }: NotificationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: notification?.title || "",
    content: notification?.content || "",
    category: notification?.category || "GENERAL",
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formDataObj = new FormData(e.currentTarget)
    // Priority is always NORMAL for now
    formDataObj.set("priority", "NORMAL")
    
    if (notification) {
      await updateNotification(notification.id, formDataObj)
    } else {
      await createNotification(formDataObj)
    }
    // Server Actionがredirectを実行するため、ここには到達しない
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-6">
          <Input
            id="title"
            name="title"
            label="タイトル"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <Select
            id="category"
            name="category"
            label="カテゴリー"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as NotificationCategory })}
          >
            <option value="GENERAL">一般</option>
            <option value="SCHEDULE">スケジュール</option>
            <option value="VENUE">会場</option>
            <option value="IMPORTANT">重要</option>
          </Select>

          <Textarea
            id="content"
            name="content"
            label="内容"
            rows={10}
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="お知らせの内容を入力してください..."
          />
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/notifications")}
          className="mr-3"
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "保存中..." : "保存"}
        </Button>
      </div>
    </form>
  )
}