import { getRecentMedia, getMediaSituations } from "@/app/actions/media"
import Link from "next/link"
import { ArrowRight, Camera } from "lucide-react"
import RecentMediaSection from "./recent-media-section"
import * as Icons from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function GalleryPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user?.id ? await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  }) : null
  
  const isAdmin = user?.role === 'ADMIN'
  
  const recentMedia = await getRecentMedia(12)
  const situations = await getMediaSituations()

  return (
    <div>
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">ギャラリー</h1>
          <Link
            href="/upload"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Camera className="w-4 h-4 mr-2" />
            写真・動画を追加
          </Link>
        </div>
        <p className="text-gray-600">
          結婚式の素敵な瞬間を共有しましょう。シーン別に写真や動画を見ることができます。
        </p>
      </div>

      {/* 最新のメディア */}
      <RecentMediaSection recentMedia={recentMedia} isAdmin={isAdmin} />

      {/* シーン別セクション */}
      <section>
        <h2 className="text-xl font-semibold mb-4">シーン別に見る</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {situations.map((situation) => (
            <Link
              key={situation.id}
              href={`/gallery/situation/${situation.id}`}
              className="block bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    {situation.icon && (() => {
                      const Icon = (Icons as any)[situation.icon];
                      return Icon ? <Icon className="w-6 h-6 text-blue-600" /> : null;
                    })()}
                    <h3 className="text-lg font-semibold text-gray-900">{situation.name}</h3>
                  </div>
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {situation._count.media}枚
                  </span>
                </div>
                {situation.description && (
                  <p className="text-sm text-gray-600 mt-2">{situation.description}</p>
                )}
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">写真を見る</span>
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </div>
            </Link>
          ))}
        </div>
        
        {situations.length === 0 && (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">シーンカテゴリーが設定されていません</p>
          </div>
        )}
      </section>
    </div>
  )
}