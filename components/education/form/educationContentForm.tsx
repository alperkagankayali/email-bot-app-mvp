"use client";
import React from "react";
import { Button, Tabs } from "antd";
import ArticleTab from "./articleTab";
import VideoTab from "./videoTab";
import QuizTab from "./quizTab";
import { useTranslations } from "next-intl";

type IProps = {
  next: () => void;
  lang: string;
};
const EducationContentForm: React.FC<IProps> = ({ next, lang }) => {
  const t = useTranslations("pages");
  const items = [
    {
      label: t("menu-academy-article"),
      key: "1",
      children: (
        <>
          <ArticleTab lang={lang} />
        </>
      ),
    },
    {
      label: t("menu-academy-video"),
      key: "2",
      children: (
        <>
          <VideoTab lang={lang} />
        </>
      ),
    },
    {
      label: t("menu-academy-quiz"),
      key: "3",
      children: (
        <>
          <QuizTab lang={lang} />
        </>
      ),
    },
  ];

  return (
    <>
      <Tabs
        tabBarStyle={{
          color: "black",
          fontWeight: "bold",
          display: "flex",
          borderBottom: "2px black solid",
        }}
        type="card"
        className="w-full"
        items={items}
        tabBarExtraContent={<p> {t("select-or-create")}</p>}
      />

      <div className="mb-4">
        <Button
          onClick={next}
          size="small"
          className="w-full cursor-pointer rounded-lg border !border-primary !bg-primary !p-7 !text-white transition hover:bg-opacity-90 mt-4"
        >
          {t("save-and-continue")}
        </Button>
      </div>
    </>
  );
};

export default EducationContentForm;
