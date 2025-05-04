"use client";

import Image, { type ImageProps } from "next/image";
import { MenuCard } from "@repo/ui/menu-card";
import { Calendar, Camera, User, Settings } from "lucide-react";
import { shouldEnableRestrictedFeatures } from "./utils/environment";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  const enableAllFeatures = shouldEnableRestrictedFeatures();

  return (
    <>
      <h2 className="text-3xl font-bold mb-8">Welcome</h2>

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
