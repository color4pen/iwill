"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import AuthStatus from "../../components/auth-status";
import { BackToTop } from "../../components/back-to-top";

interface LayoutFrameProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutFrameProps) {
  // モバイルメニューは不要のため削除

  return (
    <div className="min-h-screen flex flex-col bg-white relative">

      <header className="w-full p-4 bg-white shadow-md z-20 text-gray-800 border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:opacity-80">
              <h1 className="text-2xl font-bold text-gray-800">iWill</h1>
            </Link>
            {process.env.NODE_ENV === 'development' && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">LOCAL</span>
            )}
          </div>

          <div className="flex items-center">
            <AuthStatus />
          </div>
        </div>
      </header>

      {/* モバイルメニューは不要のため  削除 */}

      <main className="container mx-auto max-w-4xl py-5 px-3 flex-grow relative flex flex-col overflow-hidden">
        {children}
      </main>

      <footer className="bg-white text-gray-800 py-3 px-4 mt-auto shadow-md border-t border-gray-100 relative">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-2 md:mb-0">
              <p className="text-center md:text-left text-sm">© 2025 iWill</p>
            </div>
            <div className="flex space-x-3">
              <Link href="/privacy" className="hover:text-gray-600 text-xs">プライバシーポリシー</Link>
              <Link href="/terms" className="hover:text-gray-600 text-xs">利用規約</Link>
            </div>
          </div>
        </div>
      </footer>
      
      <BackToTop />
    </div>
  );
}