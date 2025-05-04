import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "iWill - メディア",
  description: "結婚式の写真や動画を閲覧・アップロードできます",
};

export default function MediasLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}