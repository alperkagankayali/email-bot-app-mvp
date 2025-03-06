import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: false,
});
const isPublicPage = ["/data-entry", "reset-password"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path.startsWith("/api")) {
    return NextResponse.next();
  } else if (path.includes("/dashboard")) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      const pathSegments = path.split("/");
      const locale =
        pathSegments.length > 1 && ["en", "de", "tr"].includes(pathSegments[1])
          ? pathSegments[1]
          : "en";
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  } else if (!isPublicPage.includes(path)) {
    const pathSegments = path.split("/");
    const token = request.cookies.get("token")?.value;
    const locale =
      pathSegments.length > 1 && ["en", "de", "tr"].includes(pathSegments[1])
        ? pathSegments[1]
        : "en";
    if (!!token) {
      return NextResponse.redirect(
        new URL(
          `${path === "/" ? "/tr/dashboard" : "/" + locale + "/dashboard"}`,
          request.url
        )
      );
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(de|en|tr)/:path*", "/dashboard/:path*", "/api/:path*"],
};
