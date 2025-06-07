import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: 'admin-next-auth.session-token'
  })
  
  const isAuthenticated = !!token
  const path = req.nextUrl.pathname
  
  // ログインページに認証済みユーザーがアクセスした場合
  if (path === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  
  // 認証が必要なページに未認証ユーザーがアクセスした場合
  if (!path.startsWith('/login') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ],
}