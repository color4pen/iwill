"use client"

import { useState } from "react"
import { createInquiryThread } from "@/app/actions/inquiries"
import { InquiryCategory } from "@prisma/client"
import { paths } from "@/lib/paths"

export default function NewInquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const title = formData.get("title") as string
      const category = formData.get("category") as InquiryCategory
      const message = formData.get("message") as string

      await createInquiryThread(title, category, message)
    } catch (error) {
      alert("問い合わせの送信に失敗しました。もう一度お試しください。")
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          件名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
          placeholder="例: 会場へのアクセスについて"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          カテゴリ <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          name="category"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
        >
          <option value="">選択してください</option>
          <option value="GENERAL">一般的な質問</option>
          <option value="ATTENDANCE">出欠について</option>
          <option value="VENUE">会場について</option>
          <option value="GIFT">ご祝儀・ギフトについて</option>
          <option value="OTHER">その他</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          お問い合わせ内容 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
          placeholder="お問い合わせ内容を詳しくご記入ください"
        />
      </div>

      <div className="flex justify-end gap-4">
        <a
          href={paths.contact.index}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          キャンセル
        </a>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "送信中..." : "送信"}
        </button>
      </div>
    </form>
  )
}