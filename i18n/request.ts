import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  const defaultLocale = await locale;
  if (!routing.locales.includes(locale as any)) notFound();
 
  return {
    locale,
    messages: (
      await (locale === 'en'
        ? // When using Turbopack, this will enable HMR for `en`
          import('../messages/en.json')
        : import(`../messages/${defaultLocale}.json`))
    ).default
  };
});
