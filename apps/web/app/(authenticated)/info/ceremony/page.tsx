"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clock, Sparkles, Camera, Flower, CloudRain, Users, FileText, ArrowLeft } from "lucide-react";

export default function CeremonyPage() {
  const router = useRouter();
  const ceremonyFlow = [
    {
      time: "14:15",
      title: "挙式開始",
      description: "ガーデンチャペルZONAにて人前式を執り行います",
      persons: [],
      icon: Sparkles,
    },
    {
      time: "14:20",
      title: "新郎新婦入場",
      description: "",
      persons: [],
      icon: Users,
    },
    {
      time: "14:25",
      title: "約束の言葉",
      description: "",
      persons: ["新郎友人", "新婦友人", "新郎母", "新婦母"],
      icon: FileText,
    },
    {
      time: "14:30",
      title: "指輪交換",
      description: "",
      persons: [],
      icon: Sparkles,
    },
    {
      time: "14:35",
      title: "結婚成立宣言",
      description: "皆様の立会いのもと、結婚が成立します",
      persons: [],
      icon: Sparkles,
    },
    {
      time: "14:45",
      title: "アフターセレモニー",
      description: "チャペルを出る新郎新婦を祝福してください",
      persons: [],
      icon: Flower,
    },
  ];

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
          alt="挙式会場"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">挙式の進行</h1>
          <p className="text-lg">Ceremony Program</p>
        </div>
      </div>

      {/* 人前式について */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">人前式について</h2>
        <p className="text-gray-700 mb-4">
          人前式は、宗教にとらわれず、ご参列の皆様を証人として結婚を誓う挙式スタイルです。
          皆様の温かい見守りの中で、おふたりが結婚の約束を交わします。
        </p>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>会場：</strong>ガーデンチャペルZONA<br />
            <strong>時間：</strong>14:15～14:55（約40分）
          </p>
        </div>
      </div>

      {/* 挙式の流れ */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Clock className="w-6 h-6 mr-2 text-blue-600" />
          挙式の流れ
        </h2>
        <div className="space-y-6">
          {ceremonyFlow.map((item, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 w-20 text-right mr-4">
                <span className="text-lg font-semibold text-gray-800">{item.time}</span>
              </div>
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <item.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                {item.description && (
                  <p className="text-gray-600">{item.description}</p>
                )}
                {item.persons && item.persons.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {item.persons.map((person, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <span className="text-blue-600 mr-1">▸</span>
                        <span className="text-gray-600">{person}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 写真撮影について */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Camera className="w-6 h-6 mr-2 text-blue-600" />
          写真撮影について
        </h2>
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-green-800">
              <strong>挙式中：</strong>挙式中の撮影はご遠慮ください。プロのカメラマンが撮影いたします。
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-blue-800">
              <strong>アフターセレモニー：</strong>自由に撮影いただけます。新郎新婦の幸せな瞬間をぜひ写真に収めてください。
            </p>
          </div>
          <p className="text-sm text-gray-600">
            撮影した写真は、後日「ギャラリー」機能からシェアいただけます。
          </p>
        </div>
      </div>

    </div>
  );
}