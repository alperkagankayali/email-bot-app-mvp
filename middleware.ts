import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { handleAuthControl } from "./middlewares/auth";
import { routing } from "./i18n/routing";
const cache = new Map();

const i18nMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const [, locale, ...segments] = req.nextUrl.pathname.split("/");

  const currentUser = req.cookies.get("currentUser")?.value;

  if (pathname.startsWith("/api")) {
    return handleAPIMiddleware(req);
  } else if (!currentUser && !req.nextUrl.pathname.startsWith("/")) {
    return Response.redirect(new URL(`/`, req.url));
  } else if (currentUser && segments.join("/") === "") {
    return NextResponse.redirect(
      new URL(`/${locale === "" ? "en" : locale}/dashboard`, req.url)
    );
  }
  return i18nMiddleware(req);
}

async function handleAPIMiddleware(req: NextRequest) {
  const user = await handleAuthControl(req);
  // const apiKey = req.headers.get('x-api-key'); // API anahtarı kontrolü
  // if (!user) {
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  // }
  // Eğer yetkilendirme başarılıysa isteğe devam et
  return NextResponse.next();
}

// Middleware için matcher
export const config = {
  matcher: ["/", "/(de|en|tr)/:path*", "/api/:path*"], // Hem i18n rotaları hem de API için matcher
};
