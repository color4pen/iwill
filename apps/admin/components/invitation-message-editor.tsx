"use client"

import { Textarea } from "@/components/ui/form-elements"

interface InvitationMessageEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  rows?: number
}

export default function InvitationMessageEditor({ 
  value, 
  onChange, 
  label = "招待メッセージ",
  rows = 10 
}: InvitationMessageEditorProps) {
  return (
    <div>
      <Textarea
        id="notes"
        name="notes"
        label={label}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="招待URLと一緒に送るメッセージ"
      />
      <p className="mt-1 text-sm text-gray-500">
        {'{url}'} は自動的に招待URLに置き換えられます
      </p>
    </div>
  )
}