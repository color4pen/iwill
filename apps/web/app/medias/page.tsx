"use client";

import Protected from "../components/protected";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// メディアデータのサンプル（実際のアプリケーションではデータベースから取得）
const sampleMedias = [
  {
    id: 1,
    type: "image",
    url: "https://via.placeholder.com/400x300?text=Wedding+Photo+1",
    caption: "挙式の様子",
    author: "田中太郎",
    uploadedAt: "2025-05-25T14:30:00",
  },
  {
    id: 2,
    type: "image",
    url: "https://via.placeholder.com/400x300?text=Wedding+Photo+2",
    caption: "披露宴の様子",
    author: "佐藤花子",
    uploadedAt: "2025-05-25T15:45:00",
  },
  {
    id: 3,
    type: "image",
    url: "https://via.placeholder.com/400x300?text=Wedding+Photo+3",
    caption: "ケーキカット",
    author: "鈴木一郎",
    uploadedAt: "2025-05-25T16:20:00",
  },
  {
    id: 4,
    type: "image",
    url: "https://via.placeholder.com/400x300?text=Wedding+Photo+4",
    caption: "ブーケトス",
    author: "高橋真理子",
    uploadedAt: "2025-05-25T17:10:00",
  },
  {
    id: 5,
    type: "image",
    url: "https://via.placeholder.com/400x300?text=Wedding+Photo+5",
    caption: "集合写真",
    author: "渡辺健太",
    uploadedAt: "2025-05-25T17:30:00",
  },
  {
    id: 6,
    type: "image",
    url: "https://via.placeholder.com/400x300?text=Wedding+Photo+6",
    caption: "二次会の様子",
    author: "伊藤美咲",
    uploadedAt: "2025-05-25T19:45:00",
  },
];

export default function MediasPage() {
  // メディアのアップロード処理（実際はAPIと連携）
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // アップロード処理をここに実装
    alert("ファイルがアップロードされました（デモ表示）");
  };

  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Protected>
      <>
        <h2 className="text-3xl font-bold mb-8 text-center">メディアギャラリー</h2>
          
          {/* アップロードセクション */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-4">新しいメディアをアップロード</h3>
            <div className="flex flex-col space-y-4">
              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                  ファイルを選択（写真または動画）
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-purple-50 file:text-purple-700
                    hover:file:bg-purple-100"
                />
              </div>
              <div>
                <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
                  キャプション（任意）
                </label>
                <input
                  type="text"
                  id="caption"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                    focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                  placeholder="このメディアについて一言"
                />
              </div>
              <div>
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  アップロード
                </button>
              </div>
            </div>
          </div>
          
          {/* メディアギャラリー */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-6">アップロードされたメディア</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleMedias.map((media) => (
                <div key={media.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-48 w-full">
                    <Image
                      src={media.url}
                      alt={media.caption}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-lg mb-1">{media.caption}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      アップロード: {formatDate(media.uploadedAt)}
                    </p>
                    <p className="text-sm text-gray-500">投稿者: {media.author}</p>
                  </div>
                  <div className="px-4 py-2 bg-gray-100 flex justify-end space-x-2">
                    <button className="text-blue-500 hover:text-blue-700 text-sm">
                      拡大
                    </button>
                    <button className="text-blue-500 hover:text-blue-700 text-sm">
                      共有
                    </button>
                    <button className="text-blue-500 hover:text-blue-700 text-sm">
                      ダウンロード
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </>
    </Protected>
  );
}