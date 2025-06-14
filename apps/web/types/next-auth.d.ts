import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      lineId?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
      provider?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    lineId?: string;
    accessToken?: string;
    provider?: string;
  }
}