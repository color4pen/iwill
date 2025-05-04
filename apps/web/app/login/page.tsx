"use client";

import { getProviders, useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LineLoginButton } from "../components/line-login-button";

export default function LoginPage() {
  const { status } = useSession();
  const [providers, setProviders] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // ログイン済みならリダイレクト
    if (status === "authenticated") {
      router.push("/");
    }

    // プロバイダーの取得
    const fetchProviders = async () => {
      const providersData = await getProviders();
      setProviders(providersData);
    };
    fetchProviders();
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">ローディング中...</div>;
  }

  const handleLineLogin = () => {
    signIn("line", { callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-8">ログイン</h1>

        <div className="flex flex-col space-y-4">
          {providers && Object.values(providers).map((provider: any) => (
            <div key={provider.name}>
              {provider.id === "line" && (
                <LineLoginButton onClick={handleLineLogin} />
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}