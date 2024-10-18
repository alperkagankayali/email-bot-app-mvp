import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const i18nMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. API isteklerini kontrol ediyoruz
  if (pathname.startsWith('/api')) {
    // API istekleri için özel bir middleware işlemi uygulayacağız
    return handleAPIMiddleware(req);
  }

  // 2. i18n middleware'i çalıştırıyoruz (API dışındaki tüm istekler için)
  return i18nMiddleware(req);
}

// API middleware fonksiyonu
async function handleAPIMiddleware(req: NextRequest) {
  
  // const apiKey = req.headers.get('x-api-key'); // API anahtarı kontrolü
  // if (!apiKey || apiKey !== 'expected-api-key') {
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  // }

  // Eğer yetkilendirme başarılıysa isteğe devam et
  return NextResponse.next();
}

// Middleware için matcher
export const config = {
  matcher: ['/', '/(de|en|tr)/:path*', '/api/:path*'], // Hem i18n rotaları hem de API için matcher
};