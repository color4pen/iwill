// 結婚式情報ページの型定義

export interface WeddingInfo {
  id: string
  // 基本情報
  date: Date
  startTime: string
  endTime: string
  
  // 会場情報
  venue: {
    name: string
    postalCode: string
    address: string
    phoneNumber?: string
    websiteUrl?: string
    mapUrl?: string
    accessInfo?: string
  }
  
  // 新郎新婦情報
  groom: {
    name: string
    phoneNumber?: string
    email?: string
  }
  bride: {
    name: string
    phoneNumber?: string
    email?: string
  }
  
  // ドレスコード
  dressCode?: {
    title: string
    description?: string
    menGuideline?: string
    womenGuideline?: string
  }
  
  // 撮影ポリシー
  photographyPolicy?: {
    ceremonyAllowed: boolean
    receptionAllowed: boolean
    guidelines?: string[]
  }
  
  // その他の情報
  parkingInfo?: string
  giftInfo?: string
  specialNotes?: string
  
  createdAt: Date
  updatedAt: Date
}

export interface Schedule {
  id: string
  time: string
  title: string
  description?: string
  location?: string
  icon?: string
  color?: string
  order: number
}

// ページセクションの構造
export interface InfoPageSection {
  id: string
  type: 'hero' | 'basic-info' | 'schedule' | 'guidelines' | 'contact' | 'custom'
  title?: string
  content?: any
  order: number
  isVisible: boolean
}

// ガイドライン項目
export interface GuidelineItem {
  id: string
  category: 'dress' | 'photo' | 'gift' | 'transport' | 'other'
  title: string
  description: string
  icon?: string
  details?: string[]
}