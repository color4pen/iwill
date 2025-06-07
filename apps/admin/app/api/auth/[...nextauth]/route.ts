import NextAuth, { NextAuthOptions } from "next-auth"
import LineProvider from "next-auth/providers/line"
import { PrismaClient } from "@prisma/client"

// ローカルでPrismaクライアントを初期化
const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  // 一時的にアダプターを無効化してJWT戦略を使用
  // adapter: PrismaAdapter(prisma),
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "profile openid email",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt", // JWT戦略に戻す
  },
  cookies: {
    sessionToken: {
      name: `admin-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false // 開発環境用
      }
    },
    callbackUrl: {
      name: `admin-next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: false
      }
    },
    csrfToken: {
      name: `admin-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false
      }
    },
  },
  callbacks: {
    async signIn({ user }) {
      // ユーザーのロールをチェック
      const dbUser = await prisma.user.findUnique({
        where: { lineId: user.id },
      });

      // ユーザーが存在しない、またはADMINロールでない場合はログイン拒否
      if (!dbUser || dbUser.role !== 'ADMIN') {
        return false;
      }

      return true;
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        token.id = user.id
        
        // ロール情報も追加
        const dbUser = await prisma.user.findUnique({
          where: { lineId: user.id },
        });
        token.role = dbUser?.role || 'USER';
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: true, // デバッグモードを有効化
  useSecureCookies: false, // 開発環境でセキュアクッキーを無効化
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }