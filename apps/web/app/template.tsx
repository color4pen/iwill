"use client";

import LayoutFrame from "./components/layout-frame";

export default function Template({ children }: { children: React.ReactNode }) {
  return <LayoutFrame>{children}</LayoutFrame>;
}