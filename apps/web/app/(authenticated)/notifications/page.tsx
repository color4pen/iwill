"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// お知らせの型定義
interface Notification {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // お知らせを取得
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 日付フォーマット
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

  // カテゴリーのスタイル
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'IMPORTANT':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'SCHEDULE':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'VENUE':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // カテゴリーのラベル
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'IMPORTANT':
        return '重要';
      case 'SCHEDULE':
        return 'スケジュール';
      case 'VENUE':
        return '会場';
      default:
        return '一般';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

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
            <Link
              key={notification.id}
              href={`/notifications/${notification.id}`}
              className={`block py-4 px-3 transition-colors hover:bg-gray-50 ${!notification.read ? 'border-l-4 border-blue-500' : ''}`}
            >
              <div className="flex justify-between items-start mb-1.5">
                <div className="flex items-center gap-2">
                  <h3 className={`text-lg font-medium ${!notification.read ? 'text-blue-700' : ''}`}>
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <span className="text-blue-600 text-xs font-medium">
                      • 未読
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap ${getCategoryStyle(notification.category)}`}>
                    {getCategoryLabel(notification.category)}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{formatDate(notification.date)}</span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">{notification.content}</p>
            </Link>
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
    </>
  );
}