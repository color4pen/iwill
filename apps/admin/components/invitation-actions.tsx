"use client"

import { useState } from "react"
import { Copy, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface InvitationActionsProps {
  invitationUrl: string
  invitationId: string
}

export default function InvitationActions({ invitationUrl, invitationId }: InvitationActionsProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(invitationUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    if (!confirm("この招待URLを削除しますか？")) return

    try {
      const response = await fetch(`/api/invitations/${invitationId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("削除に失敗しました")
      }
    } catch {
      alert("削除に失敗しました")
    }
  }

  return (
    <div className="ml-4 flex items-center space-x-2">
      <button
        onClick={handleCopy}
        className="p-2 text-gray-500 hover:text-gray-700"
        title="URLをコピー"
      >
        <Copy className={`h-5 w-5 ${copied ? 'text-green-500' : ''}`} />
      </button>
      <button
        onClick={handleDelete}
        className="p-2 text-gray-500 hover:text-red-600"
        title="削除"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  )
}