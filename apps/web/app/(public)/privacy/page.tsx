import Link from "next/link";

export const metadata = {
  title: "プライバシーポリシー - iWill",
  description: "iWillのプライバシーポリシーについて",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">プライバシーポリシー</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="mb-6">
            本プライバシーポリシーは、iWill（以下「当サービス」）が収集する情報と、その情報の使用方法について説明するものです。
            当サービスをご利用いただくことで、本プライバシーポリシーに同意したものとみなされます。
          </p>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">1. 収集する情報</h2>
            <p className="mb-3">当サービスでは、以下の情報を収集することがあります：</p>
            <ul className="list-disc pl-6 mb-3 space-y-2">
              <li>LINE認証を通じて提供される情報（氏名、プロフィール画像、メールアドレスなど）</li>
              <li>アップロードされた写真や動画などのコンテンツ</li>
              <li>当サービスの利用状況に関する情報</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">2. 情報の利用目的</h2>
            <p className="mb-3">収集した情報は以下の目的で使用されます：</p>
            <ul className="list-disc pl-6 mb-3 space-y-2">
              <li>当サービスの提供・維持・改善</li>
              <li>ユーザー認証と本人確認</li>
              <li>ユーザー間でのコンテンツ共有の実現</li>
              <li>イベント情報や重要なお知らせの配信</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">3. 情報の共有と開示</h2>
            <p className="mb-3">当サービスは、以下の場合を除き、収集した情報を第三者と共有することはありません：</p>
            <ul className="list-disc pl-6 mb-3 space-y-2">
              <li>ユーザーの同意がある場合</li>
              <li>法的要請に応じる必要がある場合</li>
              <li>サービス提供に必要な範囲内での業務委託先との共有</li>
              <li>当サービス内でのユーザー間コンテンツ共有（アップロードした写真や動画など）</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">4. セキュリティ</h2>
            <p>
              当サービスは、収集した情報の安全性を保つために、適切な物理的・技術的・管理的措置を講じています。
              ただし、インターネット上のデータ送信やストレージのセキュリティを100%保証することはできません。
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">5. データの保持期間</h2>
            <p>
              当サービスは、目的の達成に必要な期間、またはサービス提供に必要な期間、収集した情報を保持します。
              具体的には、結婚式の日から1年間のサービス提供期間中、およびその後のデータ移行期間中に保持されます。
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">6. ユーザーの権利</h2>
            <p className="mb-3">ユーザーには以下の権利があります：</p>
            <ul className="list-disc pl-6 mb-3 space-y-2">
              <li>自身の情報へのアクセス</li>
              <li>誤った情報の訂正</li>
              <li>アップロードしたコンテンツの削除</li>
              <li>当サービスからの退会（アカウント削除）</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">7. Cookie（クッキー）の使用</h2>
            <p>
              当サービスでは、ユーザー体験の向上やセッション管理のために、Cookie（クッキー）を使用することがあります。
              ほとんどのブラウザでCookieを無効にすることが可能ですが、一部の機能が正常に動作しなくなる可能性があります。
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">8. プライバシーポリシーの変更</h2>
            <p>
              当サービスは、必要に応じて本プライバシーポリシーを変更することがあります。
              重要な変更がある場合は、サービス内のお知らせやメールなどの適切な手段でユーザーに通知します。
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">9. お問い合わせ</h2>
            <p>
              本プライバシーポリシーに関するご質問やご意見がある場合は、お問い合わせフォームよりご連絡ください。
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