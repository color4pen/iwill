"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface FAQ {
  id: string
  isActive: boolean
}

interface FAQActiveToggleProps {
  faq: FAQ
}

export default function FAQActiveToggle({ faq }: FAQActiveToggleProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggle = async () => {
    setIsUpdating(true)

    try {
      const response = await fetch(`/api/faq/${faq.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !faq.isActive,
        }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to update FAQ status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isUpdating}
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        faq.isActive
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-800"
      } hover:opacity-80 disabled:opacity-50`}
    >
      {faq.isActive ? "公開中" : "非公開"}
    </button>
  )
}