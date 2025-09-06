"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { MediaImage } from "@repo/ui/media-image"
import { X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from "lucide-react"

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
}

export default function MediaViewer({ media, initialIndex, isOpen, onClose }: MediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const thumbnailContainerRef = useRef<HTMLDivElement>(null)
  const activeThumbnailRef = useRef<HTMLButtonElement>(null)

  const currentMedia = media[currentIndex]
  const isVideo = currentMedia?.mimeType.startsWith("video/")

  // キーボード操作
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          navigateToPrevious()
          break
        case "ArrowRight":
          navigateToNext()
          break
        case " ":
          if (isVideo) {
            e.preventDefault()
            setIsPlaying(!isPlaying)
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentIndex, isVideo, isPlaying])

  // インデックスが変更されたら更新
  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  // 現在のサムネイルをビューポートの中央にスクロール
  useEffect(() => {
    if (activeThumbnailRef.current && thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current
      const thumbnail = activeThumbnailRef.current
      
      // コンテナとサムネイルの位置情報を取得
      const containerRect = container.getBoundingClientRect()
      const thumbnailRect = thumbnail.getBoundingClientRect()
      
      // サムネイルをコンテナの中央に配置するためのスクロール位置を計算
      const scrollLeft = thumbnail.offsetLeft - (containerRect.width / 2) + (thumbnailRect.width / 2)
      
      // スムーズスクロール
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      })
    }
  }, [currentIndex])

  const navigateToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1))
    setImageLoading(true)
  }, [media.length])

  const navigateToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0))
    setImageLoading(true)
  }, [media.length])

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
      className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
      onClick={onClose}
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
        {/* 左側クリックエリア */}
        <div 
          className="absolute left-0 top-0 w-1/3 h-full cursor-pointer z-10"
          onClick={(e) => {
            e.stopPropagation()
            navigateToPrevious()
          }}
        />
        
        {/* 中央クリックエリア（何もしない） */}
        <div 
          className="absolute left-1/3 top-0 w-1/3 h-full z-10"
          onClick={(e) => e.stopPropagation()}
        />
        
        {/* 右側クリックエリア */}
        <div 
          className="absolute right-0 top-0 w-1/3 h-full cursor-pointer z-10"
          onClick={(e) => {
            e.stopPropagation()
            navigateToNext()
          }}
        />

        {/* 前へボタン */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigateToPrevious()
          }}
          className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
          aria-label="前の写真"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* メディア表示 */}
        <div className="relative max-w-6xl max-h-[85vh] w-full h-full flex items-center justify-center">
          {isVideo ? (
            <video
              src={currentMedia.fileUrl}
              className="max-w-full max-h-full object-contain"
              controls
              autoPlay={isPlaying}
              muted={isMuted}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              )}
              <Image
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

        {/* 次へボタン */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigateToNext()
          }}
          className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
          aria-label="次の写真"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
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
            
            {isVideo && (
              <div className="flex items-center gap-2">
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* サムネイルバー */}
      {media.length > 1 && (
        <div className="absolute bottom-20 left-0 right-0 px-4">
          <div 
            ref={thumbnailContainerRef}
            className="flex gap-2 justify-start overflow-x-auto py-2 max-w-6xl mx-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
            style={{ scrollBehavior: 'smooth' }}
          >
            {/* 左側のパディング */}
            <div className="flex-shrink-0 w-[calc(50%-36px)]" />
            
            {media.map((item, index) => (
              <button
                key={item.id}
                ref={index === currentIndex ? activeThumbnailRef : null}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(index)
                  setImageLoading(true)
                }}
                className={`relative w-16 h-16 rounded overflow-hidden flex-shrink-0 border-2 transition-all ${
                  index === currentIndex 
                    ? "border-white scale-110 shadow-xl" 
                    : "border-white/20 opacity-60 hover:opacity-100 hover:border-white/40"
                }`}
              >
                {item.mimeType.startsWith("image/") ? (
                  <MediaImage
                    src={item.fileUrl}
                    thumbnailUrl={item.thumbnailUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <MediaImage
                      src={item.fileUrl}
                      thumbnailUrl={item.thumbnailUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                
                {/* 現在の画像インジケーター */}
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-white/10 pointer-events-none" />
                )}
              </button>
            ))}
            
            {/* 右側のパディング */}
            <div className="flex-shrink-0 w-[calc(50%-36px)]" />
          </div>
        </div>
      )}
    </div>
  )
}