"use client"

import { useRef } from "react"
import { Upload } from "lucide-react"

interface FileDropzoneProps {
  onFilesSelected: (files: FileList) => void
  disabled?: boolean
}

export function FileDropzone({ onFilesSelected, disabled = false }: FileDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (disabled) return
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      onFilesSelected(files)
    }
  }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFilesSelected(files)
      // 同じファイルを再選択できるようにリセット
      e.target.value = ""
    }
  }

  return (
    <div
      className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 cursor-pointer transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        クリックまたはドラッグで写真・動画を選択
      </p>
      <p className="text-xs text-gray-500 mt-1">
        最大100MB（JPEG, PNG, GIF, WebP, MP4, MOV）
      </p>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/quicktime"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  )
}