import { NextIntlClientProvider } from "next-intl";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "../globals.css";
import StoreProvider from "../StoreProvider";
import { routing } from "@/i18n/routing";
import { ReactNode } from "react";
import { getResource } from "@/services/service/generalService";
import Loader from "@/components/common/Loader";

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
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const messages = await getResource(locale);

  if (!!messages.success) {
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
  } else {
    return (
      <html>
        <body>
          {" "}
          <Loader />{" "}
        </body>{" "}
      </html>
    );
  }
}
