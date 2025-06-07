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
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies
      }
    },
    callbackUrl: {
      name: `admin-next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies
      }
    },
    csrfToken: {
      name: `admin-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies
      }
    },
  },
  callbacks: {
    async signIn({ user }) {
      try {
        // 環境変数のチェック
        if (!process.env.DATABASE_URL) {
          console.error('DATABASE_URL is not set');
          return false;
        }

        // ユーザーのロールをチェック
        const dbUser = await prisma.user.findUnique({
          where: { lineId: user.id },
        });

        // ユーザーが存在しない、またはADMINロールでない場合はログイン拒否
        if (!dbUser || dbUser.role !== 'ADMIN') {
          return false;
        }

        return true;
      } catch (error) {
        console.error('SignIn error:', error);
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
        } catch (error) {
          console.error('JWT callback error:', error);
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