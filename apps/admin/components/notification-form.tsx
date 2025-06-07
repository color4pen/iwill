"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = notification 
        ? `/api/notifications/${notification.id}`
        : "/api/notifications"
      
      const method = notification ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/notifications")
        router.refresh()
      } else {
        alert("保存に失敗しました")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("エラーが発生しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              タイトル
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm form-input"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              カテゴリー
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as NotificationCategory })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm form-select"
            >
              <option value="GENERAL">一般</option>
              <option value="SCHEDULE">スケジュール</option>
              <option value="VENUE">会場</option>
              <option value="IMPORTANT">重要</option>
            </select>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              内容
            </label>
            <textarea
              id="content"
              name="content"
              rows={10}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm form-textarea"
              placeholder="お知らせの内容を入力してください..."
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button
          type="button"
          onClick={() => router.push("/notifications")}
          className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? "保存中..." : "保存"}
        </button>
      </div>
    </form>
  )
}