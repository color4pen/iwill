import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      lineId?: string
      accessToken?: string
      provider?: string
      role?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    lineId?: string
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    lineId?: string
    accessToken?: string
    provider?: string
    role?: string
  }
}