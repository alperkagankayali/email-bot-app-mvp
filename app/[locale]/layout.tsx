import { NextIntlClientProvider } from "next-intl";
import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import {
  getMessages,
  getTranslations,
  unstable_setRequestLocale,
} from "next-intl/server";
import "../globals.css";
import StoreProvider from "../StoreProvider";
import { routing } from "@/i18n/routing";
import { ReactNode } from "react";

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
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <StoreProvider>
          <NextIntlClientProvider messages={messages}>
            <AntdRegistry>{children}</AntdRegistry>
          </NextIntlClientProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
