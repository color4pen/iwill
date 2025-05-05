"use client";

// サンプルのメディアデータ - 20個用意
const sampleMedias = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  type: "image",
  url: `https://via.placeholder.com/400x300?text=Photo+${i + 1}`,
  caption: `写真 ${i + 1}`,
  author: "ゲスト",
  uploadedAt: `2025-05-25T${14 + (i % 10)}:${30 + (i % 30)}:00`,
}));

export default function GalleryPage() {
  // メディア表示のみで、アップロード機能はLINEで実装

  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">ギャラリー</h2>

      {/* メディアギャラリー */}
      <div className="bg-white">
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-1">
          {sampleMedias.map((media, index) => {
            // Masonryレイアウト用に高さをランダムに
            const heights = [150, 180, 220, 250, 280];
            const height = heights[index % heights.length];
            
            return (
              <div 
                key={media.id} 
                className="w-full bg-gray-200 break-inside-avoid mb-1"
                style={{ height: `${height}px`, marginBottom: '4px' }}
              ></div>
            );
          })}
        </div>
      </div>
    </>
  );
}