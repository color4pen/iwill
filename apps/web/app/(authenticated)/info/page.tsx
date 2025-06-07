import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Clock, Navigation, Users, Utensils, Camera, Music } from "lucide-react";

export default function InfoPage() {
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
              <p className="text-2xl font-bold text-gray-800">2024年9月15日</p>
              <p className="text-lg text-gray-600">日曜日</p>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-gray-700">挙式開始: <span className="font-semibold">15:00</span></p>
              <p className="text-gray-700">披露宴開始: <span className="font-semibold">16:00</span></p>
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
              href="/access" 
              className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center"
            >
              <Navigation className="w-4 h-4 mr-1" />
              アクセス方法を見る
            </Link>
          </div>
        </div>
      </div>

      {/* タイムスケジュール */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Clock className="w-6 h-6 text-blue-600 mr-2" />
          タイムスケジュール
        </h2>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="relative">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-600">14:30</span>
                </div>
              </div>
              <div className="ml-6 pt-3">
                <h3 className="font-semibold text-lg">受付開始</h3>
                <p className="text-gray-600 text-sm">ウェルカムドリンクをご用意しております</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="relative">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-pink-600">15:00</span>
                </div>
              </div>
              <div className="ml-6 pt-3">
                <h3 className="font-semibold text-lg">挙式</h3>
                <p className="text-gray-600 text-sm">チャペルでの挙式となります</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="relative">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-amber-600">16:00</span>
                </div>
              </div>
              <div className="ml-6 pt-3">
                <h3 className="font-semibold text-lg">披露宴開宴</h3>
                <div className="mt-2 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Utensils className="w-4 h-4 mr-2" />
                    <span>お食事・歓談</span>
                  </div>
                  <div className="flex items-center">
                    <Music className="w-4 h-4 mr-2" />
                    <span>余興・スピーチ</span>
                  </div>
                  <div className="flex items-center">
                    <Camera className="w-4 h-4 mr-2" />
                    <span>フォトセッション</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="relative">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-green-600">18:30</span>
                </div>
              </div>
              <div className="ml-6 pt-3">
                <h3 className="font-semibold text-lg">お開き（予定）</h3>
                <p className="text-gray-600 text-sm">プチギフトをお渡しします</p>
              </div>
            </div>
          </div>
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
                <li>※白色の衣装はご遠慮ください</li>
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
                <li>披露宴中は自由に撮影いただけます</li>
                <li>撮影した写真は「ギャラリー」からシェアをお願いします</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* お問い合わせ */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">当日のご連絡先</h3>
        <p className="text-gray-700 mb-2">
          ご不明な点やお困りの際は、下記までご連絡ください
        </p>
        <p className="font-medium text-gray-800">
          📞 090-0000-0000（新郎: 山田太郎）
        </p>
      </div>
    </div>
  );
}