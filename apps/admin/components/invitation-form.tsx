"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function InvitationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    expiresIn: "30", // days
    notes: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const expiresAt = formData.expiresIn 
        ? new Date(Date.now() + parseInt(formData.expiresIn) * 24 * 60 * 60 * 1000).toISOString()
        : null

      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          expiresAt
        }),
      })

      if (response.ok) {
        router.push("/invitations")
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            招待者名（オプション）
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="山田 太郎"
          />
          <p className="mt-1 text-sm text-gray-500">
            招待URLを送る相手の名前を記録できます
          </p>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            メールアドレス（オプション）
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="example@email.com"
          />
          <p className="mt-1 text-sm text-gray-500">
            特定のメールアドレス用の招待URLとして記録できます
          </p>
        </div>

        <div>
          <label htmlFor="expiresIn" className="block text-sm font-medium text-gray-700">
            有効期限
          </label>
          <select
            id="expiresIn"
            name="expiresIn"
            value={formData.expiresIn}
            onChange={(e) => setFormData({ ...formData, expiresIn: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">無期限</option>
            <option value="7">7日間</option>
            <option value="30">30日間</option>
            <option value="60">60日間</option>
            <option value="90">90日間</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            管理者用メモ（オプション）
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="この招待URLに関するメモ"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.push("/invitations")}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? "発行中..." : "発行"}
        </button>
      </div>
    </form>
  )
}