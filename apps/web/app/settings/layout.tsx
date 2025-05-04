import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "iWill - 設定",
  description: "アカウントや通知の設定を変更するページです",
};

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}