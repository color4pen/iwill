import { NextAuthOptions } from "next-auth"
import LineProvider from "next-auth/providers/line"

const useSecureCookies = process.env.NODE_ENV === 'production'

/**
 * 共通のNextAuth設定
 */
export const baseAuthOptions: Partial<NextAuthOptions> = {
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID as string,
      clientSecret: process.env.LINE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "profile openid email",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  useSecureCookies,
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
}

/**
 * クッキー名のプレフィックスを生成
 */
export function getCookiePrefix(appName: string): string {
  return `${appName}-next-auth`
}

/**
 * クッキー設定を生成
 */
export function getCookieConfig(appName: string) {
  const prefix = getCookiePrefix(appName)
  
  return {
    sessionToken: {
      name: `${prefix}.session-token`,
      options: {
        httpOnly: true,
        sameSite: useSecureCookies ? 'none' as const : 'lax' as const,
        path: '/',
        secure: useSecureCookies
      }
    },
    callbackUrl: {
      name: `${prefix}.callback-url`,
      options: {
        sameSite: useSecureCookies ? 'none' as const : 'lax' as const,
        path: '/',
        secure: useSecureCookies
      }
    },
    csrfToken: {
      name: `${prefix}.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: useSecureCookies ? 'none' as const : 'lax' as const,
        path: '/',
        secure: useSecureCookies
      }
    },
  }
}