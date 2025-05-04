import Protected from "../components/protected";
import Link from "next/link";
import Image from "next/image";

export default function InfoPage() {
  // 実際のアプリケーションではデータベースやAPIからデータを取得します
  const weddingInfo = {
    date: "2025年5月25日（土）",
    time: "挙式: 13:00 / 披露宴: 14:00",
    venue: "ホテルアイウィル東京",
    address: "東京都港区南青山1-2-3",
    access: "東京メトロ銀座線「表参道駅」A4出口より徒歩5分",
    dresscode: "セミフォーマル（男性: スーツ / 女性: ワンピースなど）",
    contact: "090-1234-5678（結婚式当日）",
    mapUrl: "https://maps.google.com/?q=東京都港区南青山1-2-3",
    schedule: [
      { time: "12:30", event: "受付開始" },
      { time: "13:00", event: "挙式開始" },
      { time: "14:00", event: "披露宴開始" },
      { time: "14:15", event: "乾杯" },
      { time: "14:30", event: "食事開始" },
      { time: "15:30", event: "余興" },
      { time: "16:30", event: "ケーキカット" },
      { time: "17:00", event: "各テーブル記念撮影" },
      { time: "17:30", event: "お開き" },
    ]
  };

  return (
    <Protected>
      <>
        <h2 className="text-3xl font-bold mb-8 text-center">結婚式情報</h2>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-full max-w-2xl h-64 relative rounded-lg overflow-hidden">
                <Image
                  src="https://via.placeholder.com/800x400?text=Wedding+Venue"
                  alt="会場イメージ"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">基本情報</h3>
                <dl className="space-y-2">
                  <div className="flex flex-col sm:flex-row">
                    <dt className="font-medium w-32">日程:</dt>
                    <dd>{weddingInfo.date}</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <dt className="font-medium w-32">時間:</dt>
                    <dd>{weddingInfo.time}</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <dt className="font-medium w-32">会場:</dt>
                    <dd>{weddingInfo.venue}</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <dt className="font-medium w-32">住所:</dt>
                    <dd>{weddingInfo.address}</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <dt className="font-medium w-32">アクセス:</dt>
                    <dd>{weddingInfo.access}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">参加情報</h3>
                <dl className="space-y-2">
                  <div className="flex flex-col sm:flex-row">
                    <dt className="font-medium w-32">ドレスコード:</dt>
                    <dd>{weddingInfo.dresscode}</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <dt className="font-medium w-32">当日連絡先:</dt>
                    <dd>{weddingInfo.contact}</dd>
                  </div>
                </dl>
                <div className="mt-4">
                  <a
                    href={weddingInfo.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Googleマップで見る
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">当日のスケジュール</h3>
            <ul className="space-y-2">
              {weddingInfo.schedule.map((item, index) => (
                <li key={index} className="flex border-b border-gray-100 pb-2 last:border-0">
                  <span className="font-medium w-24">{item.time}</span>
                  <span>{item.event}</span>
                </li>
              ))}
            </ul>
          </div>
      </>
    </Protected>
  );
}