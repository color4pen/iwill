"use client"

import { useEffect, useRef } from "react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: string
  content: string
  createdAt: Date
}

interface ChatMessagesProps {
  messages: Message[]
  currentUserId?: string
  variant?: 'user' | 'admin'
}

export default function ChatMessages({ 
  messages, 
  currentUserId,
  variant = 'user'
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 space-y-4">
      {messages.map((message) => {
        // 自分のメッセージかどうか（currentUserIdが提供されている場合）
        const isOwnMessage = currentUserId ? message.senderId === currentUserId : false

        return (
          <div
            key={message.id}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-md ${isOwnMessage ? 'order-2' : ''}`}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs text-gray-500">
                  {message.senderName}
                </span>
                <span className="text-xs text-gray-400">
                  {format(new Date(message.createdAt), 'HH:mm', { locale: ja })}
                </span>
              </div>
              <div
                className={`rounded-lg px-4 py-2 ${
                  isOwnMessage
                    ? variant === 'admin' 
                      ? 'bg-gray-700 text-white'
                      : 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
              </div>
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}