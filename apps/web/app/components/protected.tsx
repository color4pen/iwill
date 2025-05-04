"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default function Protected({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">ローディング中...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/login");
    return null;
  }

  return <>{children}</>;
}