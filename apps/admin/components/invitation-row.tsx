"use client"

import { useState } from "react"
import { Check, X, Share2 } from "lucide-react"
import { invitationConfig } from "@/config/invitation"
import MessageEditModal from "./message-edit-modal"
import InvitationDeleteButton from "./invitation-delete-button"

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const invitationUrl = `${baseUrl}/login?invitation=${invitation.token}`

  const handleCopy = async (message: string) => {
    await navigator.clipboard.writeText(message)
  }

  const handleRowClick = (e: React.MouseEvent) => {
    // ボタンクリックの場合は何もしない
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    setIsModalOpen(true)
  }

  return (
    <>
      <li>
        <div 
          className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={handleRowClick}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center">
                {invitation.isUsed ? (
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                ) : invitation.expiresAt && new Date(invitation.expiresAt) < new Date() ? (
                  <X className="h-5 w-5 text-red-500 mr-2" />
                ) : (
                  <div className="h-5 w-5 mr-2" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {invitation.name || invitation.email || '名前未設定'}
                  </p>
                  <p className="text-sm text-gray-500 break-all">
                    招待URL: {invitationUrl}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${
                  invitation.isUsed ? 'bg-green-100 text-green-800' :
                  invitation.expiresAt && new Date(invitation.expiresAt) < new Date() ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {invitation.isUsed ? '使用済み' :
                   invitation.expiresAt && new Date(invitation.expiresAt) < new Date() ? '期限切れ' :
                   '未使用'}
                </span>
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
            <div className="ml-4 flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsModalOpen(true)
                }}
                className="p-2 text-[#00B900] hover:text-[#00A000]"
                title="LINEで共有"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <InvitationDeleteButton invitationId={invitation.id} />
            </div>
          </div>
        </div>
      </li>

      <MessageEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCopy={handleCopy}
        initialMessage={invitation.notes || invitationConfig.messageTemplate}
        invitationUrl={invitationUrl}
      />
    </>
  )
}