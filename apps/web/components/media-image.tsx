"use client"

import { useState } from "react"
import Image from "next/image"

interface MediaImageProps {
  src: string
  thumbnailUrl?: string | null
  alt: string
  fill?: boolean
  className?: string
  sizes?: string
  width?: number
  height?: number
  priority?: boolean
  onLoad?: () => void
  style?: React.CSSProperties
}

export default function MediaImage({
  src,
  thumbnailUrl,
  alt,
  fill = false,
  className = "",
  sizes,
  width,
  height,
  priority = false,
  onLoad,
  style
}: MediaImageProps) {
  const [thumbnailError, setThumbnailError] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // 動画の場合、サムネイルURLの拡張子を調整
  // 古いファイルは拡張子がそのまま（.mp4）、新しいファイルは.jpg
  let adjustedThumbnailUrl = thumbnailUrl
  
  // srcが動画ファイルの場合、サムネイルは存在するはず
  const isVideo = src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.mov')
  
  if (thumbnailUrl && isVideo) {
    // サムネイルURLが.jpgで終わらない場合は、そのまま使用（古いファイル用）
    // 既に.jpgの場合もそのまま使用（新しいファイル用）
    adjustedThumbnailUrl = thumbnailUrl
  }
  
  // 使用する画像URLを決定
  // 1. サムネイルが利用可能でエラーがない場合はサムネイル
  // 2. サムネイルがない、またはエラーの場合は元画像
  // 3. 元画像もエラーの場合はプレースホルダー
  const imageUrl = adjustedThumbnailUrl && !thumbnailError ? adjustedThumbnailUrl : src
  
  const handleError = () => {
    if (adjustedThumbnailUrl && !thumbnailError && imageUrl === adjustedThumbnailUrl) {
      // サムネイルでエラーが発生した場合、元画像にフォールバック
      setThumbnailError(true)
    } else {
      // 元画像でもエラーが発生した場合
      setImageError(true)
    }
    setIsLoading(false)
  }
  
  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }
  
  // 両方でエラーが発生した場合はプレースホルダーを表示
  if (imageError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width: fill ? '100%' : width, height: fill ? '100%' : height, ...style }}
      >
        <svg 
          className="w-8 h-8 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </div>
    )
  }
  
  if (fill) {
    return (
      <>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          </div>
        )}
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className={className}
          sizes={sizes}
          priority={priority}
          onError={handleError}
          onLoad={handleLoad}
          style={style}
        />
      </>
    )
  }
  
  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center bg-gray-200" style={{ width, height }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
      )}
      <Image
        src={imageUrl}
        alt={alt}
        width={width!}
        height={height!}
        className={className}
        priority={priority}
        onError={handleError}
        onLoad={handleLoad}
        style={style}
      />
    </>
  )
}