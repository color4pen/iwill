"use client";

import React from "react";
import { ReactNode } from "react";

interface LayoutFrameProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutFrameProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {children}
    </div>
  );
}