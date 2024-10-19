import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getLanguage } from "./services/service/generalService";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const currentUser = req.cookies.get("currentUser")?.value;
  let defaultLocale = req.headers.get("accept-language") || "en";
  defaultLocale = defaultLocale.includes("*") ? "en" : defaultLocale;
  const resLanguage = await getLanguage();
  const locales: string[] = [];
  
  if (!!resLanguage.data) {
    resLanguage.data?.forEach((element: any) => {
      locales.push(element.code);
    });
  }

  if (pathname.startsWith("/api")) {
    return handleAPIMiddleware(req);
  } 
  
  else if (!currentUser && !req.nextUrl.pathname.startsWith("/")) {
    return Response.redirect(new URL(`/`, req.url));
  }
  const handleI18nRouting = createMiddleware({
    locales: locales.length > 0 ? locales : ["en", "de", "tr"],
    defaultLocale,
  });
  const response = handleI18nRouting(req);

  return response;
}

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
  matcher: ["/", "/(de|en|tr)/:path*", "/api/:path*"], // Hem i18n rotaları hem de API için matcher
};
