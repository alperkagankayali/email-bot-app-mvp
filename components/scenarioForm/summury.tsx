import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import Loader from "../common/Loader";
import { noImage } from "@/constants";
import { Card } from "antd";
import Image from "next/image";
import { useTranslations } from "next-intl";
const { Meta } = Card;

const CardTemplate = (list: any) => {
  return (
    <Card
      className={""}
      key={list?._id}
      style={{
        width: 240,
        boxShadow: "inherit",
      }}
      cover={
        <Image
          width={240}
          height={120}
          className="bg-[#03162b] h-30 object-contain "
          alt={list?.title}
          src={list?.img ?? noImage}
        />
      }
    >
      <Meta title={list?.title} />
    </Card>
  );
};

const Summary: React.FC = () => {
  const data = useSelector((state: RootState) => state.scenario.creteScenario);
  const t = useTranslations("pages");
  const emailTemplate = useSelector(
    (state: RootState) => state.scenario.emailTemplate
  );
  const landingPage = useSelector(
    (state: RootState) => state.scenario.landingPage
  );
  const dataEntries = useSelector(
    (state: RootState) => state.scenario.dataEntries
  );
  const scenarioType = useSelector(
    (state: RootState) => state.scenario.scenarioType
  );
  const language = useSelector((state: RootState) => state.language.language);
  let scenarioTypeFind;
  let languageFind;
  if (
    scenarioType?.some(
      (e) => e._id === (data?.scenarioType as unknown as string)
    )
  )
    scenarioTypeFind = scenarioType?.find(
      (e) => e._id === (data?.scenarioType as unknown as string)
    );
  if (language?.some((e) => e._id === (data?.language as unknown as string)))
    languageFind = language?.find(
      (e) => e._id === (data?.language as unknown as string)
    );

  if (!!data)
    return (
      <div className=" mx-auto  bg-white shadow-md rounded-lg p-10">
        <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
        <img
          src={data.img ?? noImage}
          alt={data.title}
          className="max-w-64 h-auto mb-4"
        />

        <div className="mb-4">
          <h2 className="text-xl font-semibold"> {t("scenario-type")}</h2>
          <p>{scenarioTypeFind?.title}</p>
          <p>{scenarioTypeFind?.description}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold"></h2>
          <div className="grid grid-cols-3 gap-2">
            {emailTemplate?.some(
              (e) => e._id === (data?.emailTemplate as unknown as string)
            )
              ? CardTemplate(
                  emailTemplate?.find(
                    (e) => e._id === (data?.emailTemplate as unknown as string)
                  )
                )
              : ""}
            {landingPage?.some(
              (e) => e._id === (data?.landingPage as unknown as string)
            )
              ? CardTemplate(
                  landingPage?.find(
                    (e) => e._id === (data?.landingPage as unknown as string)
                  )
                )
              : ""}
            {dataEntries?.some(
              (e) => e._id === (data?.dataEntry as unknown as string)
            )
              ? CardTemplate(
                  dataEntries?.find(
                    (e) => e._id === (data?.dataEntry as unknown as string)
                  )
                )
              : ""}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">{t("menu-language")}</h2>
          <p>{languageFind?.name}</p>
        </div>
      </div>
    );
  else return <Loader />;
};

export default Summary;
