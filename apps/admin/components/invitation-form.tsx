"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { invitationConfig } from "@/config/invitation"
import { Input, Select, Button } from "@/components/ui/form-elements"
import { createInvitation } from "@/app/actions/invitations"
import InvitationMessageEditor from "./invitation-message-editor"

export default function InvitationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    expiresIn: "30", // days
    notes: invitationConfig.messageTemplate
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formDataObj = new FormData(e.currentTarget)
    await createInvitation(formDataObj)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow sm:rounded-lg p-6">
      <div className="space-y-6">
        <div>
          <Input
            id="name"
            name="name"
            label="招待者名（オプション）"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="山田 太郎"
          />
          <p className="mt-1 text-sm text-gray-500">
            招待URLを送る相手の名前を記録できます
          </p>
        </div>

        <div>
          <Input
            id="email"
            name="email"
            label="メールアドレス（オプション）"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="example@email.com"
          />
          <p className="mt-1 text-sm text-gray-500">
            特定のメールアドレス用の招待URLとして記録できます
          </p>
        </div>

        <Select
          id="expiresIn"
          name="expiresIn"
          label="有効期限"
          value={formData.expiresIn}
          onChange={(e) => setFormData({ ...formData, expiresIn: e.target.value })}
        >
          <option value="">無期限</option>
          <option value="7">7日間</option>
          <option value="30">30日間</option>
          <option value="60">60日間</option>
          <option value="90">90日間</option>
        </Select>

        <InvitationMessageEditor
          value={formData.notes}
          onChange={(value) => setFormData({ ...formData, notes: value })}
        />
      </div>

      <div className="mt-6 flex items-center justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/invitations")}
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "発行中..." : "発行"}
        </Button>
      </div>
    </form>
  )
}