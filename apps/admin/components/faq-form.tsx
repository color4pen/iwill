"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input, Select, Textarea, Checkbox, Button } from "@/components/ui/form-elements"
import { createFAQ, updateFAQ } from "@/app/actions/faq"

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formDataObj = new FormData(e.currentTarget)
    
    // チェックボックスの値を正しく設定
    if (formData.isActive) {
      formDataObj.set("isActive", "on")
    } else {
      formDataObj.delete("isActive")
    }
    
    if (faq) {
      await updateFAQ(faq.id, formDataObj)
    } else {
      await createFAQ(formDataObj)
    }
    // Server Actionがredirectを実行するため、ここには到達しない
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow sm:rounded-lg p-6">
      <div className="space-y-6">
        <Input
          id="question"
          name="question"
          label="質問"
          type="text"
          required
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
        />

        <Textarea
          id="answer"
          name="answer"
          label="回答"
          rows={4}
          required
          value={formData.answer}
          onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Select
            id="category"
            name="category"
            label="カテゴリー"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="GENERAL">一般</option>
            <option value="VENUE">会場・受付</option>
            <option value="GIFT">ご祝儀・ギフト</option>
            <option value="ATTENDANCE">出席情報</option>
            <option value="MEDIA">メディア</option>
          </Select>

          <div>
            <Input
              id="order"
              name="order"
              label="表示順"
              type="number"
              required
              min="1"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
            />
            <p className="mt-1 text-sm text-gray-500">
              数字が小さいほど上に表示されます
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              公開状態
            </label>
            <Checkbox
              id="isActive"
              name="isActive"
              label="公開する"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/faq")}
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "保存中..." : faq ? "更新" : "作成"}
        </Button>
      </div>
    </form>
  )
}