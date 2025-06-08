import { NextAuthOptions } from "next-auth"
import LineProvider from "next-auth/providers/line"
import { prisma } from "./prisma"

const useSecureCookies = process.env.NODE_ENV === 'production';

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
        sameSite: useSecureCookies ? 'none' : 'lax',
        path: '/',
        secure: useSecureCookies
      }
    },
    callbackUrl: {
      name: `admin-next-auth.callback-url`,
      options: {
        sameSite: useSecureCookies ? 'none' : 'lax',
        path: '/',
        secure: useSecureCookies
      }
    },
    csrfToken: {
      name: `admin-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: useSecureCookies ? 'none' : 'lax',
        path: '/',
        secure: useSecureCookies
      }
    },
  },
  callbacks: {
    async signIn({ user, profile }) {
      try {
        // 環境変数のチェック
        if (!process.env.DATABASE_URL) {
          return false;
        }

        // 既存のユーザーを確認
        let dbUser = await prisma.user.findUnique({
          where: { lineId: user.id },
        });

        // ユーザーが存在しない場合
        if (!dbUser) {
          // 最初のユーザーかチェック（ADMINユーザーが存在しない）
          const adminCount = await prisma.user.count({
            where: { role: 'ADMIN' }
          });

          // 最初のユーザーの場合、自動的にADMINとして作成
          if (adminCount === 0) {
            dbUser = await prisma.user.create({
              data: {
                lineId: user.id!,
                name: user.name || (profile as Record<string, unknown>)?.displayName as string || 'Admin',
                email: user.email || (profile as Record<string, unknown>)?.email as string || undefined,
                image: user.image || (profile as Record<string, unknown>)?.pictureUrl as string || undefined,
                role: 'ADMIN'
              }
            });
            return true;
          } else {
            // 既にADMINが存在する場合は新規登録を拒否
            return false;
          }
        }

        // 既存ユーザーの場合、ADMINロールかチェック
        if (dbUser.role !== 'ADMIN') {
          return false;
        }

        return true;
      } catch {
        return false;
      }
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        token.id = user.id

        try {
          // ロール情報も追加
          const dbUser = await prisma.user.findUnique({
            where: { lineId: user.id },
          });
          token.role = dbUser?.role || 'USER';
        } catch {
          token.role = 'USER';
        }
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
  debug: process.env.NODE_ENV === 'development',
  useSecureCookies: useSecureCookies
}