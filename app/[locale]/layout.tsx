import { NextIntlClientProvider } from "next-intl";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "../globals.css";
import StoreProvider from "../StoreProvider";
import { routing } from "@/i18n/routing";
import { ReactNode } from "react";
import { getResource } from "@/services/service/generalService";
import Loader from "@/components/common/Loader";
import Favicon from "@/components/favicon";

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  try {
    const t = await getTranslations();
    return {
      title: t("title"),
    };
  } catch (error) {
    return {
      title: "Email MVP",
    };
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  setRequestLocale(locale);
  const messages = await getResource(locale);

  if (!!messages.success) {
    return (
      <html lang={locale}>
        <head>
          <link rel="icon" type="image/png" href="/icon/favicon-96x96.png" sizes="96x96" />
          <link rel="icon" type="image/svg+xml" href="/icon/favicon.svg" />
          <link rel="shortcut icon" href="/icon/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
        </head>
        <body>
          <StoreProvider>
            <NextIntlClientProvider locale={locale} messages={messages.data}>
              <AntdRegistry>
                <Favicon />
                {children}
              </AntdRegistry>
            </NextIntlClientProvider>
          </StoreProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" type="image/png" href="/icon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/icon/favicon.svg" />
        <link rel="shortcut icon" href="/icon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <Favicon />
        <Loader />
      </body>
    </html>
  );
}
