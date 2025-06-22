"use client"

import { useState, useEffect, useRef } from "react"
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
  const modalRef = useRef<HTMLDivElement>(null)
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    setMessage(initialMessage)
  }, [initialMessage])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

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

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const deltaY = e.touches[0].clientY - startY
    if (deltaY > 0) {
      setCurrentY(deltaY)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    if (currentY > 100) {
      onClose()
    }
    setCurrentY(0)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-sm transition-opacity sm:bg-gray-500 sm:bg-opacity-75" onClick={onClose} />
      
      <div className="fixed inset-x-0 bottom-0 z-50">
        <div 
          ref={modalRef}
          className="relative transform bg-white/80 backdrop-blur-sm rounded-t-xl shadow-xl transition-all duration-300 ease-out max-h-[90vh] sm:max-h-[80vh] sm:mx-auto sm:max-w-2xl sm:rounded-lg sm:bottom-auto sm:inset-x-auto sm:top-1/2 sm:-translate-y-1/2 sm:bg-white"
          style={{ transform: `translateY(${currentY}px)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* モバイル用のドラッグハンドル */}
          <div className="flex justify-center pt-2 pb-1 sm:hidden">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>
          
          {/* ヘッダー */}
          <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b px-4 py-3 sm:px-6 sm:bg-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                招待メッセージを編集
              </h3>
              <button
                type="button"
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          {/* コンテンツ */}
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  メッセージ内容
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <p className="mt-2 text-sm text-gray-500">
                  {'{url}'} は自動的に招待URLに置き換えられます
                </p>
              </div>
            </div>
          </div>
          
          {/* フッター */}
          <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3 sm:bg-white">
            <button
              type="button"
              className="flex-1 inline-flex items-center justify-center rounded-md bg-[#00B900] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#00A000] sm:flex-none sm:w-auto sm:py-2"
              onClick={handleLineShare}
            >
              <Share2 className="h-5 w-5 mr-2" />
              LINEで共有
            </button>
            <button
              type="button"
              className="flex-1 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:flex-none sm:w-auto sm:py-2"
              onClick={handleCopy}
            >
              <Copy className="h-5 w-5 mr-2" />
              コピー
            </button>
            <button
              type="button"
              className="hidden sm:inline-flex w-auto justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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