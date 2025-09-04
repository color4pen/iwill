"use client";

import { useFormStatus } from "react-dom";

interface DeleteSituationButtonProps {
  id: string;
  mediaCount: number;
  deleteAction: (formData: FormData) => Promise<void>;
}

function DeleteButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
      onClick={(e) => {
        if (!confirm("このメディアシチュエーションを削除してよろしいですか？")) {
          e.preventDefault();
        }
      }}
      disabled={pending}
    >
      {pending ? "削除中..." : "削除"}
    </button>
  );
}

export default function DeleteSituationButton({ id, mediaCount, deleteAction }: DeleteSituationButtonProps) {
  if (mediaCount > 0) {
    return (
      <p className="text-sm text-gray-500 py-2">
        メディア {mediaCount} 件が関連付けられているため削除できません
      </p>
    );
  }

  return (
    <form action={deleteAction} className="inline">
      <input type="hidden" name="id" value={id} />
      <DeleteButton />
    </form>
  );
}