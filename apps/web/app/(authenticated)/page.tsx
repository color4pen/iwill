import { Calendar, Camera, User, Settings } from "lucide-react";
import { shouldEnableRestrictedFeatures } from "../utils/environment";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { MenuCard } from "../../components/menu-card";

export default async function Home() {
  const session = await getServerSession();
  const enableAllFeatures = shouldEnableRestrictedFeatures();

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-8">ようこそ{session.user?.name ? `, ${session.user.name}さん` : ''}</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-10 mb-10">
        <MenuCard
          title="式情報"
          description="結婚式の詳細情報を確認する"
          href="/info"
          color="bg-rose-500"
          icon={<Calendar size={20} strokeWidth={1.5} />}
        />
        <MenuCard
          title="メディア"
          description="写真や動画を閲覧・アップロードする"
          href="/medias"
          color="bg-amber-500"
          icon={<Camera size={20} strokeWidth={1.5} />}
          disabled={!enableAllFeatures}
          disabledText="5月25日から利用可能"
        />
        <MenuCard
          title="マイページ"
          description="自分の情報や投稿を管理する"
          href="/mypage"
          color="bg-violet-500"
          icon={<User size={20} strokeWidth={1.5} />}
          disabled={!enableAllFeatures}
          disabledText="5月25日から利用可能"
        />
        <MenuCard
          title="設定"
          description="アカウントや通知の設定を変更する"
          href="/settings"
          color="bg-emerald-500"
          icon={<Settings size={20} strokeWidth={1.5} />}
        />
      </div>
    </>
  );
}
