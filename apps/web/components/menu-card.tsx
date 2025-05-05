"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface MenuCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  href: string;
  color?: string;
  disabled?: boolean;
  disabledText?: string;
}

export const MenuCard = ({
  title,
  description,
  icon,
  href,
  color = "bg-blue-500",
  disabled = false,
  disabledText = "準備中..."
}: MenuCardProps) => {
  const CardContent = () => (
    <div className={`${color} ${disabled ? 'opacity-60 grayscale' : ''} text-white p-3 sm:p-6 rounded-md border border-white/20 shadow-sm ${!disabled && 'hover:shadow'} transition-all duration-200 h-full flex items-center sm:justify-center relative`}>
      {disabled && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px] rounded-md z-10">
          <div className="bg-black/70 py-1.5 px-3 rounded text-sm font-medium">
            {disabledText}
          </div>
        </div>
      )}
  
      <div className="flex items-center ml-3 sm:ml-0 sm:justify-center text-left sm:text-center">
        {icon && <div className="mr-2 text-white/90">{icon}</div>}
        <h3 className="text-base sm:text-xl font-semibold">{title}</h3>
      </div>
    </div>
  );

  return (
    <div className="block h-20 sm:h-auto sm:aspect-square">
      {disabled ? (
        <CardContent />
      ) : (
        <Link href={href} className="block h-full">
          <CardContent />
        </Link>
      )}
    </div>
  );
};