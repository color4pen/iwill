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
        <div className="py-8 text-center text-gray-500">
          お知らせはありません
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`py-4 px-3 transition-colors cursor-pointer hover:bg-gray-50 ${!notification.read ? 'border-l-2 border-blue-500' : ''}`}
              onClick={() => openNotificationModal(notification)}
            >
              <div className="flex justify-between items-start mb-1.5">
                <h3 className={`text-lg font-medium ${!notification.read ? 'text-blue-700' : ''}`}>
                  {notification.title}
                  {!notification.read && (
                    <span className="ml-2 text-blue-600 text-xs font-medium">
                      • 未読
                    </span>
                  )}
                </h3>
                <span className="text-xs text-gray-500">{formatDate(notification.date)}</span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">{notification.content}</p>
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
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
          </Transition.Child>

          {/* モーダルコンテンツ */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
            >
              <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white p-6 sm:p-8">
                {selectedNotification && (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <Dialog.Title className="text-xl font-medium">
                        {selectedNotification.title}
                      </Dialog.Title>
                      <button 
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="閉じる"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 mb-4">
                      {formatDate(selectedNotification.date)}
                    </div>
                    <Dialog.Description className="text-gray-700 mb-6 text-base leading-relaxed">
                      {selectedNotification.content}
                    </Dialog.Description>
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