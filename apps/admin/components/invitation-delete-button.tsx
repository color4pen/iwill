"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { deleteInvitation } from "@/app/actions/invitations"

interface InvitationDeleteButtonProps {
  invitationId: string
}

export default function InvitationDeleteButton({ invitationId }: InvitationDeleteButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("この招待URLを削除しますか？")) return

    setIsDeleting(true)
    try {
      await deleteInvitation(invitationId)
      router.refresh()
    } catch (error) {
      alert("削除に失敗しました")
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-gray-500 hover:text-red-600 disabled:opacity-50"
      title="削除"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  )
}