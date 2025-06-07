"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
  isActive: boolean
}

interface FAQFormProps {
  faq?: FAQ
}

export default function FAQForm({ faq }: FAQFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    question: faq?.question || "",
    answer: faq?.answer || "",
    category: faq?.category || "GENERAL",
    order: faq?.order || 1,
    isActive: faq?.isActive ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = faq ? `/api/faq/${faq.id}` : "/api/faq"
      const method = faq ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/faq")
        router.refresh()
      } else {
        alert("エラーが発生しました")
      }
    } catch (error) {
      alert("エラーが発生しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow sm:rounded-lg p-6">
      <div className="space-y-6">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700">
            質問 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="question"
            id="question"
            required
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
            回答 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="answer"
            name="answer"
            rows={4}
            required
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              カテゴリー <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="GENERAL">一般</option>
              <option value="VENUE">会場・受付</option>
              <option value="GIFT">ご祝儀・ギフト</option>
              <option value="ATTENDANCE">出席情報</option>
              <option value="MEDIA">メディア</option>
            </select>
          </div>

          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700">
              表示順 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="order"
              id="order"
              required
              min="1"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <p className="mt-1 text-sm text-gray-500">
              数字が小さいほど上に表示されます
            </p>
          </div>

          <div>
            <label htmlFor="isActive" className="block text-sm font-medium text-gray-700">
              公開状態
            </label>
            <div className="mt-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">公開する</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.push("/faq")}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? "保存中..." : faq ? "更新" : "作成"}
        </button>
      </div>
    </form>
  )
}