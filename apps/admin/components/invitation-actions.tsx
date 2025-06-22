"use client"

import { useState } from "react"
import { Share2 } from "lucide-react"
import { invitationConfig } from "@/config/invitation"
import MessageEditModal from "./message-edit-modal"
import InvitationDeleteButton from "./invitation-delete-button"

interface InvitationActionsProps {
  invitationUrl: string
  invitationId: string
  invitationNotes?: string | null
}

export default function InvitationActions({ invitationUrl, invitationId, invitationNotes }: InvitationActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCopy = async (message: string) => {
    await navigator.clipboard.writeText(message)
  }

  const handleShareClick = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="ml-4 flex items-center space-x-2">
        <button
          onClick={handleShareClick}
          className="p-2 text-[#00B900] hover:text-[#00A000]"
          title="LINEで共有"
        >
          <Share2 className="h-5 w-5" />
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