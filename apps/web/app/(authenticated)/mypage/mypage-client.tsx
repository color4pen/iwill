"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { MediaImage } from "@repo/ui/media-image";
import { paths } from "@/lib/paths";
import { updateMediaSituation } from "@/app/actions/media-situation";
import * as Icons from "lucide-react";

interface MyPageClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  userMedia?: Array<{
    id: string;
    fileUrl: string;
    thumbnailUrl?: string | null;
    mimeType: string;
    caption?: string | null;
    createdAt: Date;
    mediaSituation?: {
      id: string;
      name: string;
      icon?: string | null;
    } | null;
  }>;
  mediaSituations?: Array<{
    id: string;
    name: string;
    description?: string | null;
    icon?: string | null;
    order: number;
  }>;
}

export default function MyPageClient({ user, userMedia = [], mediaSituations = [] }: MyPageClientProps) {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSituationChange = async (mediaId: string, situationId: string) => {
    setIsUpdating(true);
    try {
      await updateMediaSituation(mediaId, situationId === "" ? null : situationId);
      setSelectedMedia(null);
    } catch (error) {
      alert("更新に失敗しました");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="w-16 h-16 flex-shrink-0 relative rounded-full overflow-hidden mr-4 border-2 border-gray-200">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt="プロフィール画像"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-8 w-8 text-gray-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {user.name || "ゲスト"}さんのマイページ
                </h1>
                <p className="text-sm text-gray-500 mt-1">アップロードした写真・動画（{userMedia.length}件）</p>
              </div>
            </div>
            <Link
              href={paths.upload}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新しくアップロード
            </Link>
          </div>
        </div>

        {/* メディア一覧 */}
        <div>
          {userMedia.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {userMedia.map((media) => (
                <div 
                  key={media.id}
                  className="relative overflow-hidden rounded-lg bg-gray-200 group cursor-pointer"
                  style={{ aspectRatio: '1/1' }}
                  onClick={() => setSelectedMedia(media.id)}
                >
                  {media.mediaSituation && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-2 py-1 text-xs font-medium bg-black bg-opacity-70 text-white rounded">
                        {media.mediaSituation.name}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center z-20 pointer-events-none group-hover:pointer-events-auto">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                      クリックして編集
                    </span>
                  </div>
                  {media.mimeType.startsWith('image/') ? (
                    <MediaImage
                      src={media.fileUrl}
                      thumbnailUrl={media.thumbnailUrl}
                      alt={media.caption || "写真"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <MediaImage
                        src={media.fileUrl}
                        thumbnailUrl={media.thumbnailUrl}
                        alt={media.caption || "動画"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-50 rounded-full p-2">
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* シチュエーションアイコンバッジ */}
                  {media.mediaSituation?.icon && (() => {
                    const Icon = (Icons as any)[media.mediaSituation.icon];
                    return Icon ? (
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                        <Icon className="w-4 h-4 text-gray-700" />
                      </div>
                    ) : null;
                  })()}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                まだ写真がありません
              </h3>
              <p className="text-gray-500 text-base mb-8 max-w-md mx-auto text-center">
                結婚式の思い出の写真や動画をアップロードして、他の参列者と共有しましょう。
              </p>
              <Link
                href={paths.upload}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                写真をアップロード
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* シチュエーション編集モーダル */}
      {selectedMedia && (() => {
        const selectedMediaData = userMedia.find(m => m.id === selectedMedia);
        if (!selectedMediaData) return null;

        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4" onClick={() => setSelectedMedia(null)}>
            <div className="bg-white rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-4">シチュエーションを選択</h3>
              
              {/* シチュエーションのプレビュー */}
              {selectedMediaData.mediaSituation && (() => {
                const Icon = selectedMediaData.mediaSituation.icon ? 
                  (Icons as any)[selectedMediaData.mediaSituation.icon] : null;
                return (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center gap-2">
                    {Icon && <Icon className="w-5 h-5 text-blue-600" />}
                    <span className="text-sm font-medium text-blue-900">
                      現在: {selectedMediaData.mediaSituation.name}
                    </span>
                  </div>
                );
              })()}
              
              {/* 写真プレビュー */}
              <div className="mb-4 relative w-full bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                {selectedMediaData.mimeType.startsWith('image/') ? (
                  <Image
                    src={selectedMediaData.fileUrl}
                    alt={selectedMediaData.caption || "写真"}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={selectedMediaData.thumbnailUrl || selectedMediaData.fileUrl}
                      alt={selectedMediaData.caption || "動画"}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-3">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                defaultValue={selectedMediaData.mediaSituation?.id || ""}
                onChange={(e) => handleSituationChange(selectedMedia, e.target.value)}
                disabled={isUpdating}
              >
                <option value="">シチュエーションなし</option>
                {mediaSituations.map((situation) => {
                  const Icon = situation.icon ? (Icons as any)[situation.icon] : null;
                  return (
                    <option key={situation.id} value={situation.id}>
                      {Icon && "● "}{situation.name}
                    </option>
                  );
                })}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={isUpdating}
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}