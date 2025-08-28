"use client"

import { useState } from "react"
import { X, ChevronDown, ChevronUp, Image as ImageIcon, Film } from "lucide-react"

interface SelectedFilesListProps {
  files: File[]
  previews: Map<string, string>
  onRemoveFile: (index: number) => void
  disabled?: boolean
}

export function SelectedFilesList({ 
  files, 
  previews, 
  onRemoveFile, 
  disabled = false 
}: SelectedFilesListProps) {
  const [showDetails, setShowDetails] = useState(false)

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="w-4 h-4" />
    }
    if (file.type.startsWith("video/")) {
      return <Film className="w-4 h-4" />
    }
    return null
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0)

  return (
    <div className="mt-4">
      <div 
        className="bg-blue-50 rounded-lg p-4 cursor-pointer hover:bg-blue-100 transition-colors"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {files.length}個のファイルを選択中
            </p>
            <p className="text-xs text-gray-600">
              合計: {formatFileSize(totalSize)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">詳細</span>
            {showDetails ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {file.type.startsWith("image/") && previews.has(file.name) ? (
                  <div className="w-10 h-10 relative rounded overflow-hidden flex-shrink-0">
                    <img
                      src={previews.get(file.name)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded flex-shrink-0">
                    {getFileIcon(file)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-700 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveFile(index)
                }}
                className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0"
                disabled={disabled}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}