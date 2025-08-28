"use client"

import { useState } from "react"
import { Loader2, ChevronDown, ChevronUp } from "lucide-react"

export interface UploadProgress {
  fileName: string
  progress: number
  status: "uploading" | "processing" | "completed" | "error"
  error?: string
}

interface UploadProgressDisplayProps {
  uploadProgress: Map<string, UploadProgress>
}

export function UploadProgressDisplay({ uploadProgress }: UploadProgressDisplayProps) {
  const [showDetails, setShowDetails] = useState(false)

  const progressArray = Array.from(uploadProgress.values())
  const completedCount = progressArray.filter(p => p.status === "completed").length
  const totalProgress = progressArray.reduce((sum, p) => sum + p.progress, 0) / progressArray.length

  return (
    <div className="mt-4">
      <div 
        className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Loader2 className="animate-spin h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                アップロード中 ({completedCount}/{uploadProgress.size})
              </p>
              <p className="text-xs text-gray-500">
                {Math.round(totalProgress)}% 完了
              </p>
            </div>
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

        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all bg-blue-500"
              style={{ width: `${Math.round(totalProgress)}%` }}
            />
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
          {progressArray.map((progress) => (
            <div key={progress.fileName} className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-700 truncate">{progress.fileName}</p>
                <span className={`text-xs ${
                  progress.status === "completed" ? "text-green-600" :
                  progress.status === "error" ? "text-red-600" :
                  "text-blue-600"
                }`}>
                  {progress.status === "uploading" ? "アップロード中" :
                   progress.status === "processing" ? "処理中" :
                   progress.status === "completed" ? "完了" :
                   "エラー"}
                </span>
              </div>
              {progress.status !== "error" && (
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      progress.status === "completed" ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
              )}
              {progress.error && (
                <p className="text-xs text-red-600 mt-1">{progress.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}