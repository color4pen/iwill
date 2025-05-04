"use client";

import { ReactNode } from "react";
import Link from "next/link";
import AuthStatus from "./auth-status";

interface LayoutFrameProps {
  children: ReactNode;
}

export default function LayoutFrame({ children }: LayoutFrameProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full p-4 bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:opacity-80">
              <h1 className="text-2xl font-bold">iWill</h1>
            </Link>
            {process.env.NODE_ENV === 'development' && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">LOCAL</span>
            )}
          </div>
          <AuthStatus />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>

      <footer className="bg-gray-800 text-white py-3 px-4 mt-auto">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-2 md:mb-0">
              <p className="text-center md:text-left text-sm">© 2025 iWill</p>
            </div>
            <div className="flex space-x-3">
              <a href="#" className="hover:text-gray-300 text-xs">プライバシーポリシー</a>
              <a href="#" className="hover:text-gray-300 text-xs">利用規約</a>
              <a href="#" className="hover:text-gray-300 text-xs">お問い合わせ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}