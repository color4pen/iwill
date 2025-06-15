"use client"

import { useEffect } from "react"

export default function HideLayout() {
  useEffect(() => {
    // より確実にヘッダーとフッターを非表示にする
    const hideElements = () => {
      const header = document.querySelector('header')
      const footer = document.querySelector('footer')
      const main = document.querySelector('main')
      
      if (header) {
        header.style.setProperty('display', 'none', 'important')
      }
      if (footer) {
        footer.style.setProperty('display', 'none', 'important')
      }
      if (main) {
        main.style.setProperty('padding', '0', 'important')
        main.style.setProperty('max-width', 'none', 'important')
        main.style.setProperty('flex', '1', 'important')
        main.style.setProperty('display', 'flex', 'important')
        main.style.setProperty('flex-direction', 'column', 'important')
        main.style.setProperty('height', '100vh', 'important')
        main.style.setProperty('height', '100dvh', 'important')
      }
    }

    // 即座に実行
    hideElements()
    
    // DOMの変更を監視して確実に非表示を維持
    const observer = new MutationObserver(hideElements)
    observer.observe(document.body, { childList: true, subtree: true })
    
    return () => {
      observer.disconnect()
      const header = document.querySelector('header')
      const footer = document.querySelector('footer')
      const main = document.querySelector('main')
      
      if (header) {
        header.style.removeProperty('display')
      }
      if (footer) {
        footer.style.removeProperty('display')
      }
      if (main) {
        main.style.removeProperty('padding')
        main.style.removeProperty('max-width')
        main.style.removeProperty('flex')
        main.style.removeProperty('display')
        main.style.removeProperty('flex-direction')
        main.style.removeProperty('height')
      }
    }
  }, [])
  
  return null
}