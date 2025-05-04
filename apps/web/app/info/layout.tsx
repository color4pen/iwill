import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "iWill - 式情報",
  description: "結婚式の詳細情報を確認できます",
};

export default function InfoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}