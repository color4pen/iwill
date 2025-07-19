"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { paths } from "@/lib/paths";

// メディアアイテムの型定義
interface MediaItem {
  id: number;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  caption: string;
  uploadedAt: string;
}

export default function MyPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("attendance");

  // サンプルのメディアデータ - 16枚用意
  const userUploads: MediaItem[] = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    type: "image",
    url: `https://via.placeholder.com/800x600?text=Wedding+Photo+${i + 1}`,
    caption: `写真 ${i + 1}`,
    uploadedAt: `2025-05-${25 - (i % 10)}T${14 + (i % 10)}:${30 + (i % 30)}:00`,
  }));

  // 出席情報（サンプル）
  const [attendanceInfo, setAttendanceInfo] = useState({
    status: "出席",
    numberOfGuests: 2,
    dietaryRestrictions: "",
    message: "",
  });

  // 入力フォームの処理
  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAttendanceInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // フォーム送信処理
  const handleAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 実際のAPIリクエストをここに実装
    alert("出席情報が更新されました");
  };

  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b pb-5">
        <div className="flex items-center">
          <div className="w-14 h-14 relative rounded-full overflow-hidden mr-4 border border-gray-200 shadow-sm">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="プロフィール画像"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-gray-400" 
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {session?.user?.name || "ゲスト"}さんのマイページ
            </h1>
            <p className="text-sm text-gray-500 mt-1">結婚式の出席情報とメディアを管理できます</p>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b mb-6">
        <div className="flex w-full">
          <button
            className={`flex-1 py-3 font-medium text-sm text-center ${
              activeTab === "attendance"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("attendance")}
          >
            出席情報
          </button>
          <button
            className={`flex-1 py-3 font-medium text-sm text-center ${
              activeTab === "media"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("media")}
          >
            メディア
          </button>
        </div>
      </div>

      {/* タブコンテンツ */}
      <div className="pb-16">
        {/* 出席情報タブ */}
        {activeTab === "attendance" && (
          <div>
            <h2 className="text-xl font-bold mb-4">出席情報</h2>
            <form onSubmit={handleAttendanceSubmit} className="max-w-2xl">
              <div className="space-y-5">
                <div className="border-b pb-5">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-800 mb-2"
                  >
                    出欠 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={attendanceInfo.status}
                    onChange={handleInputChange}
                    className="w-full p-3 border-0 bg-gray-100 rounded-md focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 text-base"
                    required
                  >
                    <option value="出席">出席</option>
                    <option value="欠席">欠席</option>
                    <option value="未定">未定</option>
                  </select>
                </div>

                {attendanceInfo.status === "出席" && (
                  <>
                    <div className="border-b pb-5">
                      <label
                        htmlFor="numberOfGuests"
                        className="block text-sm font-medium text-gray-800 mb-2"
                      >
                        参加人数 <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="numberOfGuests"
                        name="numberOfGuests"
                        value={attendanceInfo.numberOfGuests}
                        onChange={handleInputChange}
                        className="w-full p-3 border-0 bg-gray-100 rounded-md focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 text-base"
                        required
                      >
                        <option value={1}>1名</option>
                        <option value={2}>2名</option>
                        <option value={3}>3名</option>
                        <option value={4}>4名</option>
                      </select>
                      <p className="mt-2 text-sm text-gray-500">
                        ご本人を含めた人数をご選択ください
                      </p>
                    </div>

                    <div className="border-b pb-5">
                      <label
                        htmlFor="dietaryRestrictions"
                        className="block text-sm font-medium text-gray-800 mb-2"
                      >
                        食事の制限・アレルギー
                      </label>
                      <textarea
                        id="dietaryRestrictions"
                        name="dietaryRestrictions"
                        value={attendanceInfo.dietaryRestrictions}
                        onChange={handleInputChange}
                        className="w-full p-3 border-0 bg-gray-100 rounded-md focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 text-base"
                        rows={2}
                        placeholder="アレルギーや食事制限がある場合はご記入ください"
                      ></textarea>
                    </div>
                  </>
                )}

                <div className="border-b pb-5">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-800 mb-2"
                  >
                    新郎新婦へのメッセージ
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={attendanceInfo.message}
                    onChange={handleInputChange}
                    className="w-full p-3 border-0 bg-gray-100 rounded-md focus:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 text-base"
                    rows={4}
                    placeholder="お祝いのメッセージをご記入ください（任意）"
                  ></textarea>
                </div>

                <div className="pt-2 mt-6">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition-colors"
                  >
                    情報を更新する
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-8 bg-blue-50 py-4 px-5 rounded-md">
              <h3 className="text-sm font-medium text-gray-900 mb-1">注意事項</h3>
              <p className="text-sm text-gray-600">
                出席情報は、主催者が席次や料理の手配の参考にさせていただきます。変更が必要な場合はこちらのフォームから変更いただけます。
              </p>
            </div>
          </div>
        )}

        {/* メディアタブ */}
        {activeTab === "media" && (
          <div>
            <div className="mb-3">
              <h2 className="text-xl font-bold">メディア</h2>
            </div>

            {userUploads.length > 0 ? (
              <div>
                <div className="grid grid-cols-4 gap-0.5">
                  {userUploads.map((media) => (
                    <div 
                      key={`tile-${media.id}`}
                      className="aspect-square bg-gray-200"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  メディアがありません
                </h3>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                  結婚式の思い出の写真や動画をアップロードして、他の参列者と共有しましょう。
                </p>
                <Link
                  href={paths.gallery}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  メディアをアップロード
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}