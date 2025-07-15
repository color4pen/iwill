import { NextAuthOptions } from "next-auth"
import { baseAuthOptions, getCookieConfig } from "./base"
import { prisma } from "@repo/database"

/**
 * Webアプリ用のNextAuth設定
 */
export const webAuthOptions: NextAuthOptions = {
  ...baseAuthOptions,
  providers: baseAuthOptions.providers || [],
  cookies: getCookieConfig('web'),
  callbacks: {
    ...baseAuthOptions.callbacks,
    async signIn({ user, account, profile }) {
      if (account?.provider !== "line") {
        return false
      }

      try {
        const lineId = user.id
        
        // 既存のユーザーをチェック
        const existingUser = await prisma.user.findUnique({
          where: { lineId },
        })

        // ユーザーが存在する場合は情報を更新してログイン許可
        if (existingUser) {
          await prisma.user.update({
            where: { lineId },
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
            },
          })
          return true
        }

        // ユーザーが存在しない場合
        // 新規ユーザーの場合も一時的にログインを許可
        // （招待ページでトークン検証後にユーザー作成される）
        console.log("New user signing in:", lineId)
        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        return false
      }
    },
    async jwt({ token, account, profile, user }) {
      // 初回ログイン時にアカウント情報をトークンに追加
      if (account && user) {
        token.accessToken = account.access_token
        token.provider = account.provider
        token.lineId = user.id // LINE IDを保存
        
        // データベースからユーザーIDを取得
        const dbUser = await prisma.user.findUnique({
          where: { lineId: user.id }
        })
        
        if (dbUser) {
          token.id = dbUser.id // データベースのユーザーID
          token.role = dbUser.role
        } else {
          // ユーザーがまだ存在しない場合はLINE IDを使用
          token.id = user.id
        }
      } else if (token.lineId) {
        // 既存のセッションの場合、LINE IDから再度ユーザーIDを確認
        const dbUser = await prisma.user.findUnique({
          where: { lineId: token.lineId as string }
        })
        
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
        }
      }
      return token
    },
    async session({ session, token }) {
      // セッションにトークン情報を追加
      if (session.user) {
        session.user.id = token.id as string
        session.user.lineId = token.lineId as string
        session.user.accessToken = token.accessToken as string
        session.user.provider = token.provider as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
}