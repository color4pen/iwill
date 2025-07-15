"use client"

import { DeleteButton } from "@repo/ui/delete-button"
import { deleteFAQ } from "@/app/actions/faq"

interface FAQDeleteButtonProps {
  id: string
}

export default function FAQDeleteButton({ id }: FAQDeleteButtonProps) {
  return (
    <DeleteButton
      onDelete={() => deleteFAQ(id)}
      confirmMessage="本当に削除しますか？"
      variant="button"
      size="sm"
      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
    />
  )
}