"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Play, Pause, Volume2, VolumeX, ExternalLink } from "lucide-react"

interface MediaItem {
  id: string
  fileUrl: string
  thumbnailUrl?: string | null
  mimeType: string
  caption?: string | null
  createdAt: Date
  fileName?: string
  user?: {
    name: string | null
    image: string | null
  }
}

interface MediaViewerProps {
  media: MediaItem[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
  isAdmin?: boolean
}

export default function MediaViewer({ media, initialIndex, isOpen, onClose, isAdmin = false }: MediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const currentMedia = media[currentIndex]
  const isVideo = currentMedia?.mimeType.startsWith("video/")

  // キーボード操作（ESCのみ）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // インデックスが変更されたら更新
  useEffect(() => {
    setCurrentIndex(initialIndex)
    setImageLoading(true)  // 新しい画像の読み込み状態をリセット
  }, [initialIndex])
  
  // currentIndexが変更されたら画像の読み込み状態をリセット
  useEffect(() => {
    if (!isVideo) {
      setImageLoading(true)
    }
  }, [currentIndex, isVideo])


  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  if (!isOpen || !currentMedia) return null

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center"
    >
      {/* ヘッダー */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent z-30">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="閉じる"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        
        <span className="text-white text-sm font-medium">
          {currentIndex + 1} / {media.length}
        </span>
      </div>

      {/* メインコンテンツ */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* メディア表示 */}
        <div className="relative max-w-6xl max-h-[85vh] w-full h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}>
          {isVideo ? (
            <div onClick={(e) => e.stopPropagation()}>
              <video
                src={currentMedia.fileUrl}
                className="max-w-full max-h-full object-contain"
                controls
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              )}
              <Image
                key={currentMedia.id}
                src={currentMedia.fileUrl}
                alt={currentMedia.caption || "写真"}
                fill
                className="object-contain"
                priority
                onLoad={() => setImageLoading(false)}
                sizes="(max-width: 1536px) 100vw, 1536px"
              />
            </div>
          )}
        </div>

      </div>

      {/* フッター情報 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
        <div className="max-w-4xl mx-auto">
          {currentMedia.caption && (
            <p className="text-white text-lg mb-2">{currentMedia.caption}</p>
          )}
          
          <div className="flex items-center justify-between text-white/80 text-sm">
            <div className="flex items-center gap-4">
              {currentMedia.user && (
                <div className="flex items-center gap-2">
                  {currentMedia.user.image && (
                    <Image
                      src={currentMedia.user.image}
                      alt={currentMedia.user.name || ""}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span>{currentMedia.user.name || "ゲスト"}</span>
                </div>
              )}
              
              <span>{formatDate(currentMedia.createdAt)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {isVideo && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsPlaying(!isPlaying)
                    }}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label={isPlaying ? "一時停止" : "再生"}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 text-white" />
                    ) : (
                      <Play className="w-4 h-4 text-white" />
                    )}
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsMuted(!isMuted)
                    }}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label={isMuted ? "ミュート解除" : "ミュート"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-white" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-white" />
                    )}
                  </button>
                </>
              )}
              {isAdmin && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="text-white/60 text-xs bg-black/20 px-2 py-1 rounded select-text cursor-text"
                  title="クリックしてコピー"
                >
                  ID: {currentMedia.id}
                </div>
              )}
              <Link
                href={`/media/${currentMedia.id}`}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="詳細を見る"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}