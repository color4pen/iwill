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
        sameSite: useSecureCookies ? 'none' : 'lax',
        path: '/',
        secure: useSecureCookies
      }
    },
    callbackUrl: {
      name: `web-next-auth.callback-url`,
      options: {
        sameSite: useSecureCookies ? 'none' : 'lax',
        path: '/',
        secure: useSecureCookies
      }
    },
    csrfToken: {
      name: `web-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: useSecureCookies ? 'none' : 'lax',
        path: '/',
        secure: useSecureCookies
      }
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "line") {
        return false;
      }

      const { prisma } = await import('./prisma');
      
      try {
        const lineId = user.id;
        
        // 既存のユーザーをチェック
        const existingUser = await prisma.user.findUnique({
          where: { lineId },
        });

        // ユーザーが存在する場合は情報を更新してログイン許可
        if (existingUser) {
          await prisma.user.update({
            where: { lineId },
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
            },
          });
          return true;
        }

        // ユーザーが存在しない場合
        // 新規ユーザーの場合も一時的にログインを許可
        // （招待ページでトークン検証後にユーザー作成される）
        console.log("New user signing in:", lineId);
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, account, profile, user }) {
      // 初回ログイン時にアカウント情報をトークンに追加
      if (account && user) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        token.lineId = user.id; // LINE IDを保存
        
        // データベースからユーザーIDを取得
        const { prisma } = await import('./prisma');
        const dbUser = await prisma.user.findUnique({
          where: { lineId: user.id }
        });
        
        if (dbUser) {
          token.id = dbUser.id; // データベースのユーザーID
        } else {
          // ユーザーがまだ存在しない場合はLINE IDを使用
          token.id = user.id;
        }
      } else if (token.lineId) {
        // 既存のセッションの場合、LINE IDから再度ユーザーIDを確認
        const { prisma } = await import('./prisma');
        const dbUser = await prisma.user.findUnique({
          where: { lineId: token.lineId as string }
        });
        
        if (dbUser) {
          token.id = dbUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // セッションにトークン情報を追加
      if (session.user) {
        session.user.id = token.id as string;
        session.user.lineId = token.lineId as string; // デバッグ用
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