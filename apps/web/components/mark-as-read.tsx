"use client"

import { useEffect } from "react"
import { markMessagesAsRead } from "@/app/actions/inquiries"

export default function MarkAsRead({ threadId }: { threadId: string }) {
  useEffect(() => {
    markMessagesAsRead(threadId)
  }, [threadId])

  return null
}