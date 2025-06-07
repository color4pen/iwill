"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Bell, Users, Camera, HelpCircle, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

interface AdminLayoutProps {
  children: React.ReactNode
  user?: {
    name?: string | null
    email?: string | null
  }
}

const navigation = [
  { name: "ダッシュボード", href: "/", icon: Home },
  { name: "お知らせ管理", href: "/notifications", icon: Bell },
  { name: "ユーザー管理", href: "/users", icon: Users },
  { name: "招待URL管理", href: "/invitations", icon: Users },
  { name: "ゲスト管理", href: "/guests", icon: Users },
  { name: "メディア管理", href: "/media", icon: Camera },
  { name: "FAQ管理", href: "/faq", icon: HelpCircle },
]

export default function AdminLayout({ children, user }: AdminLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* モバイル用サイドバー */}
      <div className={`fixed inset-0 z-40 flex md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-gray-800 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-white">iwill Admin</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex bg-gray-700 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-base font-medium text-white">
                    {user?.name || user?.email || 'Admin'}
                  </p>
                  <form action="/api/auth/signout" method="POST" className="mt-2">
                    <button
                      type="submit"
                      className="flex items-center text-sm font-medium text-gray-400 hover:text-white"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      ログアウト
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* デスクトップ用サイドバー */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-white">iwill Admin</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex bg-gray-700 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <p className="text-sm font-medium text-white">
                    {user?.name || user?.email || 'Admin'}
                  </p>
                  <form action="/api/auth/signout" method="POST" className="mt-2">
                    <button
                      type="submit"
                      className="flex items-center text-xs font-medium text-gray-400 hover:text-white"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      ログアウト
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}