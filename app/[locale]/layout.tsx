import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import "../globals.css";
import StoreProvider from "../StoreProvider";

export const metadata: Metadata = {
  title: "Kliniker",
  description: "Email Bot MVP",
};
export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
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
