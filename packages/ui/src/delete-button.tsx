"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

interface DeleteButtonProps {
  onDelete: () => Promise<void>
  confirmMessage?: string
  label?: string
  variant?: 'icon' | 'button'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}

export function DeleteButton({
  onDelete,
  confirmMessage = "この項目を削除しますか？",
  label = "削除",
  variant = 'icon',
  size = 'md',
  className = '',
  disabled = false,
}: DeleteButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(confirmMessage)) return

    setIsDeleting(true)
    try {
      await onDelete()
      router.refresh()
    } catch (error) {
      console.error("Delete error:", error)
      alert("削除に失敗しました")
    } finally {
      setIsDeleting(false)
    }
  }

  const sizeClasses = {
    sm: variant === 'icon' ? 'h-4 w-4' : 'text-sm px-2 py-1',
    md: variant === 'icon' ? 'h-5 w-5' : 'text-base px-3 py-2',
    lg: variant === 'icon' ? 'h-6 w-6' : 'text-lg px-4 py-3',
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleDelete}
        disabled={disabled || isDeleting}
        className={`p-2 text-gray-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
        title={label}
      >
        <Trash2 className={sizeClasses[size]} />
      </button>
    )
  }

  return (
    <button
      onClick={handleDelete}
      disabled={disabled || isDeleting}
      className={`
        bg-red-600 text-white hover:bg-red-700 
        disabled:bg-gray-300 disabled:cursor-not-allowed
        rounded transition-colors
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {isDeleting ? "削除中..." : label}
    </button>
  )
}