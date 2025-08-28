"use client"

import { useState } from "react"
import Image from "next/image"
import { Film, Plus } from "lucide-react"
import MediaUploadForm from "@/app/components/media-upload-form"
import { deleteMedia } from "@/app/actions/media"
import { useRouter } from "next/navigation"

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
}

export default function GalleryClient({ initialMedia, currentUserId }: GalleryClientProps) {
  const [media, setMedia] = useState(initialMedia)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const handleUploadComplete = () => {
    // ページをリフレッシュして新しいメディアを取得
    router.refresh()
    setShowUploadForm(false)
    setIsUploading(false)
  }

  const handleDelete = async (mediaId: string) => {
    if (!confirm("この写真を削除しますか？")) return

    try {
      await deleteMedia(mediaId)
      setMedia(media.filter((item) => item.id !== mediaId))
    } catch (error) {
      alert("削除に失敗しました")
    }
  }

  // 日付をフォーマットする関数
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date))
  }

  return (
    <div>
      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">ギャラリー</h2>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            disabled={isUploading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 mr-2" />
            写真・動画を追加
          </button>
        </div>

        {/* アップロードフォーム */}
        {showUploadForm && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-sm">
            <MediaUploadForm onUploadComplete={handleUploadComplete} />
          </div>
        )}
      </div>

      {/* メディアギャラリー */}
      {media.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {media.map((item) => (
            <div key={item.id} className="group relative">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                {item.mimeType.startsWith("image/") ? (
                  <Image
                    src={item.thumbnailUrl || item.fileUrl}
                    alt={item.caption || "写真"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <Film className="w-8 h-8 text-gray-500" />
                  </div>
                )}
              </div>

              {/* ホバー時の情報表示 */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-end p-3 opacity-0 group-hover:opacity-100">
                <div className="text-white text-sm w-full">
                  <div className="flex items-center gap-2 mb-1">
                    {item.user.image && (
                      <Image
                        src={item.user.image}
                        alt={item.user.name || ""}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    )}
                    <span className="truncate">{item.user.name || "ゲスト"}</span>
                  </div>
                  <p className="text-xs opacity-75">{formatDate(item.createdAt)}</p>
                  {item.caption && (
                    <p className="mt-1 text-xs line-clamp-2">{item.caption}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
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
          <button
            onClick={() => setShowUploadForm(true)}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            最初の写真をアップロード
          </button>
        </div>
      )}
    </div>
  )
}