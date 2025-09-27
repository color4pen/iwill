"use client"

import { useState } from "react"
import Image from "next/image"
import { Film, Plus } from "lucide-react"
import { deleteMedia } from "@/app/actions/media"
import { useRouter } from "next/navigation"
import Link from "next/link"
import MediaViewer from "@/components/media-viewer"
import { MediaImage } from "@repo/ui/media-image"

interface MediaItem {
  id: string
  fileUrl: string
  thumbnailUrl?: string | null
  mimeType: string
  caption?: string | null
  createdAt: Date
  user: {
    name: string | null
    image: string | null
  }
}

interface GalleryClientProps {
  initialMedia: MediaItem[]
  currentUserId?: string
  isAdmin?: boolean
}

interface GalleryClientPropsExtended extends GalleryClientProps {
  hideHeader?: boolean
  customEmptyMessage?: string
}

export default function GalleryClient({ initialMedia, currentUserId, hideHeader = true, customEmptyMessage, isAdmin = false }: GalleryClientPropsExtended) {
  const [media, setMedia] = useState(initialMedia)
  const router = useRouter()
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerIndex, setViewerIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async (mediaId: string) => {
    if (!confirm("この写真を削除しますか？")) return

    try {
      await deleteMedia(mediaId)
      setMedia(media.filter((item) => item.id !== mediaId))
    } catch (error) {
      alert("削除に失敗しました")
    }
  }

  const openViewer = (index: number) => {
    setViewerIndex(index)
    setViewerOpen(true)
  }

  // 日付をフォーマットする関数
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date))
  }

  // 初回読み込み時のローディング表示
  if (isLoading && media.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div>
      {/* ヘッダー（条件付き表示） */}
      {!hideHeader && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">ギャラリー</h2>
            <Link
              href="/upload"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              写真・動画を追加
            </Link>
          </div>
        </div>
      )}

      {/* メディアギャラリー */}
      {media.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {media.map((item, index) => (
            <div key={item.id} className="relative">
              <button
                onClick={() => openViewer(index)}
                className="aspect-square bg-gray-200 rounded-lg overflow-hidden w-full cursor-pointer hover:opacity-90 transition-opacity focus:outline-none"
              >
                {item.mimeType.startsWith("image/") ? (
                  <MediaImage
                    src={item.fileUrl}
                    thumbnailUrl={item.thumbnailUrl}
                    alt={item.caption || "写真"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <MediaImage
                      src={item.fileUrl}
                      thumbnailUrl={item.thumbnailUrl}
                      alt={item.caption || "動画"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-black bg-opacity-50 rounded-full p-2">
                        <Film className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        customEmptyMessage ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-base">{customEmptyMessage}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Film className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              まだ写真がありません
            </h3>
            <p className="text-gray-500 text-base mb-8 max-w-md mx-auto text-center">
              結婚式の思い出の写真や動画をアップロードして、他の参列者と共有しましょう。
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              最初の写真をアップロード
            </Link>
          </div>
        )
      )}
      
      {/* メディアビューア */}
      <MediaViewer
        media={media}
        initialIndex={viewerIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        isAdmin={isAdmin}
      />
    </div>
  )
}