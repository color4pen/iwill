"use client"

import { useState } from "react"
import Image from "next/image"
import { Copy, Check } from "lucide-react"

interface MediaDetailClientProps {
  media: {
    id: string
    fileUrl: string
    thumbnailUrl?: string | null
    mimeType: string
    caption?: string | null
    createdAt: Date
    fileName?: string | null
    fileSize?: number | null
    isApproved: boolean
    user?: {
      id: string
      name: string | null
      image: string | null
    } | null
    mediaSituation?: {
      id: string
      name: string
    } | null
  }
  currentUserId?: string
  isAdmin?: boolean
}

export default function MediaDetailClient({
  media,
  currentUserId,
  isAdmin = false
}: MediaDetailClientProps) {
  const [copiedId, setCopiedId] = useState(false)
  const isVideo = media.mimeType.startsWith("video/")
  
  const handleCopyId = () => {
    navigator.clipboard.writeText(media.id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }
  
  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return "不明"
    const mb = bytes / 1024 / 1024
    return `${mb.toFixed(1)} MB`
  }
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }
  
  return (
    <div className="min-h-screen bg-black">
      {/* メディア表示 */}
      <div className="relative w-full h-screen flex items-center justify-center">
        {isVideo ? (
          <video
            src={media.fileUrl}
            className="max-w-full max-h-full w-auto h-auto object-contain"
            style={{ maxHeight: '100vh' }}
            controls
            autoPlay
            muted
          />
        ) : (
          <Image
            src={media.fileUrl}
            alt={media.caption || "写真"}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        )}
        
        {/* メタ情報 - 動画の場合は上部、写真の場合は下部に表示 */}
        <div className={`absolute left-0 right-0 p-4 pointer-events-none ${
          isVideo 
            ? 'top-0 bg-gradient-to-b from-black/80 to-transparent' 
            : 'bottom-0 bg-gradient-to-t from-black/80 to-transparent'
        }`}>
          <div className="max-w-4xl mx-auto text-white">
              {/* キャプション */}
              {media.caption && (
                <p className="text-lg mb-3">{media.caption}</p>
              )}
            
            {/* メタ情報 */}
            <div className="flex items-center gap-4 text-sm text-white/80">
              {media.user && (
                <div className="flex items-center gap-2">
                  {media.user.image && (
                    <Image
                      src={media.user.image}
                      alt={media.user.name || ""}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <span>{media.user.name || "ゲスト"}</span>
                </div>
              )}
              
              <span>{formatDate(media.createdAt)}</span>
              
              {media.mediaSituation && (
                <span>#{media.mediaSituation.name}</span>
              )}
              
              <span>{formatFileSize(media.fileSize)}</span>
              
              {isAdmin && (
                <button
                  onClick={handleCopyId}
                  className="flex items-center gap-1 text-xs hover:text-white pointer-events-auto"
                  title="IDをコピー"
                >
                  <span className="font-mono">{media.id}</span>
                  {copiedId ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              )}
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}