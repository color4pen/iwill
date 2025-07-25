import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Clock, Navigation, Users, Utensils, Camera, Music } from "lucide-react";
import TimeSchedule from "@/components/info/TimeSchedule";
import { prisma } from "@/lib/prisma";
import { paths } from "@/lib/paths";

// キャッシュを無効化
export const revalidate = 0;

export default async function InfoPage() {
  const schedules = await prisma.schedule.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="min-h-screen">
      <div className="relative h-64 overflow-hidden rounded-lg mb-8">
        <Image
          src="/info.jpg"
          alt="会場"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">結婚式のご案内</h1>
          <p className="text-lg">Special Day Information</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Calendar className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-semibold">日程</h2>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-2xl font-bold text-gray-800">2025年9月21日</p>
              <p className="text-lg text-gray-600">日曜日</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <MapPin className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-semibold">会場</h2>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-800">星野リゾート リゾナーレ八ヶ岳</p>
            <p className="text-gray-600 text-sm">〒408-0044</p>
            <p className="text-gray-600 text-sm mb-3">山梨県北杜市小淵沢町129-1</p>
            <Link
              href={paths.access}
              className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center"
            >
              <Navigation className="w-4 h-4 mr-1" />
              アクセス方法を見る
            </Link>
          </div>
        </div>
      </div>

      {/* タイムスケジュール */}
      <TimeSchedule scheduleItems={schedules} />

      {/* 進行の詳細 */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">進行の詳細</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href={paths.info.ceremony}
            className="group bg-blue-50 hover:bg-blue-100 rounded-lg p-6 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700">
                  挙式の進行
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  人前式の流れをご案内
                </p>
              </div>
              <div className="text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
          
          <Link
            href={paths.info.reception}
            className="group bg-green-50 hover:bg-green-100 rounded-lg p-6 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-700">
                  披露宴の進行
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  ガーデンパーティーの流れ
                </p>
              </div>
              <div className="text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 参加にあたってのご案内 */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">参加にあたってのご案内</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-lg mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              ドレスコード
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 mb-2">セミフォーマル</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>男性: スーツ・ジャケット着用</li>
                <li>女性: ワンピース・セットアップなど</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-3 flex items-center">
              <Camera className="w-5 h-5 mr-2 text-blue-600" />
              撮影について
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="text-sm text-gray-600 space-y-1">
                <li>挙式中の撮影はご遠慮ください</li>
                <li>その他では自由に撮影いただけます</li>
                <li>撮影した写真は今後追加される「ギャラリー」からシェアをお願いします</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}