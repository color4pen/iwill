import { Calendar, Camera, User, Bell, HelpCircle, MapPin, MessageSquare } from "lucide-react";
import { shouldEnableRestrictedFeatures } from "../utils/environment";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { MenuCard } from "../../components/menu-card";
import { authOptions } from "@/lib/auth";
import { getUnreadInquiryCount } from "@/lib/get-unread-count";
import { paths } from "@/lib/paths";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const enableAllFeatures = shouldEnableRestrictedFeatures();

  if (!session?.user) {
    redirect(paths.login);
  }

  const unreadCount = await getUnreadInquiryCount(session.user.id);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4 sm:gap-6 my-2 md:px-5">
        <MenuCard
          title="式情報"
          description="結婚式の詳細情報を確認する"
          href={paths.info.index}
          color="bg-rose-500"
          icon={<Calendar size={24} strokeWidth={1.5} />}
        />
        <MenuCard
          title="アクセス"
          description="会場までの詳しいアクセス方法"
          href={paths.access}
          color="bg-cyan-500"
          icon={<MapPin size={24} strokeWidth={1.5} />}
        />
        <MenuCard
          title="お知らせ"
          description="重要なお知らせや最新情報を確認する"
          href={paths.notifications.index}
          color="bg-blue-500"
          icon={<Bell size={24} strokeWidth={1.5} />}
        />
        <MenuCard
          title="よくある質問"
          description="結婚式に関するよくある質問と回答"
          href={paths.qa}
          color="bg-emerald-500"
          icon={<HelpCircle size={24} strokeWidth={1.5} />}
        />
        <MenuCard
          title="ギャラリー"
          description="写真や動画を閲覧・アップロードする"
          href={paths.gallery}
          color="bg-amber-500"
          icon={<Camera size={24} strokeWidth={1.5} />}
          disabled={!enableAllFeatures}
          disabledText="9月7日から利用可能"
        />
        <MenuCard
          title="マイページ"
          description="自分の情報や投稿を管理する"
          href={paths.mypage}
          color="bg-violet-500"
          icon={<User size={24} strokeWidth={1.5} />}
          disabled={!enableAllFeatures}
          disabledText="9月7日から利用可能"
        />
        <MenuCard
          title="お問い合わせ"
          description="ご質問やご相談はこちらから"
          href={paths.contact.index}
          color="bg-indigo-500"
          icon={<MessageSquare size={24} strokeWidth={1.5} />}
          badge={unreadCount > 0 ? unreadCount : undefined}
        />
      </div>
    </>
  );
}
