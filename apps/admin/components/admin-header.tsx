"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Bell, LogOut } from "lucide-react"

interface AdminHeaderProps {
  user?: {
    name?: string | null
    email?: string | null
  }
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname()

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              iwill Admin
            </Link>
            <nav className="flex space-x-4">
              <Link
                href="/"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  pathname === "/" 
                    ? "bg-gray-900 text-white" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                ホーム
              </Link>
              <Link
                href="/notifications"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  pathname.startsWith("/notifications")
                    ? "bg-gray-900 text-white" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Bell className="h-4 w-4 mr-2" />
                お知らせ管理
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              {user?.name || user?.email}
            </span>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                ログアウト
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}