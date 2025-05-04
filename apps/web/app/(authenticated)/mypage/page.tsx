"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function MyPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");

  // ユーザーの投稿したメディア（サンプル）
  const userUploads = [
    {
      id: 1,
      type: "image",
      url: "https://via.placeholder.com/400x300?text=My+Upload+1",
      caption: "新郎新婦との写真",
      uploadedAt: "2025-05-25T15:30:00",
    },
    {
      id: 2,
      type: "image",
      url: "https://via.placeholder.com/400x300?text=My+Upload+2",
      caption: "料理の写真",
      uploadedAt: "2025-05-25T16:45:00",
    },
  ];

  // 出席情報（サンプル）
  const attendanceInfo = {
    status: "出席",
    numberOfGuests: 2,
    dietaryRestrictions: "なし",
    message: "おめでとうございます！当日を楽しみにしています。",
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
    <>
      <h2 className="text-3xl font-bold mb-8 text-center">マイページ</h2>

      {/* プロフィールセクション */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row items-center mb-6">
          <div className="w-32 h-32 relative rounded-full overflow-hidden mb-4 md:mb-0 md:mr-8">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="プロフィール画像"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-2xl">?</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">{session?.user?.name || "ゲスト"}</h3>
            <p className="text-gray-600 mb-1">{session?.user?.email || "メールアドレスなし"}</p>
            <p className="text-sm text-gray-500">LINE認証でログイン中</p>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 text-center flex-1 ${activeTab === 'profile' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('profile')}
          >
            プロフィール情報
          </button>
          <button
            className={`px-6 py-3 text-center flex-1 ${activeTab === 'uploads' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('uploads')}
          >
            アップロード履歴
          </button>
          <button
            className={`px-6 py-3 text-center flex-1 ${activeTab === 'attendance' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('attendance')}
          >
            出席情報
          </button>
        </div>

        <div className="p-6">
          {/* プロフィールタブ */}
          {activeTab === 'profile' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">プロフィール情報</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">名前</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={session?.user?.name || ""}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-md"
                    value={session?.user?.email || ""}
                    readOnly
                  />
                </div>
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">
                    プロフィール情報はLINE認証から取得されています。
                    変更が必要な場合は設定画面からお願いします。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* アップロード履歴タブ */}
          {activeTab === 'uploads' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">あなたのアップロード履歴</h3>
              {userUploads.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {userUploads.map((media) => (
                    <div key={media.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
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
                        <p className="text-sm text-gray-600">
                          アップロード: {formatDate(media.uploadedAt)}
                        </p>
                      </div>
                      <div className="px-4 py-2 bg-gray-100 flex justify-end space-x-2">
                        <button className="text-red-500 hover:text-red-700 text-sm">
                          削除
                        </button>
                        <button className="text-blue-500 hover:text-blue-700 text-sm">
                          編集
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p>アップロードしたメディアはまだありません</p>
                  <Link href="/medias" className="mt-4 inline-block text-blue-500 hover:underline">
                    メディアをアップロードする
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* 出席情報タブ */}
          {activeTab === 'attendance' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">出席情報</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">出欠</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="attending" selected={attendanceInfo.status === "出席"}>出席</option>
                    <option value="not-attending" selected={attendanceInfo.status === "欠席"}>欠席</option>
                    <option value="undecided" selected={attendanceInfo.status === "未定"}>未定</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">参加人数</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="1" selected={attendanceInfo.numberOfGuests === 1}>1名</option>
                    <option value="2" selected={attendanceInfo.numberOfGuests === 2}>2名</option>
                    <option value="3" selected={attendanceInfo.numberOfGuests === 3}>3名</option>
                    <option value="4" selected={attendanceInfo.numberOfGuests === 4}>4名</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">食事の制限・アレルギー</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={2}
                    defaultValue={attendanceInfo.dietaryRestrictions}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">メッセージ</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    defaultValue={attendanceInfo.message}
                  ></textarea>
                </div>
                <div className="pt-4">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    情報を更新する
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}