"use client"

import { useState } from "react"
import Link from "next/link"
import { MediaImage } from "@repo/ui/media-image"
import MediaViewer from "@/components/media-viewer"
import { Film, ArrowRight } from "lucide-react"

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

interface RecentMediaSectionProps {
  recentMedia: MediaItem[]
}

export default function RecentMediaSection({ recentMedia }: RecentMediaSectionProps) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerIndex, setViewerIndex] = useState(0)

  const openViewer = (index: number) => {
    setViewerIndex(index)
    setViewerOpen(true)
  }

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">最新の投稿</h2>
        <Link
          href="/gallery/all"
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          すべて見る
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      
      {recentMedia.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {recentMedia.map((media, index) => (
              <button
                key={media.id}
                onClick={() => openViewer(index)}
                className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative hover:opacity-90 transition-opacity focus:outline-none"
              >
                {media.mimeType.startsWith("image/") ? (
                  <MediaImage
                    src={media.fileUrl}
                    thumbnailUrl={media.thumbnailUrl}
                    alt={media.caption || "写真"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <MediaImage
                      src={media.fileUrl}
                      thumbnailUrl={media.thumbnailUrl}
                      alt={media.caption || "動画"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-black bg-opacity-50 rounded-full p-1.5">
                        <Film className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          <MediaViewer
            media={recentMedia}
            initialIndex={viewerIndex}
            isOpen={viewerOpen}
            onClose={() => setViewerOpen(false)}
          />
        </>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">まだ投稿がありません</p>
        </div>
      )}
    </section>
  )
}