"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { LineLoginButton } from "./line-login-button";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { paths } from "@/lib/paths";

export default function AuthStatus() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLineLogin = () => {
    signIn("line", { callbackUrl: paths.home });
  };

  const handleLogout = () => {
    signOut({ callbackUrl: paths.home });
  };

  // メニュー外のクリックでメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (status === "loading") {
    return <div className="text-gray-400 text-sm animate-pulse">ローディング中...</div>;
  }

  if (status === "authenticated") {
    return (
      <div className="flex items-center relative" ref={menuRef}>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center group hover:opacity-90 transition-opacity focus:outline-none"
          aria-label="ユーザーメニューを開く"
        >
          {session.user.image ? (
            <div className="relative">
              <img
                src={session.user.image}
                alt={session.user.name || "プロフィール画像"}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-100 transition-all duration-200"
              />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <span className="text-sm font-medium">{session.user.name?.[0] || "G"}</span>
            </div>
          )}
        </button>
        
        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="font-medium text-sm truncate">{session.user.name || "ゲスト"}</p>
              <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
            </div>
            <div 
              className="block px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
            >
              プロフィール（準備中）
            </div>
            <a 
              href={window.location.hostname === 'localhost' 
                ? 'http://localhost:3001' 
                : `${window.location.protocol}//admin.${window.location.host.replace('www.', '')}`
              }
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              管理画面
            </a>
            <div className="border-t border-gray-100 mt-1">
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                ログアウト
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <LineLoginButton onClick={handleLineLogin} />
      <Link
        href={paths.login}
        className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
      >
        ログインページ
      </Link>
    </div>
  );
}