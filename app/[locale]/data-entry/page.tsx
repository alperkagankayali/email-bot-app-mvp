import ResetPasswordCom from "@/components/resetPassword";
import { getUserAssignmentScenario } from "@/services/service/campaignService";
import { getTranslations } from "next-intl/server";
import Head from "next/head";

export async function generateMetadata({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  try {
    if (
      searchParams &&
      typeof searchParams.userId === "string" &&
      typeof searchParams.campaignId === "string"
    ) {
      const res = await getUserAssignmentScenario(
        searchParams.userId,
        searchParams.campaignId
      );
      return {
        title: res.data.title,
      };
    } else {
      const t = await getTranslations();
      return {
        title: t("title"),
      };
    }
  } catch (error) {
    return {
      title: "Email MVP",
    };
  }
}

export default async function DataEntry({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  if (
    searchParams &&
    typeof searchParams.userId === "string" &&
    typeof searchParams.campaignId === "string"
  ) {
    const res = await getUserAssignmentScenario(
      searchParams.userId,
      searchParams.campaignId
    );
    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: res.data }} />
      </div>
    );
  } else {
    return <></>;
  }
}
