"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clock, Utensils, Music, Sparkles, CloudRain, Users, Cake, Mail, Film, ArrowLeft } from "lucide-react";

interface ReceptionClientProps {
  isAdmin: boolean;
}

export default function ReceptionClient({ isAdmin }: ReceptionClientProps) {
  const router = useRouter();
  
  const receptionFlow = [
    {
      time: "15:00",
      title: "開場",
      description: "ウェルカムドリンクをお楽しみください",
      icon: Users,
      condition: true,
    },
    {
      time: "15:30",
      title: "新郎新婦入場",
      description: "新郎新婦が入場します",
      icon: Sparkles,
      condition: true,
    },
    {
      time: "15:45",
      title: "乾杯",
      description: "乾杯のご発声",
      icon: Utensils,
      condition: true,
    },
    {
      time: "16:00",
      title: "ケーキカット",
      description: "ウェディングケーキ入刀",
      icon: Cake,
      condition: isAdmin,
    },
    {
      time: "16:30",
      title: "歓談・お食事",
      description: "ゆっくりとお楽しみください",
      icon: Utensils,
      condition: isAdmin,
    },
    {
      time: "17:00",
      title: "余興",
      description: "特別な余興をお楽しみください",
      icon: Music,
      condition: isAdmin,
    },
    {
      time: "17:30",
      title: "感謝のセレモニー",
      description: "新郎新婦から感謝の気持ちをお伝えします",
      icon: Mail,
      condition: isAdmin,
    },
    {
      time: "17:45",
      title: "エンドロール・ご挨拶",
      description: "エンドロール上映とご挨拶",
      icon: Film,
      condition: isAdmin,
    },
    {
      time: "18:00",
      title: "おひらき",
      description: "お見送り",
      icon: Users,
      condition: true,
    },
  ].filter(item => item.condition);

  return (
    <div className="min-h-screen">
      {/* 戻るボタン */}
      <div className="mb-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          戻る
        </button>
      </div>

      <div className="relative h-64 overflow-hidden rounded-lg mb-8">
        <Image
          src="/info.jpg"
          alt="披露宴会場"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">披露宴の進行</h1>
          <p className="text-lg">Reception Program</p>
        </div>
      </div>

      {/* 披露宴について */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">披露宴について</h2>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>会場：</strong>アルフレスコ（ピーマン通り）ガーデン<br />
            <strong>時間：</strong>15:30～18:00（2時間30分）
          </p>
        </div>
      </div>

      {/* 披露宴の流れ */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Clock className="w-6 h-6 mr-2 text-blue-600" />
          披露宴の流れ
        </h2>
        <div className="space-y-6">
          {receptionFlow.map((item, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 w-20 text-right mr-4">
                <span className="text-lg font-semibold text-gray-800">{item.time}</span>
              </div>
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <item.icon className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* お料理について */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Utensils className="w-6 h-6 mr-2 text-blue-600" />
          お料理のご案内
        </h2>
        <p className="text-gray-700 mb-4">
          シェフ特製のお料理をご用意しております。
          当日のお楽しみとさせていただきます。
        </p>
        <p className="text-sm text-gray-600 mt-4">
          ※アレルギーや食事制限がある方は、事前にお知らせください
        </p>
      </div>
    </div>
  );
}