import NextAuth from "next-auth";
import LineProvider from "next-auth/providers/line";

const handler = NextAuth({
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID as string,
      clientSecret: process.env.LINE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // 初回ログイン時にアカウント情報をトークンに追加
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      // セッションにトークン情報を追加
      session.user.accessToken = token.accessToken as string;
      session.user.provider = token.provider as string;
      return session;
    },
  },
  pages: {
    signIn: "/login", // カスタムログインページのパス
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };