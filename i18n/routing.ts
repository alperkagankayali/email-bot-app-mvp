import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { languageCodeLists } from "@/constants";

// Routing yapılandırmasını optimize edelim
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: languageCodeLists,

  // Used when no locale matches
  defaultLocale: "en",

  // Sayfa geçişlerini hızlandırmak için

  // Locale detection'ı devre dışı bırakalım
  localeDetection: false,
});

// Navigation API'lerini optimize edelim
export const { Link, redirect, usePathname, useRouter, getPathname, permanentRedirect } =
  createNavigation(routing);
