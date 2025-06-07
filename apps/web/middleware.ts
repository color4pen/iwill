import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// 認証が必要なパス
const authRequiredPaths: string[] = ['/info', '/gallery', '/mypage', '/settings', '/notifications', '/qa'];
// ゲスト専用パス（ログイン済みならリダイレクト）
const guestOnlyPaths: string[] = ['/login'];
// 認証不要パス（誰でもアクセス可能）
const publicPaths: string[] = ['/privacy', '/terms', '/invitation', '/api/invitation'];

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
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // ゲスト専用パスに認証済みユーザーがアクセスした場合
  if (guestOnlyPaths.includes(path) && isAuthenticated) {
    // 招待トークンがある場合は招待ページへ
    const invitationToken = req.nextUrl.searchParams.get('invitation');
    if (invitationToken && token.id) {
      return NextResponse.redirect(new URL(`/invitation?token=${invitationToken}&lineId=${token.id}`, req.url));
    }
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  // ルートパス(/)へのアクセスで未認証の場合もログインページへ
  if (path === '/' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // 認証済みでユーザーがDBに存在するかチェック
  if (isAuthenticated && token.id && (path === '/' || authRequiredPaths.some(p => path.startsWith(p)))) {
    try {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      
      const user = await prisma.user.findUnique({
        where: { id: token.id as string },
      });
      
      await prisma.$disconnect();
      
      // ユーザーが存在しない場合
      if (!user) {
        // 招待処理中の可能性があるため、一旦スルー
        const invitationToken = req.nextUrl.searchParams.get('token');
        if (!invitationToken) {
          return NextResponse.redirect(new URL('/login?error=invitation_required', req.url));
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
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