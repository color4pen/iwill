"use client"

import { DeleteButton } from "@repo/ui/delete-button"
import { deleteSchedule } from "@/app/actions/schedules"

interface ScheduleDeleteButtonProps {
  scheduleId: string
}

export default function ScheduleDeleteButton({ scheduleId }: ScheduleDeleteButtonProps) {
  return (
    <DeleteButton
      onDelete={() => deleteSchedule(scheduleId)}
      confirmMessage="このスケジュールを削除しますか？"
      variant="icon"
      size="md"
    />
  )
}