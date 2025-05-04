"use client";

import Protected from "../components/protected";
import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  
  // トグルスイッチの状態
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newMediaNotifications: true,
    eventReminderNotifications: true,
    lineNotifications: true,
  });

  // プライバシー設定の状態
  const [privacySettings, setPrivacySettings] = useState({
    showEmail: false,
    publicProfile: true,
    allowTagging: true,
  });

  // 設定の変更を処理
  const handleToggleChange = (settingType: string, name: string) => {
    if (settingType === 'notification') {
      setNotificationSettings({
        ...notificationSettings,
        [name]: !notificationSettings[name as keyof typeof notificationSettings],
      });
    } else if (settingType === 'privacy') {
      setPrivacySettings({
        ...privacySettings,
        [name]: !privacySettings[name as keyof typeof privacySettings],
      });
    }
  };

  // 設定の保存
  const handleSaveSettings = () => {
    // ここでAPIを呼び出し、設定を保存する
    alert("設定が保存されました（デモ表示）");
  };

  // アカウント削除の確認
  const handleDeleteAccount = () => {
    const confirmed = confirm("本当にアカウントを削除しますか？この操作は元に戻せません。");
    if (confirmed) {
      // 実際のアプリケーションではここでアカウント削除のAPIを呼び出す
      alert("アカウントが削除されました（デモ表示）");
      signOut({ callbackUrl: "/" });
    }
  };

  return (
    <Protected>
      <>
        <h2 className="text-3xl font-bold mb-8 text-center">設定</h2>
          
          {/* タブナビゲーション */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="flex border-b">
              <button 
                className={`px-6 py-3 text-center flex-1 ${activeTab === 'account' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('account')}
              >
                アカウント設定
              </button>
              <button 
                className={`px-6 py-3 text-center flex-1 ${activeTab === 'notifications' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('notifications')}
              >
                通知設定
              </button>
              <button 
                className={`px-6 py-3 text-center flex-1 ${activeTab === 'privacy' ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('privacy')}
              >
                プライバシー設定
              </button>
            </div>
            
            <div className="p-6">
              {/* アカウント設定タブ */}
              {activeTab === 'account' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">アカウント設定</h3>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-lg mb-2">ログイン連携</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        現在、LINE認証でログインしています。
                      </p>
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span>LINE</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          連携中
                        </span>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                        >
                          ログアウトする
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-lg mb-2">言語設定</h4>
                      <select className="w-full p-2 border rounded-md">
                        <option value="ja">日本語</option>
                        <option value="en">English</option>
                        <option value="zh">中文</option>
                        <option value="ko">한국어</option>
                      </select>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-lg mb-2">テーマ設定</h4>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input type="radio" name="theme" value="light" className="mr-2" defaultChecked />
                          ライトモード
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="theme" value="dark" className="mr-2" />
                          ダークモード
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="theme" value="system" className="mr-2" />
                          システム設定に合わせる
                        </label>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-lg text-red-600 mb-2">危険な操作</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        以下の操作は取り消せません。ご注意ください。
                      </p>
                      <button 
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        アカウントを削除する
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 通知設定タブ */}
              {activeTab === 'notifications' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">通知設定</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <div>
                        <p className="font-medium">メール通知</p>
                        <p className="text-sm text-gray-500">イベントの更新や重要なお知らせをメールで受け取る</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationSettings.emailNotifications}
                          onChange={() => handleToggleChange('notification', 'emailNotifications')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <div>
                        <p className="font-medium">プッシュ通知</p>
                        <p className="text-sm text-gray-500">アプリのプッシュ通知を受け取る</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationSettings.pushNotifications}
                          onChange={() => handleToggleChange('notification', 'pushNotifications')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <div>
                        <p className="font-medium">新しいメディア通知</p>
                        <p className="text-sm text-gray-500">新しい写真や動画がアップロードされたとき通知を受け取る</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationSettings.newMediaNotifications}
                          onChange={() => handleToggleChange('notification', 'newMediaNotifications')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <div>
                        <p className="font-medium">イベントリマインダー</p>
                        <p className="text-sm text-gray-500">結婚式の日程が近づいたらリマインダーを受け取る</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationSettings.eventReminderNotifications}
                          onChange={() => handleToggleChange('notification', 'eventReminderNotifications')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <div>
                        <p className="font-medium">LINE通知</p>
                        <p className="text-sm text-gray-500">LINEでも通知を受け取る</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationSettings.lineNotifications}
                          onChange={() => handleToggleChange('notification', 'lineNotifications')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              {/* プライバシー設定タブ */}
              {activeTab === 'privacy' && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">プライバシー設定</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <div>
                        <p className="font-medium">メールアドレスを公開</p>
                        <p className="text-sm text-gray-500">他の参加者にメールアドレスを表示する</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={privacySettings.showEmail}
                          onChange={() => handleToggleChange('privacy', 'showEmail')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <div>
                        <p className="font-medium">パブリックプロフィール</p>
                        <p className="text-sm text-gray-500">他の参加者があなたのプロフィールや投稿を閲覧できる</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={privacySettings.publicProfile}
                          onChange={() => handleToggleChange('privacy', 'publicProfile')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <div>
                        <p className="font-medium">タグ付けを許可</p>
                        <p className="text-sm text-gray-500">他の参加者があなたに写真や投稿でタグ付けできる</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={privacySettings.allowTagging}
                          onChange={() => handleToggleChange('privacy', 'allowTagging')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 保存ボタン */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button 
                  onClick={handleSaveSettings}
                  className="px-6 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
                >
                  設定を保存
                </button>
              </div>
            </div>
          </div>
      </>
    </Protected>
  );
}