"use client"

import { DeleteButton } from "@repo/ui/delete-button"
import { deleteMedia } from "@/app/actions/media"

interface MediaDeleteButtonProps {
  id: string
}

export default function MediaDeleteButton({ id }: MediaDeleteButtonProps) {
  return (
    <DeleteButton
      onDelete={() => deleteMedia(id)}
      confirmMessage="このメディアを削除してよろしいですか？"
      variant="button"
      size="sm"
      className="text-red-600 hover:text-red-800"
    />
  )
}