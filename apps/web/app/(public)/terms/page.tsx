import Link from "next/link";

export const metadata = {
  title: "利用規約 - iWill",
  description: "iWillの利用規約について",
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">利用規約</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="mb-6">
            本利用規約（以下「本規約」）は、iWill（以下「当サービス」）の利用条件を定めるものです。
            当サービスをご利用いただくことで、本規約に同意したものとみなされます。
          </p>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">1. サービスの概要</h2>
            <p>
              当サービスは、結婚式に関する情報共有と参加者間のコミュニケーションを目的としたウェブサイトです。
              結婚式の詳細情報の確認、写真や動画の共有、お知らせの受信などの機能を提供します。
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">2. 利用資格</h2>
            <p className="mb-3">
              当サービスは、招待された結婚式の参列者のみが利用できます。
              利用にあたっては、LINE認証によるログインが必要となります。
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">3. 禁止事項</h2>
            <p className="mb-3">当サービスでは、以下の行為を禁止します：</p>
            <ul className="list-disc pl-6 mb-3 space-y-2">
              <li>法令、公序良俗に反する行為</li>
              <li>他のユーザーや第三者の権利を侵害する行為</li>
              <li>不適切な内容のコンテンツ（写真、動画など）のアップロード</li>
              <li>当サービスの運営を妨げる行為</li>
              <li>当サービスの不正利用、ハッキング行為</li>
              <li>認証情報の不正共有</li>
              <li>その他、当サービスが不適切と判断する行為</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">4. 知的財産権</h2>
            <p className="mb-3">
              当サービス内のコンテンツ（テキスト、画像、ロゴなど）に関する知的財産権は、当サービスまたはライセンサーに帰属します。
              これらを無断で複製、改変、配布することは禁止されています。
            </p>
            <p>
              ユーザーがアップロードしたコンテンツの知的財産権はそのユーザーに帰属しますが、
              当サービスはそれらのコンテンツをサービス提供の目的で使用、保存、複製する権利を有します。
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">5. 免責事項</h2>
            <p className="mb-3">当サービスは以下について一切の責任を負いません：</p>
            <ul className="list-disc pl-6 mb-3 space-y-2">
              <li>ユーザーがアップロードしたコンテンツの内容</li>
              <li>ユーザー間のトラブル</li>
              <li>通信環境によるサービス利用の制限や情報の遅延</li>
              <li>不可抗力によるサービス提供の中断や停止</li>
              <li>その他、当サービスの利用によって生じた損害</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">6. サービス提供期間</h2>
            <p>
              当サービスは結婚式の日から1年間の期限付きで提供され、その後は予告なく終了する場合があります。
              サービス終了前に、データのバックアップや移行についてのお知らせを行います。
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">7. 規約の変更</h2>
            <p>
              当サービスは、必要に応じて本規約を変更することがあります。
              重要な変更がある場合は、サービス内のお知らせやメールなどの適切な手段でユーザーに通知します。
              変更後も当サービスを継続して利用する場合、変更後の規約に同意したものとみなされます。
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">8. お問い合わせ</h2>
            <p>
              本規約に関するご質問やご意見がある場合は、お問い合わせフォームよりご連絡ください。
            </p>
          </section>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">最終更新日: 2025年4月1日</p>
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}