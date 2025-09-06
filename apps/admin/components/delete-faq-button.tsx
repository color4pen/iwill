"use client"

import { DeleteButton } from "@repo/ui/delete-button"
import { deleteFAQ } from "@/app/actions/faq"

interface DeleteFAQButtonProps {
  faqId: string
}

export default function DeleteFAQButton({ faqId }: DeleteFAQButtonProps) {
  return (
    <DeleteButton
      onDelete={() => deleteFAQ(faqId)}
      confirmMessage="このFAQを削除しますか？"
      variant="icon"
      size="md"
    />
  )
}