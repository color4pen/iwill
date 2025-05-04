"use client";

import { ReactNode } from "react";
import Image from "next/image";

interface LineLoginButtonProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const LineLoginButton = ({
  children = "LINEでログイン",
  className = "",
  onClick,
}: LineLoginButtonProps) => {
  return (
    <button
      className={`bg-[#00C300] hover:bg-[#00b300] text-white text-sm font-medium py-1.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all duration-200 ${className}`}
      onClick={onClick}
    >
      <div className="w-4 h-4 relative">
        <Image
          src="/line-logo.svg"
          alt="LINE"
          width={16}
          height={16}
          className="object-contain"
        />
      </div>
      <span className="text-sm">{children}</span>
    </button>
  );
};