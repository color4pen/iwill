"use client"

import { useState } from "react"
import { Check, X, Clock, Share2, Copy, ChevronDown, ChevronUp } from "lucide-react"
import { invitationConfig } from "@/config/invitation"
import InvitationDeleteButton from "./invitation-delete-button"
import InvitationMessageEditor from "./invitation-message-editor"

interface InvitationRowProps {
  invitation: {
    id: string
    token: string
    name: string | null
    email: string | null
    isUsed: boolean
    usedAt: Date | null
    expiresAt: Date | null
    createdAt: Date
    notes: string | null
  }
  baseUrl: string
}

export default function InvitationRow({ invitation, baseUrl }: InvitationRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [message, setMessage] = useState(invitation.notes || invitationConfig.messageTemplate)
  const [copied, setCopied] = useState(false)
  const invitationUrl = `${baseUrl}/login?invitation=${invitation.token}`

  const handleCopy = async () => {
    const messageWithUrl = message.replace('{url}', invitationUrl)
    await navigator.clipboard.writeText(messageWithUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLineShare = () => {
    const messageWithUrl = message.replace('{url}', invitationUrl)
    const encodedMessage = encodeURIComponent(messageWithUrl)
    const lineUrl = `https://line.me/R/msg/text/?${encodedMessage}`
    window.open(lineUrl, '_blank')
  }

  const handleRowClick = (e: React.MouseEvent) => {
    // ボタンクリックの場合は何もしない
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    setIsExpanded(!isExpanded)
  }

  return (
    <li>
      <div 
        className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={handleRowClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {invitation.isUsed ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : invitation.expiresAt && new Date(invitation.expiresAt) < new Date() ? (
                  <X className="h-5 w-5 text-red-500" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-base font-medium text-gray-900">
                    {invitation.name || invitation.email || '名前未設定'}
                  </p>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${
                    invitation.isUsed ? 'bg-green-100 text-green-800' :
                    invitation.expiresAt && new Date(invitation.expiresAt) < new Date() ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {invitation.isUsed ? '使用済み' :
                     invitation.expiresAt && new Date(invitation.expiresAt) < new Date() ? '期限切れ' :
                     '未使用'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 break-all mb-1">
                  {invitationUrl}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="whitespace-nowrap">
                    作成日: {new Date(invitation.createdAt).toLocaleDateString('ja-JP')}
                  </span>
                  {invitation.expiresAt && (
                    <span className="whitespace-nowrap">
                      有効期限: {new Date(invitation.expiresAt).toLocaleDateString('ja-JP')}
                    </span>
                  )}
                  {invitation.usedAt && (
                    <span className="whitespace-nowrap">
                      使用日: {new Date(invitation.usedAt).toLocaleDateString('ja-JP')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="ml-4 flex items-center space-x-2">
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-2 text-gray-500 hover:text-gray-700"
                title={isExpanded ? "閉じる" : "開く"}
              >
                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              <InvitationDeleteButton invitationId={invitation.id} />
            </div>
          </div>
      </div>
      
      {/* アコーディオン展開部分 */}
      {isExpanded && (
        <div className="bg-gray-50 border-t px-4 py-4 sm:px-6">
          <div className="space-y-4">
            <InvitationMessageEditor
              value={message}
              onChange={setMessage}
              rows={6}
            />
            
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleLineShare}
                className="flex-1 inline-flex items-center justify-center rounded-md bg-[#00B900] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#00A000]"
              >
                <Share2 className="h-4 w-4 mr-2" />
                LINEで共有
              </button>
              <button
                onClick={handleCopy}
                className={`flex-1 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition-colors ${
                  copied 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied ? 'コピーしました' : 'メッセージをコピー'}
              </button>
            </div>
            </div>
          </div>
        )}
    </li>
  )
}