import { DefaultSession } from "next-auth"

/**
 * NextAuth.jsのセッション型を拡張
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      lineId?: string
      role?: string
      accessToken?: string
      provider?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    lineId?: string
    role?: string
  }
}

/**
 * NextAuth.jsのJWT型を拡張
 */
declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    lineId?: string
    role?: string
    accessToken?: string
    provider?: string
  }
}