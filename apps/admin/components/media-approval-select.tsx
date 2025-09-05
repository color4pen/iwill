"use client";

import { useTransition } from "react";

interface MediaApprovalSelectProps {
  mediaId: string;
  isApproved: boolean;
  updateAction: (formData: FormData) => Promise<void>;
}

export default function MediaApprovalSelect({ 
  mediaId, 
  isApproved,
  updateAction 
}: MediaApprovalSelectProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (newApprovalStatus: string) => {
    const formData = new FormData();
    formData.append("id", mediaId);
    formData.append("isApproved", (newApprovalStatus === "approved").toString());

    startTransition(async () => {
      await updateAction(formData);
    });
  };

  return (
    <select
      value={isApproved ? "approved" : "unapproved"}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      className={`text-sm px-2 py-1 border rounded focus:ring-blue-500 focus:border-blue-500 ${
        isApproved 
          ? "border-green-300 bg-green-50 text-green-800" 
          : "border-yellow-300 bg-yellow-50 text-yellow-800"
      } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <option value="approved">承認済み</option>
      <option value="unapproved">未承認</option>
    </select>
  );
}