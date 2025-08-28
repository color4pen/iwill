import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { paths } from "@/lib/paths";
import { prisma } from "@/lib/prisma";
import MyPageClient from "./mypage-client";

export default async function MyPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect(paths.login);
  }

  let userMedia: any[] = [];

  try {
    // ユーザーがアップロードしたメディアを取得
    userMedia = await prisma.media.findMany({
      where: {
        userId: session.user.id,
        // 自分のメディアはすべて表示（承認状態に関係なく）
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // 最新50件まで
    });
  } catch (error) {
    console.error('Error fetching user media:', error);
    // エラーが発生してもページを表示できるようにデフォルト値を使用
  }

  // デバッグ用のログ出力
  console.log('MyPage - Session User:', session.user);
  console.log('MyPage - User Media Count:', userMedia.length);

  return (
    <MyPageClient 
      user={session.user} 
      userMedia={userMedia}
    />
  );
}

