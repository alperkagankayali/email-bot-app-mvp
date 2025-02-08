import { notFound } from "next/navigation";
import { routing } from "./routing";
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!routing.locales.includes(locale as any)) notFound();
  return {
    // locale,
    messages: (
      await (locale === "en"
        ? // When using Turbopack, this will enable HMR for `en`
          import("../messages/en.json")
        : import(`../messages/tr.json`))
    ).default,
  };
});
