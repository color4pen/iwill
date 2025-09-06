"use client";

import { useTransition } from "react";

interface MediaApprovalToggleProps {
  mediaId: string;
  isApproved: boolean;
  toggleAction: (formData: FormData) => Promise<void>;
}

export default function MediaApprovalToggle({ 
  mediaId, 
  isApproved,
  toggleAction 
}: MediaApprovalToggleProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const formData = new FormData();
    formData.append("id", mediaId);
    formData.append("isApproved", isApproved.toString());

    startTransition(async () => {
      await toggleAction(formData);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`px-3 py-1 text-xs font-semibold rounded-full ${
        isApproved
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800"
      } ${isPending ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"}`}
    >
      {isPending ? "更新中..." : isApproved ? "承認済み" : "未承認"}
    </button>
  );
}