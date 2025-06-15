"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AutoRefreshMessages({ threadId }: { threadId: string }) {
  const router = useRouter()

  useEffect(() => {
    // 5秒ごとにページをリフレッシュ
    const interval = setInterval(() => {
      router.refresh()
    }, 5000)

    return () => clearInterval(interval)
  }, [threadId, router])

  return null
}