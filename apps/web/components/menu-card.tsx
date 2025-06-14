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
  badge?: number;
}

export const MenuCard = ({
  title,
  description,
  icon,
  href,
  color = "bg-blue-500",
  disabled = false,
  disabledText = "準備中...",
  badge
}: MenuCardProps) => {
  const CardContent = () => (
    <div className={`${disabled ? 'bg-gray-400 opacity-60 grayscale' : color} text-white p-3 sm:p-6 rounded-md border border-white/20 shadow-sm ${!disabled && 'hover:shadow'} transition-all duration-200 h-full flex items-center sm:justify-center relative`}>
      {disabled && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-end sm:justify-center z-10 pr-2 sm:pr-0">
          <div className="bg-gray-700/90 py-1 px-2.5 rounded-full text-xs font-medium">
            {disabledText}
          </div>
        </div>
      )}
      
      {badge && badge > 0 && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full">
            {badge}
          </span>
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