"use client"

import { useState } from "react"
import { Button } from "@/components/ui/form-elements"
import { deleteFAQ } from "@/app/actions/faq"

interface FAQDeleteButtonProps {
  id: string
}

export default function FAQDeleteButton({ id }: FAQDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("本当に削除しますか？")) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteFAQ(id)
    } catch (error) {
      console.error("Error deleting FAQ:", error)
      alert("削除に失敗しました")
      setIsDeleting(false)
    }
  }

  return (
    <Button
      onClick={handleDelete}
      disabled={isDeleting}
      variant="danger"
      size="sm"
    >
      {isDeleting ? "削除中..." : "削除"}
    </Button>
  )
}