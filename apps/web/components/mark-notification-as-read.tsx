"use client"

import { useEffect } from "react"
import { markNotificationAsRead } from "@/app/actions/notifications"

export default function MarkNotificationAsRead({ notificationId }: { notificationId: string }) {
  useEffect(() => {
    markNotificationAsRead(notificationId).catch(console.error)
  }, [notificationId])
  
  return null
}