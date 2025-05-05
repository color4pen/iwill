import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// 認証が必要なパス
const authRequiredPaths: string[] = ['/info', '/medias', '/mypage', '/settings', '/notifications'];
// ゲスト専用パス（ログイン済みならリダイレクト）
const guestOnlyPaths: string[] = ['/login'];
// 認証不要パス（誰でもアクセス可能）
const publicPaths: string[] = ['/privacy', '/terms'];

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

  // 認証不要パスは常にアクセス可能
  if (publicPaths.some(p => path.startsWith(p))) {
    return NextResponse.next();
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
    '/notifications/:path*',
    // ゲスト専用パス
    '/login',
    // 認証不要パス
    '/privacy/:path*',
    '/terms/:path*',
    // ルートパス
    '/'
  ],
};