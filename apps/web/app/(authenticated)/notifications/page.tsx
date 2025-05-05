"use client";

import { useState } from "react";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";

// お知らせの型定義
interface Notification {
  id: number;
  title: string;
  content: string;
  date: string;
  read: boolean;
}

export default function NotificationsPage() {
  // モーダル用のステート
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // お知らせデータ（実際はAPIから取得）
  const [notifications, setNotifications] = useState<Notification[]>([
    { 
      id: 1, 
      title: "結婚式当日のスケジュール公開", 
      content: "5月25日の結婚式当日のスケジュールが公開されました。「式情報」ページでご確認ください。",
      date: "2025-05-01T10:00:00", 
      read: true 
    },
    { 
      id: 2, 
      title: "メディア機能がオープンしました", 
      content: "結婚式当日の写真や動画を共有できるメディア機能がオープンしました。当日は皆様の素敵な写真をぜひアップロードしてください。",
      date: "2025-05-20T15:30:00", 
      read: false 
    },
    { 
      id: 3, 
      title: "会場へのアクセス情報更新", 
      content: "会場へのアクセス情報が更新されました。最寄り駅からのバス時刻表も追加されています。",
      date: "2025-05-10T09:15:00", 
      read: false 
    },
    {
      id: 4,
      title: "結婚式二次会のご案内",
      content: "結婚式後の二次会について詳細情報を追加しました。参加希望の方は「式情報」ページからご確認ください。",
      date: "2025-05-15T11:20:00",
      read: true
    }
  ]);

  // お知らせを既読にする関数
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };
  
  // お知らせをクリックしてモーダルを開く関数
  const openNotificationModal = (notification: Notification) => {
    // 未読の場合は既読にする
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };
  
  // モーダルを閉じる関数
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 日付フォーマット関数
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold">お知らせ</h2>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          お知らせはありません
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`bg-white rounded-lg shadow-md overflow-hidden transition-all cursor-pointer hover:shadow-lg hover:bg-gray-50 ${!notification.read ? 'border-l-4 border-blue-500' : ''}`}
              onClick={() => openNotificationModal(notification)}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-lg font-semibold ${!notification.read ? 'text-blue-800' : ''}`}>
                    {notification.title}
                    {!notification.read && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                        未読
                      </span>
                    )}
                  </h3>
                  <span className="text-sm text-gray-500">{formatDate(notification.date)}</span>
                </div>
                <p className="text-gray-600 mb-0">{notification.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          ホームに戻る
        </Link>
      </div>

      {/* お知らせ詳細モーダル */}
      <Transition show={isModalOpen} as="div">
        <Dialog onClose={closeModal} className="relative z-50">
          {/* 背景オーバーレイ */}
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
          </Transition.Child>

          {/* モーダルコンテンツ */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-lg bg-white p-8 shadow-2xl border border-gray-200">
                {selectedNotification && (
                  <>
                    <Dialog.Title className="text-2xl font-semibold mb-2">
                      {selectedNotification.title}
                    </Dialog.Title>
                    <div className="text-sm text-gray-500 mb-6">
                      {formatDate(selectedNotification.date)}
                    </div>
                    <Dialog.Description className="text-gray-600 mb-6 text-lg leading-relaxed">
                      {selectedNotification.content}
                    </Dialog.Description>
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={closeModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-md transition-colors text-base"
                      >
                        閉じる
                      </button>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}