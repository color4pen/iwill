"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { paths } from "@/lib/paths";

function LoginContent() {
  // ボタン状態の管理
  const [buttonState, setButtonState] = useState<'base' | 'hover' | 'press'>('base');
  const searchParams = useSearchParams();
  const [showInvitationError, setShowInvitationError] = useState(false);
  const [invitationToken, setInvitationToken] = useState<string | null>(null);

  useEffect(() => {
    const error = searchParams.get("error");
    const token = searchParams.get("invitation");

    if (error === "invitation_required") {
      setShowInvitationError(true);
    }

    // NextAuthのAccessDeniedエラー（招待されていないユーザー）
    if (error === "AccessDenied") {
      setShowInvitationError(true);
    }

    if (token) {
      setInvitationToken(token);
    }
  }, [searchParams]);

  const handleLineLogin = () => {
    setButtonState('press');
    let callbackUrl: string = paths.home;

    // 招待トークンがある場合は、コールバックURLに含める
    if (invitationToken) {
      const lineId = searchParams.get("lineId");
      callbackUrl = `${paths.invitation}?token=${invitationToken}`;
      if (lineId) {
        callbackUrl += `&lineId=${lineId}`;
      }
    }

    signIn("line", { callbackUrl, redirect: true });
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

          {showInvitationError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="text-sm">
                このアプリを利用するには招待が必要です。
                管理者から招待URLを受け取ってください。
              </p>
            </div>
          )}

          {invitationToken && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              <p className="text-sm">
                招待URLが確認されました。
                LINEでログインして登録を完了してください。
              </p>
            </div>
          )}


          <div className="mb-8 text-center">
            <p className="text-sm text-gray-600 mb-3">
              ログインする前に以下をご確認ください
            </p>
            <div className="flex justify-center space-x-4">
              <Link href={paths.terms} className="text-blue-600 hover:text-blue-800 text-sm">
                利用規約
              </Link>
              <span className="text-gray-400">|</span>
              <Link href={paths.privacy} className="text-blue-600 hover:text-blue-800 text-sm">
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="h-full flex items-center justify-center flex-grow py-10">
        <div className="inline-flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-700">読み込み中...</span>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}