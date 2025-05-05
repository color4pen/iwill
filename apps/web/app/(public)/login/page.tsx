"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [buttonState, setButtonState] = useState<'base' | 'hover' | 'press'>('base');
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const handleLineLogin = async () => {
    setIsLoading(true);
    setButtonState('press');
    try {
      await signIn("line", { callbackUrl: "/" });
    } catch (error) {
      console.error("Login error:", error);
      setButtonState('base');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center flex-grow py-10 relative">

      <div className="flex flex-col items-center space-y-10 max-w-sm w-full px-4 z-10">
        <div className="bg-white p-6 rounded-lg w-full border border-gray-200 shadow-md">
          <div className="text-center mb-3">
            <p className="text-gray-800 text-lg mb-2">
              ログイン
            </p>

            <p className="text-center text-gray-600 text-xs">
              利用規約に同意しログイン
            </p>
          </div>


          <div className="space-y-4 mb-8">

            <div
              className={`p-3 cursor-pointer rounded transition-all ${activeItem === 2 ? 'bg-gray-100 border-gray-300' : 'bg-white hover:bg-gray-50 border-gray-200'} border`}
              onMouseEnter={() => setActiveItem(2)}
              onMouseLeave={() => setActiveItem(null)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2 text-lg">▶</span>
                  <span className="text-gray-800 font-medium">
                    <Link href="/terms" target="_blank" className="hover:underline">
                      利用規約
                    </Link>
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`p-3 cursor-pointer rounded transition-all ${activeItem === 1 ? 'bg-gray-100 border-gray-300' : 'bg-white hover:bg-gray-50 border-gray-200'} border`}
              onMouseEnter={() => setActiveItem(1)}
              onMouseLeave={() => setActiveItem(null)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2 text-lg">▶</span>
                  <span className="text-gray-800 font-medium">
                    <Link href="/privacy" target="_blank" className="hover:underline">
                      プライバシーポリシー
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>


          <div className="text-center">


            <button
              onClick={handleLineLogin}
              onMouseEnter={() => {
                setButtonState('hover');
                setActiveItem(3);
              }}
              onMouseLeave={() => {
                setButtonState('base');
                setActiveItem(null);
              }}
              onMouseDown={() => setButtonState('press')}
              onMouseUp={() => setButtonState('hover')}
              disabled={isLoading}
              className={`relative focus:outline-none transition-all ${activeItem === 3 ? 'scale-105' : ''}`}
            >
              <Image
                src={`/line/btn_login_${buttonState}.png`}
                alt="LINEでログイン"
                width={400}
                height={50}
                className="h-[50px]"
                style={{ width: 'auto' }}
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                </div>
              )}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}