"use client";

import { useTransition } from "react";

interface MediaSituationSelectProps {
  mediaId: string;
  currentSituationId: string | null;
  situations: Array<{
    id: string;
    name: string;
  }>;
  updateAction: (formData: FormData) => Promise<void>;
}

export default function MediaSituationSelect({ 
  mediaId, 
  currentSituationId, 
  situations,
  updateAction
}: MediaSituationSelectProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (newSituationId: string) => {
    const formData = new FormData();
    formData.append("id", mediaId);
    formData.append("situationId", newSituationId === "none" ? "" : newSituationId);

    startTransition(async () => {
      await updateAction(formData);
    });
  };

  return (
    <select
      value={currentSituationId || "none"}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      className={`text-sm px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 ${
        isPending ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <option value="none">未設定</option>
      {situations.map((situation) => (
        <option key={situation.id} value={situation.id}>
          {situation.name}
        </option>
      ))}
    </select>
  );
}