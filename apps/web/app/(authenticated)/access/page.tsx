import { MapPin, Train, Car, Bus, Navigation, Shirt, CloudRain } from "lucide-react";
import Link from "next/link";
import { paths } from "@/lib/paths";

export default function AccessPage() {
  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">会場アクセス</h1>
        <p className="text-gray-600">星野リゾート リゾナーレ八ヶ岳への交通案内</p>
      </div>

      {/* 会場基本情報 */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <MapPin className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold">会場所在地</h2>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-gray-700 mb-1 font-medium">星野リゾート リゾナーレ八ヶ岳</p>
            <p className="text-gray-600 text-sm">〒408-0044</p>
            <p className="text-gray-600 text-sm mb-3">山梨県北杜市小淵沢町129-1</p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                <span className="font-medium">最寄り駅:</span> JR中央本線・小淵沢駅
              </p>
              <p className="text-gray-600">
                <span className="font-medium">最寄りIC:</span> 中央自動車道・小淵沢IC
              </p>
            </div>
            <a 
              href="https://www.google.com/maps/place/星野リゾート+リゾナーレ八ヶ岳"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm mt-3 inline-flex items-center"
            >
              <Navigation className="w-4 h-4 mr-1" />
              Google マップで開く
            </a>
          </div>
          <div className="rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.8673641450363!2d138.32470557508462!3d35.869311071749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601c6a245ede5e8d%3A0x7b95fe2011a55d4!2z44Oq44K-44OK44O844Os5YWr44O25bKz!5e0!3m2!1sja!2sjp!4v1702896543210!5m2!1sja!2sjp"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* 東京からのアクセス */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">🚅 東京からのアクセス</h2>
        
        <div className="space-y-6">
          <div className="border-l-4 border-blue-600 pl-4">
            <div className="flex items-start">
              <Train className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-lg mb-2">
                  🥇 特急あずさ（最推奨）
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <p className="font-medium mb-2">新宿 → 小淵沢（直通）</p>
                  <p className="text-gray-600">所要時間: 約2時間</p>
                  <p className="text-gray-600">料金: ¥5,320（乗車券¥3,410 + 指定席特急券¥1,910）</p>
                  <p className="text-gray-600">運行頻度: 1時間に約1本</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-sm">
                  <p className="font-medium text-blue-900 mb-2">推奨列車（結婚式当日）</p>
                  <div className="space-y-1 text-blue-800">
                    <p>① 新宿 10:00発 → 小淵沢 12:07着</p>
                    <p>② 新宿 11:00発 → 小淵沢 13:07着</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-gray-400 pl-4">
            <div className="flex items-start">
              <Car className="w-6 h-6 text-gray-600 mr-3 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-lg mb-2">車でお越しの方</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 mb-2">ルート: 新宿IC → 中央自動車道 → 小淵沢IC</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-600">距離: 約175km</p>
                    <p className="text-gray-600">所要時間: 2時間10分〜2時間30分</p>
                    <p className="text-gray-600">高速料金: ¥4,900（ETC）</p>
                    <p className="text-gray-600">ガソリン代: 約¥2,000</p>
                  </div>
                  <p className="text-sm text-blue-600 mt-2">※駐車場無料（400台）</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-gray-400 pl-4">
            <div className="flex items-start">
              <Bus className="w-6 h-6 text-gray-600 mr-3 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-lg mb-2">高速バス</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 mb-2">新宿 → 小淵沢</p>
                  <p className="text-gray-600 text-sm">所要時間: 2時間30分〜3時間</p>
                  <p className="text-gray-600 text-sm">料金: ¥3,000</p>
                  <p className="text-gray-600 text-sm">運行: 京王バス・JRバス関東（1日数便）</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 名古屋からのアクセス */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">🚅 名古屋からのアクセス</h2>
        
        <div className="space-y-6">
          <div className="border-l-4 border-blue-600 pl-4">
            <div className="flex items-start">
              <Train className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-lg mb-2">
                  🥇 特急しなの + 特急あずさ（最推奨）
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <p className="font-medium mb-2">名古屋 → 塩尻 → 小淵沢</p>
                  <p className="text-gray-600">所要時間: 約3時間</p>
                  <p className="text-gray-600">料金: ¥6,500〜7,000</p>
                  <p className="text-sm text-blue-600 mt-2">※塩尻での乗り換えは同一ホーム</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-sm">
                  <p className="font-medium text-blue-900 mb-2">推奨列車（結婚式当日）</p>
                  <div className="space-y-1 text-blue-800">
                    <p>① 名古屋 8:00発 → 塩尻 10:55着/11:11発 → 小淵沢 11:52着</p>
                    <p>② 名古屋 10:00発 → 塩尻 12:55着/13:11発 → 小淵沢 13:52着</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-gray-400 pl-4">
            <div className="flex items-start">
              <Car className="w-6 h-6 text-gray-600 mr-3 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-lg mb-2">車でお越しの方</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 mb-2">ルート: 名古屋IC → 小牧JCT → 中央自動車道 → 小淵沢IC</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-600">距離: 約210km</p>
                    <p className="text-gray-600">所要時間: 2時間30分〜3時間</p>
                    <p className="text-gray-600">高速料金: ¥5,260（ETC）</p>
                    <p className="text-gray-600">ガソリン代: 約¥2,500</p>
                  </div>
                  <p className="text-sm text-blue-600 mt-2">※駐車場無料（400台）</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 小淵沢駅・ICからリゾートまで */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">📍 小淵沢駅・ICから会場まで</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-lg mb-3 flex items-center">
              <Train className="w-5 h-5 mr-2" />
              小淵沢駅から
            </h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <span className="text-2xl mr-2">🚌</span>
                <div>
                  <p className="font-medium">無料シャトルバス</p>
                  <p className="text-sm text-gray-600">所要時間: 5分（予約不要）</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-2">🚕</span>
                <div>
                  <p className="font-medium">タクシー</p>
                  <p className="text-sm text-gray-600">所要時間: 約5分・¥700〜1,000</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-medium text-lg mb-3 flex items-center">
              <Car className="w-5 h-5 mr-2" />
              小淵沢ICから
            </h3>
            <div className="space-y-2">
              <p className="text-gray-700">車: 約5分・3km</p>
              <div className="bg-white rounded p-3">
                <p className="font-medium text-green-700">駐車場情報</p>
                <p className="text-sm text-gray-600">収容台数: 400台</p>
                <p className="text-sm text-gray-600">料金: 無料</p>
                <p className="text-sm text-gray-600">予約: 不要</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 9月中旬の服装・気候 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <CloudRain className="w-5 h-5 mr-2" />
          🍂 9月中旬の八ヶ岳
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium mb-2">気候</h4>
            <ul className="space-y-1 text-sm">
              <li className="text-gray-700">標高: 約1,000m（都市部より5℃低い）</li>
              <li className="text-gray-700">昼間: 20〜25℃</li>
              <li className="text-gray-700">朝晩: 15〜18℃</li>
              <li className="text-gray-700">天候: 比較的安定（紅葉前の穴場時期）</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium mb-2 flex items-center">
              <Shirt className="w-4 h-4 mr-1" />
              推奨服装
            </h4>
            <ul className="space-y-1 text-sm">
              <li className="text-gray-700">日中: 長袖シャツ・薄手のニット</li>
              <li className="text-gray-700">朝晩: ジャケット・カーディガン必須</li>
              <li className="text-gray-700">足元: 歩きやすい靴推奨</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 予約・注意事項 */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-2">⚠️ ご予約・ご注意事項</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
          <li>特急券は「えきねっと」で事前予約がお得です（最大35%割引）</li>
          <li>高速バスは1ヶ月前から予約可能です</li>
          <li>9月の連休は混雑するため、早めの予約をおすすめします</li>
          <li>標高が高いため、都市部より5℃程度気温が低くなります</li>
          <li>山道のため、車酔いしやすい方は酔い止めをご準備ください</li>
        </ul>
      </div>

      {/* 戻るリンク */}
      <div className="text-center">
        <Link 
          href={paths.home} 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}