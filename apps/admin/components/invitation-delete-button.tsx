"use client"

import { DeleteButton } from "@repo/ui/delete-button"
import { deleteInvitation } from "@/app/actions/invitations"

interface InvitationDeleteButtonProps {
  invitationId: string
}

export default function InvitationDeleteButton({ invitationId }: InvitationDeleteButtonProps) {
  return (
    <DeleteButton
      onDelete={() => deleteInvitation(invitationId)}
      confirmMessage="この招待URLを削除しますか？"
      variant="icon"
      size="md"
    />
  )
}