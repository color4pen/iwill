import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// 認証が必要なパス
const authRequiredPaths: string[] = ['/info', '/medias', '/mypage', '/settings'];
// ゲスト専用パス（ログイン済みならリダイレクト）
const guestOnlyPaths: string[] = ['/login'];

export async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const isAuthenticated = !!token;
  const path = req.nextUrl.pathname;
  
  // 認証が必要なパスに未認証ユーザーがアクセスした場合
  if (authRequiredPaths.some(p => path.startsWith(p)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // ゲスト専用パスに認証済みユーザーがアクセスした場合
  if (guestOnlyPaths.includes(path) && isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // ルートパス(/)へのアクセスで未認証の場合もログインページへ
  if (path === '/' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // 認証が必要なパス
    '/info/:path*',
    '/medias/:path*',
    '/mypage/:path*',
    '/settings/:path*',
    // ゲスト専用パス
    '/login',
    // ルートパス
    '/'
  ],
};