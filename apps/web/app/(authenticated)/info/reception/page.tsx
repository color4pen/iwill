import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ReceptionClient from "./reception-client";

export default async function ReceptionPage() {
  const session = await getServerSession(authOptions);
  
  // ユーザー情報を取得
  const user = session?.user?.id ? await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  }) : null;
  
  const isAdmin = user?.role === 'ADMIN';

  return <ReceptionClient isAdmin={isAdmin} />;
}