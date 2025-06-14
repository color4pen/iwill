"use client"

import { useEffect } from "react"
import { markAdminMessagesAsRead } from "@/app/actions/inquiries"

export default function AdminMarkAsRead({ 
  threadId, 
  userId 
}: { 
  threadId: string
  userId: string 
}) {
  useEffect(() => {
    markAdminMessagesAsRead(threadId, userId)
  }, [threadId, userId])

  return null
}