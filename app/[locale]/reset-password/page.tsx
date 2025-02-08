import ResetPasswordCom from "@/components/resetPassword";
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
export default function ResetPassword({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <>
      <ResetPasswordCom locale={locale} />
    </>
  );
}
