"use client"

import { useState, useEffect, useRef } from "react"
import { Film } from "lucide-react"

interface VideoThumbnailProps {
  src: string
  alt?: string
  className?: string
}

export default function VideoThumbnail({ src, alt, className = "" }: VideoThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedData = () => {
      // 1秒目のフレームを取得（より良いサムネイルのため）
      video.currentTime = Math.min(1, video.duration * 0.1)
    }

    const handleSeeked = () => {
      try {
        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext("2d")
        
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
          setThumbnail(dataUrl)
          setLoading(false)
        }
      } catch (err) {
        setError(true)
        setLoading(false)
      }
    }

    const handleError = () => {
      setError(true)
      setLoading(false)
    }

    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("seeked", handleSeeked)
    video.addEventListener("error", handleError)

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("seeked", handleSeeked)
      video.removeEventListener("error", handleError)
    }
  }, [src])

  // エラーまたは読み込み中の場合はフォールバックアイコンを表示
  if (error || loading) {
    return (
      <div className={`w-full h-full bg-gray-300 flex items-center justify-center ${className}`}>
        <Film className="w-8 h-8 text-gray-500" />
      </div>
    )
  }

  return (
    <>
      {/* 非表示のビデオ要素（サムネイル生成用） */}
      <video
        ref={videoRef}
        src={src}
        className="hidden"
        crossOrigin="anonymous"
        playsInline
        muted
      />
      
      {/* 生成されたサムネイル */}
      {thumbnail && (
        <img
          src={thumbnail}
          alt={alt}
          className={`w-full h-full object-cover ${className}`}
        />
      )}
    </>
  )
}