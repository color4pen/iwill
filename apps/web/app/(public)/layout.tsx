"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { BackToTop } from "../../components/back-to-top";

interface LayoutFrameProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutFrameProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <main className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
        {children}
      </main>
      
      <BackToTop />
    </div>
  );
}