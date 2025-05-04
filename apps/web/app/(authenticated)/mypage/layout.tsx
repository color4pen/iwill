import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "iWill - マイページ",
  description: "あなたの情報や投稿を管理するページです",
};

export default function MyPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}