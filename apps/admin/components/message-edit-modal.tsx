"use client"

import { useState, useEffect } from "react"
import { X, Share2, Copy } from "lucide-react"

interface MessageEditModalProps {
  isOpen: boolean
  onClose: () => void
  onCopy: (message: string) => void
  initialMessage: string
  invitationUrl: string
}

export default function MessageEditModal({ 
  isOpen, 
  onClose, 
  onCopy, 
  initialMessage,
  invitationUrl 
}: MessageEditModalProps) {
  const [message, setMessage] = useState(initialMessage)

  useEffect(() => {
    setMessage(initialMessage)
  }, [initialMessage])

  if (!isOpen) return null

  const handleCopy = () => {
    const messageWithUrl = message.replace('{url}', invitationUrl)
    onCopy(messageWithUrl)
    onClose()
  }

  const handleLineShare = () => {
    const messageWithUrl = message.replace('{url}', invitationUrl)
    const encodedMessage = encodeURIComponent(messageWithUrl)
    const lineUrl = `https://line.me/R/msg/text/?${encodedMessage}`
    window.open(lineUrl, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="sm:flex sm:items-start">
            <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                招待メッセージを編集
              </h3>
              
              <div className="mt-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  メッセージ内容
                </label>
                <textarea
                  id="message"
                  rows={12}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <p className="mt-2 text-sm text-gray-500">
                  {'{url}'} は自動的に招待URLに置き換えられます
                </p>
                
                <div className="mt-3 rounded-md bg-gray-50 p-3">
                  <p className="text-sm font-medium text-gray-700">プレビュー（URL部分）:</p>
                  <p className="mt-1 text-sm text-gray-600 break-all">{invitationUrl}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-md bg-[#00B900] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#00A000] sm:w-auto"
              onClick={handleLineShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              LINEで共有
            </button>
            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4 mr-2" />
              コピー
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              onClick={onClose}
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}