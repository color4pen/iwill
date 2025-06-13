"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { sendMessage } from "@/app/actions/inquiries"

interface ChatInputProps {
  threadId: string
}

export default function ChatInput({ threadId }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim() || isSending) return

    setIsSending(true)
    try {
      await sendMessage(threadId, message.trim())
      setMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
      alert("メッセージの送信に失敗しました")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={!message.trim() || isSending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  )
}