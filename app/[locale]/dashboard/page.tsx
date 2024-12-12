import Dashboard from "@/components/Dashboard";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { getTranslations } from "next-intl/server";

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
    console.error("Çeviri alınırken hata oluştu:", error);
    return {
      title: "Varsayılan Başlık", // Hata durumunda varsayılan bir başlık dönebiliriz
    };
  }
}

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <Dashboard />
      </DefaultLayout>
    </>
  );
}
