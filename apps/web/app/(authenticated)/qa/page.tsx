"use client";

import { useState } from "react";

// よくある質問のデータ型
interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export default function QaPage() {
  // アクティブな質問のID
  const [activeId, setActiveId] = useState<number | null>(null);

  // カテゴリ選択
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // FAQ データ
  const faqItems: FaqItem[] = [
    {
      id: 1,
      question: "結婚式の服装について教えてください",
      answer: "男性はスーツまたはフォーマルウェア、女性はワンピースやドレスなど、華美になりすぎない服装がおすすめです。白や黒などの花嫁・喪服を連想させる色は避けていただくとよいでしょう。",
      category: "general",
    },
    {
      id: 2,
      question: "受付の時間は何時からですか？",
      answer: "受付は結婚式の開始30分前から開始しております。余裕を持ってお越しください。",
      category: "venue",
    },
    {
      id: 3,
      question: "子供を連れていくことはできますか？",
      answer: "お子様連れの参加も歓迎しております。ただし、式中はお子様の様子によっては一時的に退席いただける場合もございます。お子様用の料理や席のご用意がありますので、出席情報入力の際に人数をお知らせください。",
      category: "general",
    },
    {
      id: 4,
      question: "ご祝儀の金額の相場はいくらですか？",
      answer: "一般的には、ご親族の場合は3万円〜5万円、友人・同僚の場合は2万円〜3万円が相場とされています。ただし、金額よりもお気持ちを大切にしていただければ幸いです。",
      category: "gift",
    },
    {
      id: 5,
      question: "会場までの交通手段について教えてください",
      answer: "会場へは電車または車でお越しいただけます。最寄り駅からは送迎バスも運行予定です。詳細は「会場案内」ページをご確認ください。",
      category: "venue",
    },
    {
      id: 6,
      question: "出席できるか未定なのですが、どうすればよいですか？",
      answer: "まずは「出席情報」ページで「未定」を選択してください。決まり次第、同ページで情報を更新いただければ幸いです。お返事の期限は結婚式の1ヶ月前となっております。",
      category: "attendance",
    },
    {
      id: 7,
      question: "アレルギーがある場合はどうすればよいですか？",
      answer: "「出席情報」ページの「食事の制限・アレルギー」欄に詳細をご記入ください。可能な限り対応させていただきます。",
      category: "attendance",
    },
    {
      id: 8,
      question: "写真や動画の撮影は可能ですか？",
      answer: "挙式中の撮影はご遠慮いただいておりますが、披露宴では撮影いただけます。撮影した写真や動画は「メディア」ページからアップロードいただけると嬉しいです。",
      category: "general",
    },
    {
      id: 9,
      question: "メディアのアップロード方法を教えてください",
      answer: "「メディア」ページの「新規アップロード」ボタンから、写真や動画をアップロードできます。キャプションをつけて思い出をシェアしましょう。",
      category: "media",
    },
    {
      id: 10,
      question: "結婚式の二次会はありますか？",
      answer: "結婚式後に二次会も予定しております。二次会のみの参加も可能です。詳細は「会場案内」ページをご確認ください。",
      category: "venue",
    },
  ];

  // カテゴリでフィルタリング
  const filteredFaqs = selectedCategory === "all" 
    ? faqItems 
    : faqItems.filter(item => item.category === selectedCategory);

  // カテゴリリスト
  const categories = [
    { id: "all", name: "すべて" },
    { id: "general", name: "一般" },
    { id: "venue", name: "会場・受付" },
    { id: "gift", name: "ご祝儀・ギフト" },
    { id: "attendance", name: "出席情報" },
    { id: "media", name: "メディア" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">よくある質問</h1>
        <p className="text-gray-600">
          結婚式やウェブサイトについてのよくある質問をまとめました。
          お探しの回答がない場合は、お問い合わせフォームからご連絡ください。
        </p>
      </div>

      {/* カテゴリ選択 */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ リスト */}
      <div className="space-y-4">
        {filteredFaqs.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setActiveId(activeId === item.id ? null : item.id)}
              className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">{item.question}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  activeId === item.id ? "transform rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              className={`transition-all overflow-hidden ${
                activeId === item.id
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-4 pt-0 bg-gray-50 text-gray-700">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 問い合わせリンク */}
      <div className="mt-12 text-center p-6 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          お探しの質問が見つかりませんか？
        </h2>
        <p className="text-gray-600 mb-4">
          お問い合わせフォームから直接ご質問いただけます。
        </p>
        <a
          href="/contact"
          className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          お問い合わせ
        </a>
      </div>
    </div>
  );
}