import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getLanguage } from "./services/service/generalService";
import { handleAuthControl } from "./middlewares/auth";
const cache = new Map();

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const [, locale, ...segments] = req.nextUrl.pathname.split("/");
  console.log("locale", locale, segments.join("/"));

  const currentUser = req.cookies.get("currentUser")?.value;
  let defaultLocale = req.headers.get("accept-language") || "en";
  defaultLocale = defaultLocale.includes("*") ? "en" : defaultLocale;
  const languageCookie = cache.get("locales");

  if (
    languageCookie === null ||
    languageCookie === undefined ||
    (segments.join("/") === "language/update" && locale === "api")
  ) {
    const resLanguage = await getLanguage();
    const locales: string[] = [];
    if (!!resLanguage?.data) {
      resLanguage.data?.forEach((element: any) => {
        locales.push(element.code);
      });
      cache.set("locales", locales);
    }
  }

  if (pathname.startsWith("/api")) {
    return handleAPIMiddleware(req);
  } else if (!currentUser && !req.nextUrl.pathname.startsWith("/")) {
    return Response.redirect(new URL(`/`, req.url));
  } else if (currentUser && segments.join("/") === "") {
    return NextResponse.redirect(
      new URL(`/${locale === "" ? "en" : locale}/dashboard`, req.url)
    );
  }
  const handleI18nRouting = createMiddleware({
    locales: !!languageCookie ? languageCookie : ["en", "de", "tr"],
    defaultLocale,
  });
  const response = handleI18nRouting(req);

  return response;
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
