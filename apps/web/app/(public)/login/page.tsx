"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  // ボタン状態の管理
  const [buttonState, setButtonState] = useState<'base' | 'hover' | 'press'>('base');

  const handleLineLogin = () => {
    setButtonState('press');
    // callbackUrlを指定し、redirectを強制することで即時リダイレクト
    signIn("line", { callbackUrl: "/", redirect: true });
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


          <div className="mb-8 text-center">
            <p className="text-sm text-gray-600 mb-3">
              ログインする前に以下をご確認ください
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/terms" className="text-blue-600 hover:text-blue-800 text-sm">
                利用規約
              </Link>
              <span className="text-gray-400">|</span>
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800 text-sm">
                プライバシーポリシー
              </Link>
            </div>
          </div>


          <div className="text-center">


            <button
              onClick={handleLineLogin}
              onMouseEnter={() => setButtonState('hover')}
              onMouseLeave={() => setButtonState('base')}
              onMouseDown={() => setButtonState('press')}
              onMouseUp={() => setButtonState('hover')}
              className="relative focus:outline-none transition-all"
            >
              <Image
                src={`/line/btn_login_${buttonState}.png`}
                alt="LINEでログイン"
                width={400}
                height={50}
                className="h-[50px]"
                style={{ width: 'auto' }}
              />
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}