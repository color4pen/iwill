import { NextAuthOptions } from "next-auth";
import LineProvider from "next-auth/providers/line";

const useSecureCookies = process.env.NODE_ENV === 'production';

export const authOptions: NextAuthOptions = {
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID as string,
      clientSecret: process.env.LINE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: `web-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies
      }
    },
    callbackUrl: {
      name: `web-next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies
      }
    },
    csrfToken: {
      name: `web-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies
      }
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // 既存ユーザーかチェック
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      
      try {
        const existingUser = await prisma.user.findUnique({
          where: { lineId: user.id },
        });

        // 既存ユーザーならログイン許可
        if (existingUser) {
          await prisma.$disconnect();
          return true;
        }

        // 新規ユーザーの場合は一旦保留（招待ページで処理）
        await prisma.$disconnect();
        return true;
      } catch {
        await prisma.$disconnect();
        return false;
      }
    },
    async jwt({ token, account, profile, user }) {
      // 初回ログイン時にアカウント情報をトークンに追加
      if (account && user) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // セッションにトークン情報を追加
      if (session.user) {
        session.user.id = token.id as string;
        session.user.accessToken = token.accessToken as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: "/login", // カスタムログインページのパス
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  useSecureCookies: useSecureCookies
};