import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { getResource } from "@/services/service/generalService";

export default getRequestConfig(async ({ locale }) => {
  if (!routing.locales.includes(locale as any)) notFound();
  const res: any = await getResource(locale);
  console.log("res.data", res.data);
  if (!!res.data) {
    return {
      messages: res.data,
    };
  }
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
