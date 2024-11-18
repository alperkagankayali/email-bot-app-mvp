"use client";
import React from "react";
import { Button, Tabs } from "antd";
import ArticleTab from "./articleTab";
import VideoTab from "./videoTab";
import QuizTab from "./quizTab";

type IProps = {
  next: () => void;
};
const EducationContentForm: React.FC<IProps> = ({ next }) => {
  const items = [
    {
      label: "Article",
      key: "1",
      children: (
        <>
          <ArticleTab />
        </>
      ),
    },
    {
      label: "Video",
      key: "2",
      children: (
        <>
          <VideoTab />
        </>
      ),
    },
    {
      label: "Quiz",
      key: "3",
      children: (
        <>
          <QuizTab />
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
        tabBarExtraContent={<p>Select or Create Education Content</p>}
      />
      <div className="mb-4">
        <Button
          onClick={next}
          size="small"

          className="w-full cursor-pointer rounded-lg border !border-primary !bg-primary !p-7 !text-white transition hover:bg-opacity-90 mt-4"
        >
          Kaydet ve Devam Et
        </Button>
      </div>
    </>
  );
};

export default EducationContentForm;
