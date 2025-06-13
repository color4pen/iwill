"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input, Select, Textarea, Checkbox, Button } from "@/components/ui/form-elements"

const iconOptions = [
  { value: "Users", label: "人々（Users）" },
  { value: "Church", label: "教会（Church）" },
  { value: "Utensils", label: "食事（Utensils）" },
  { value: "Clock", label: "時計（Clock）" },
  { value: "Music", label: "音楽（Music）" },
  { value: "Camera", label: "カメラ（Camera）" },
  { value: "Heart", label: "ハート（Heart）" },
  { value: "Gift", label: "ギフト（Gift）" },
]

const colorOptions = [
  { bg: "bg-blue-100", text: "text-blue-600", label: "青" },
  { bg: "bg-pink-100", text: "text-pink-600", label: "ピンク" },
  { bg: "bg-amber-100", text: "text-amber-600", label: "アンバー" },
  { bg: "bg-green-100", text: "text-green-600", label: "緑" },
  { bg: "bg-purple-100", text: "text-purple-600", label: "紫" },
  { bg: "bg-red-100", text: "text-red-600", label: "赤" },
  { bg: "bg-gray-100", text: "text-gray-600", label: "グレー" },
]

interface ScheduleFormProps {
  initialData?: {
    id?: string
    time?: string
    title?: string
    description?: string
    icon?: string
    colorBg?: string
    colorText?: string
    order?: number
    isActive?: boolean
  }
}

export default function ScheduleForm({ initialData }: ScheduleFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    time: initialData?.time || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    icon: initialData?.icon || "",
    colorBg: initialData?.colorBg || "bg-gray-100",
    colorText: initialData?.colorText || "text-gray-600",
    order: initialData?.order || 0,
    isActive: initialData?.isActive ?? true,
  })

  const selectedColor = colorOptions.find(
    (color) => color.bg === formData.colorBg && color.text === formData.colorText
  )

  const handleColorChange = (bg: string, text: string) => {
    setFormData({ ...formData, colorBg: bg, colorText: text })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = initialData?.id 
        ? `/api/schedules/${initialData.id}`
        : "/api/schedules"
      
      const method = initialData?.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/schedules")
        router.refresh()
      } else {
        alert("エラーが発生しました")
      }
    } catch {
      alert("エラーが発生しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow sm:rounded-lg p-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            id="time"
            label="時刻（必須）"
            type="text"
            required
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            placeholder="14:30"
          />

          <Input
            id="order"
            label="表示順"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            min="0"
          />
        </div>

        <Input
          id="title"
          label="イベント名（必須）"
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="挙式"
        />

        <Textarea
          id="description"
          label="説明（オプション）"
          rows={2}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="チャペルでの挙式となります"
        />

        <Select
          id="icon"
          label="アイコン（オプション）"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
        >
          <option value="">なし</option>
          {iconOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            色
          </label>
          <div className="grid grid-cols-4 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.label}
                type="button"
                onClick={() => handleColorChange(color.bg, color.text)}
                className={`p-4 rounded-md border-2 ${
                  selectedColor?.label === color.label
                    ? "border-blue-500"
                    : "border-gray-200"
                } ${color.bg}`}
              >
                <span className={`block text-sm font-medium ${color.text}`}>
                  {color.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Checkbox
          id="isActive"
          label="公開する"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
        />
      </div>

      <div className="mt-6 flex items-center justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/schedules")}
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "保存中..." : initialData?.id ? "更新" : "作成"}
        </Button>
      </div>
    </form>
  )
}