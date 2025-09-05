"use client"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { sendMessage } from "@/app/actions/inquiries"

interface ChatInputProps {
  threadId: string
}

export default function ChatInput({ threadId }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [message])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim() || isSending) return

    setIsSending(true)
    try {
      await sendMessage(threadId, message.trim())
      setMessage("")
    } catch (error) {
      alert("メッセージの送信に失敗しました")
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 日本語入力の変換中は送信しない
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      const form = e.currentTarget.form
      if (form) {
        const submitEvent = new Event('submit', { cancelable: true, bubbles: true })
        form.dispatchEvent(submitEvent)
      }
    }
  }

  return (
    <div className="flex-shrink-0 bg-white border-t">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="メッセージを入力..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-none overflow-y-auto"
            style={{ minHeight: '44px', maxHeight: '128px' }}
            disabled={isSending}
            autoFocus
            rows={1}
          />
          <button
            type="submit"
            disabled={!message.trim() || isSending}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  )
}