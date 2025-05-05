"use client";

import React, { ReactNode } from "react";
import Link from "next/link";

interface LayoutFrameProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutFrameProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      
      <header className="w-full p-4 bg-white shadow-md z-10 border-b border-gray-100 text-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:opacity-80">
              <h1 className="text-2xl font-bold text-gray-800">iWill</h1>
            </Link>
            {process.env.NODE_ENV === 'development' && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">LOCAL</span>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
        {children}
      </main>

      <footer className="bg-white text-gray-800 py-3 px-4 mt-auto z-10 border-t border-gray-100">
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
    </div>
  );
}