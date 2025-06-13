"use client"

import { InquiryStatus } from "@prisma/client"
import { updateThreadStatus } from "@/app/actions/inquiries"
import { Select } from "@/components/ui/form-elements"

interface ThreadStatusSelectorProps {
  threadId: string
  currentStatus: InquiryStatus
}

export default function ThreadStatusSelector({ threadId, currentStatus }: ThreadStatusSelectorProps) {
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as InquiryStatus
    await updateThreadStatus(threadId, newStatus)
  }

  return (
    <Select
      value={currentStatus}
      onChange={handleStatusChange}
      className="w-32"
    >
      <option value="OPEN">対応中</option>
      <option value="RESOLVED">解決済み</option>
      <option value="CLOSED">クローズ</option>
    </Select>
  )
}