import { NextIntlClientProvider, IntlProvider } from "next-intl";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import {
  getTranslations,
  unstable_setRequestLocale,
} from "next-intl/server";
import "../globals.css";
import StoreProvider from "../StoreProvider";
import {  routing } from "@/i18n/routing";
import { ReactNode } from "react";
import {  getResource } from "@/services/service/generalService";

type Props = {
  children: ReactNode;
  params: { locale: string };
};
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: Omit<Props, "children">) {
  const t = await getTranslations({ locale, namespace: "pages" });

  return {
    title: t("title"),
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const messages = await getResource(locale);

  return (
    <html lang={locale}>
      <body>
        <StoreProvider>
          <NextIntlClientProvider locale={locale} messages={messages.data}>
            <AntdRegistry>{children}</AntdRegistry>
          </NextIntlClientProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
