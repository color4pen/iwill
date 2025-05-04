"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import { LineLoginButton } from "@repo/ui/line-login-button";
import Link from "next/link";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  const handleLineLogin = () => {
    signIn("line", { callbackUrl: "/" });
  };

  if (status === "loading") {
    return <div className="text-gray-400 text-sm animate-pulse">ローディング中...</div>;
  }

  if (status === "authenticated") {
    return (
      <div className="flex items-center">
        <Link href="/settings" className="flex items-center group hover:opacity-90 transition-opacity">
          {session.user.image ? (
            <div className="relative">
              <img
                src={session.user.image}
                alt={session.user.name || "プロフィール画像"}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-100 transition-all duration-200"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-3 h-3 border-2 border-white"></div>
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <span className="text-sm font-medium">{session.user.name?.[0] || "G"}</span>
            </div>
          )}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <LineLoginButton onClick={handleLineLogin} />
      <Link 
        href="/login" 
        className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
      >
        ログインページ
      </Link>
    </div>
  );
}