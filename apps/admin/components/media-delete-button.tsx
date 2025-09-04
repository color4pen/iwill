"use client";

import { useFormStatus } from "react-dom";

interface MediaDeleteButtonProps {
  id: string;
  deleteAction: (formData: FormData) => Promise<void>;
}

function DeleteButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      className="text-sm text-red-600 hover:text-red-800"
      onClick={(e) => {
        if (!confirm("このメディアを削除してよろしいですか？")) {
          e.preventDefault();
        }
      }}
      disabled={pending}
    >
      {pending ? "削除中..." : "削除"}
    </button>
  );
}

export default function MediaDeleteButton({ id, deleteAction }: MediaDeleteButtonProps) {
  return (
    <form action={deleteAction} className="inline">
      <input type="hidden" name="id" value={id} />
      <DeleteButton />
    </form>
  );
}