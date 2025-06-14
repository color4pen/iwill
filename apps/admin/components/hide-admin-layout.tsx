"use client"

import { useEffect } from "react"

export default function HideAdminLayout() {
  useEffect(() => {
    // 管理画面のレイアウト要素を非表示にする
    const hideElements = () => {
      // AdminLayoutのヘッダー部分を非表示
      const header = document.querySelector('.bg-white.shadow-sm.border-b.px-4')
      const sidebar = document.querySelector('.md\\:pl-64')
      const mobileMenuButton = document.querySelector('.sticky.top-0.z-10.md\\:hidden')
      
      // モバイルメニューボタンを非表示
      if (mobileMenuButton) {
        mobileMenuButton.style.setProperty('display', 'none', 'important')
      }
      
      // サイドバーのパディングを削除
      if (sidebar) {
        sidebar.style.setProperty('padding-left', '0', 'important')
      }
    }

    // 即座に実行
    hideElements()
    
    // DOMの変更を監視
    const observer = new MutationObserver(hideElements)
    observer.observe(document.body, { childList: true, subtree: true })
    
    return () => {
      observer.disconnect()
      const sidebar = document.querySelector('.md\\:pl-64')
      const mobileMenuButton = document.querySelector('.sticky.top-0.z-10.md\\:hidden')
      
      if (mobileMenuButton) {
        mobileMenuButton.style.removeProperty('display')
      }
      if (sidebar) {
        sidebar.style.removeProperty('padding-left')
      }
    }
  }, [])
  
  return null
}