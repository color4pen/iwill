import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { paths } from '@/lib/paths';

// 認証が必要なパス
const authRequiredPaths: string[] = [
  paths.info.index, 
  paths.gallery, 
  paths.mypage, 
  paths.notifications.index, 
  paths.qa
];
// ゲスト専用パス（ログイン済みならリダイレクト）
const guestOnlyPaths: string[] = [paths.login];
// 認証不要パス（誰でもアクセス可能）
const publicPaths: string[] = [paths.privacy, paths.terms, paths.invitation, '/api/invitation'];

export async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: 'web-next-auth.session-token'
  });
  
  const isAuthenticated = !!token;
  const path = req.nextUrl.pathname;
  
  // 認証不要パスは常にアクセス可能
  if (publicPaths.some(p => path.startsWith(p))) {
    return NextResponse.next();
  }
  
  // 認証が必要なパスに未認証ユーザーがアクセスした場合
  if (authRequiredPaths.some(p => path.startsWith(p)) && !isAuthenticated) {
    return NextResponse.redirect(new URL(paths.login, req.url));
  }
  
  // ゲスト専用パスに認証済みユーザーがアクセスした場合
  if (guestOnlyPaths.includes(path) && isAuthenticated) {
    // 既存ユーザー（DBにユーザーIDが存在）の場合は常にトップへ
    if (token.id && token.id !== token.lineId) {
      return NextResponse.redirect(new URL(paths.home, req.url));
    }
    
    // 新規ユーザーで招待トークンがある場合は招待ページへ
    const invitationToken = req.nextUrl.searchParams.get('invitation');
    if (invitationToken && token.id) {
      return NextResponse.redirect(new URL(`${paths.invitation}?token=${invitationToken}&lineId=${token.id}`, req.url));
    }
    return NextResponse.redirect(new URL(paths.home, req.url));
  }
  
  // ルートパス(/)へのアクセスで未認証の場合もログインページへ
  if (path === paths.home && !isAuthenticated) {
    return NextResponse.redirect(new URL(paths.login, req.url));
  }
  
  // 認証済みだがデータベースにユーザーIDが存在しない場合
  // （新規ユーザーが招待ページ以外にアクセスしようとした場合）
  if (isAuthenticated && token.id && !path.startsWith(paths.invitation)) {
    // jwtコールバックでデータベースIDが設定されていない場合、
    // LINE IDのままになっているので、これをチェック
    if (token.id && token.id === token.lineId) {
      // 招待ページへリダイレクト
      return NextResponse.redirect(new URL(paths.invitation, req.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // 認証が必要なパス
    '/info/:path*',
    '/gallery/:path*',
    '/mypage/:path*',
    '/settings/:path*',
    '/notifications/:path*',
    '/qa/:path*',
    // ゲスト専用パス
    '/login',
    // 認証不要パス
    '/privacy/:path*',
    '/terms/:path*',
    '/invitation/:path*',
    // ルートパス
    '/'
  ],
};