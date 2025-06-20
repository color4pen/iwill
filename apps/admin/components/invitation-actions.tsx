"use client"

import { useState } from "react"
import { Copy } from "lucide-react"
import { invitationConfig } from "@/config/invitation"
import MessageEditModal from "./message-edit-modal"
import InvitationDeleteButton from "./invitation-delete-button"

interface InvitationActionsProps {
  invitationUrl: string
  invitationId: string
  invitationNotes?: string | null
}

export default function InvitationActions({ invitationUrl, invitationId, invitationNotes }: InvitationActionsProps) {
  const [copied, setCopied] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCopy = async (message: string) => {
    await navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyClick = () => {
    setIsModalOpen(true)
  }


  return (
    <>
      <div className="ml-4 flex items-center space-x-2">
        <button
          onClick={handleCopyClick}
          className="p-2 text-gray-500 hover:text-gray-700"
          title="招待メッセージをコピー"
        >
          <Copy className={`h-5 w-5 ${copied ? 'text-green-500' : ''}`} />
        </button>
        <InvitationDeleteButton invitationId={invitationId} />
      </div>

      <MessageEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCopy={handleCopy}
        initialMessage={invitationNotes || invitationConfig.messageTemplate}
        invitationUrl={invitationUrl}
      />
    </>
  )
}