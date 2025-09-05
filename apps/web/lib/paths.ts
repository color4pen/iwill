// lib/paths.ts
// webアプリケーション内のすべてのパスを一元管理

export const paths = {
  // ルート
  home: '/',
  
  // 公開ページ（認証不要）
  login: '/login',
  terms: '/terms',
  privacy: '/privacy',
  invitation: '/invitation',
  
  // 認証が必要なページ
  mypage: '/mypage',
  gallery: '/gallery',
  upload: '/upload',
  
  // 結婚式情報
  info: {
    index: '/info',
    ceremony: '/info/ceremony',
    reception: '/info/reception',
  },
  access: '/access',
  
  // コミュニケーション
  notifications: {
    index: '/notifications',
    detail: (id: string) => `/notifications/${id}`,
  },
  qa: '/qa',
  contact: {
    index: '/contact',
    new: '/contact/new',
    detail: (id: string) => `/contact/${id}`,
  },
} as const;

// 外部リンク
export const externalLinks = {
  venue: {
    official: 'https://risonare.com/yatsugatake/',
    map: 'https://maps.google.com/?q=星野リゾート+リゾナーレ八ヶ岳',
  },
} as const;