"use client"

import { DeleteButton } from "@repo/ui/delete-button"
import { deleteSituation } from "@/app/actions/situations"

interface DeleteSituationButtonProps {
  id: string
  mediaCount: number
}

export default function DeleteSituationButton({ id, mediaCount }: DeleteSituationButtonProps) {
  if (mediaCount > 0) {
    return (
      <p className="text-sm text-gray-500 py-2">
        メディア {mediaCount} 件が関連付けられているため削除できません
      </p>
    )
  }

  return (
    <DeleteButton
      onDelete={() => deleteSituation(id)}
      confirmMessage="このメディアシチュエーションを削除してよろしいですか？"
      variant="button"
      size="md"
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    />
  )
}