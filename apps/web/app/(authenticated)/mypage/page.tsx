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
  let mediaSituations: any[] = [];

  try {
    // ユーザーがアップロードしたメディアを取得
    userMedia = await prisma.media.findMany({
      where: {
        userId: session.user.id,
        // 自分のメディアはすべて表示（承認状態に関係なく）
      },
      include: {
        mediaSituation: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // 最新50件まで
    });

    // メディアシチュエーションのリストを取得
    mediaSituations = await prisma.mediaSituation.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        order: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
  } catch (error) {
    // エラーが発生してもページを表示できるようにデフォルト値を使用
  }


  return (
    <MyPageClient 
      user={session.user} 
      userMedia={userMedia}
      mediaSituations={mediaSituations}
    />
  );
}

