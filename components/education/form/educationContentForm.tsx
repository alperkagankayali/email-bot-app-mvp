"use client";
import React from "react";
import { Tabs } from "antd";
import ArticleTab from "./articleTab";
import VideoTab from "./videoTab";

const onChange = (key: string) => {
  console.log(key);
};

const EducationContentForm: React.FC = () => {
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
      children: <></>,
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
        onChange={onChange}
        type="card"
        className="w-full"
        items={items}
        tabBarExtraContent={<p>Select or Create Education Content</p>}
      />
    </>
  );
};

export default EducationContentForm;
