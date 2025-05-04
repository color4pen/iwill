"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [buttonState, setButtonState] = useState<'base' | 'hover' | 'press'>('base');

  const handleLineLogin = async () => {
    setIsLoading(true);
    setButtonState('press');
    try {
      await signIn("line", { callbackUrl: "/" });
    } catch (error) {
      console.error("Login error:", error);
      setButtonState('base');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center flex-grow">
      <button
        onClick={handleLineLogin}
        onMouseEnter={() => setButtonState('hover')}
        onMouseLeave={() => setButtonState('base')}
        onMouseDown={() => setButtonState('press')}
        onMouseUp={() => setButtonState('hover')}
        disabled={isLoading}
        className="relative focus:outline-none transition-opacity"
        style={{ opacity: isLoading ? 0.7 : 1 }}
      >
        <Image
          src={`/line/btn_login_${buttonState}.png`}
          alt="LINEでログイン"
          width={400}
          height={66}
          className="w-full h-[60px]"
        />
      </button>
    </div>
  );
}