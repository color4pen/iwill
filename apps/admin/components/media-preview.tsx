"use client"

import { useState } from "react"
import { MediaImage } from "@repo/ui/media-image"
import { X } from "lucide-react"

interface MediaPreviewProps {
  fileUrl: string
  thumbnailUrl?: string | null
  mimeType: string
  caption?: string | null
  fileName?: string
}

export default function MediaPreview({ 
  fileUrl, 
  thumbnailUrl, 
  mimeType, 
  caption,
  fileName 
}: MediaPreviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isVideo = mimeType.startsWith('video/')

  return (
    <>
      {/* サムネイル */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-20 h-20 relative bg-gray-100 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
      >
        {mimeType.startsWith('image/') ? (
          <MediaImage
            src={fileUrl}
            thumbnailUrl={thumbnailUrl}
            alt={caption || "画像"}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="relative w-full h-full">
            <MediaImage
              src={fileUrl}
              thumbnailUrl={thumbnailUrl}
              alt={caption || "動画"}
              fill
              className="object-cover"
              sizes="80px"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black bg-opacity-50 rounded-full p-2">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </button>

      {/* モーダル */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ヘッダー */}
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">プレビュー</h3>
                {fileName && <p className="text-sm text-gray-500 mt-1">{fileName}</p>}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* コンテンツ */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col items-center">
                {isVideo ? (
                  <video
                    src={fileUrl}
                    controls
                    className="max-w-full"
                    style={{ maxHeight: 'calc(80vh - 120px)' }}
                  >
                    お使いのブラウザは動画タグをサポートしていません。
                  </video>
                ) : (
                  <img
                    src={fileUrl}
                    alt={caption || "画像"}
                    className="max-w-full object-contain"
                    style={{ maxHeight: 'calc(80vh - 120px)' }}
                  />
                )}
                
                {caption && (
                  <p className="mt-4 text-gray-700 text-center">{caption}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}