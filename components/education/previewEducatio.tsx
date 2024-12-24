"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Avatar, List, Tag } from "antd";
import { useEffect, useState } from "react";
import {
  AccountBookTwoTone,
  BookTwoTone,
  VideoCameraTwoTone,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { languageColor, languageEnum } from "@/constants";

type IProps = {
  next: () => void;
  lang: string;
};
const PreviewEducation = ({ next, lang }: IProps) => {
  const t = useTranslations("pages");
  const educationDetail = useSelector(
    (state: RootState) => state.education.forms
  );
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (!!educationDetail[lang]) {
      setData(educationDetail[lang]);
    }
  }, [educationDetail]);

  return (
    <>
      <List itemLayout="vertical">
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar size={64} src={data?.img} />}
            title={<p>{data?.title}</p>}
            description={
              <div>
                <p>{data?.description}</p>
                <div className="my-4">
                  <Tag
                    className="!m-0 !pl-1 !mr-4"
                    color={
                      data?.levelOfDifficulty === "hard"
                        ? "#cd201f"
                        : data?.levelOfDifficulty === "medium"
                          ? "#108ee9"
                          : "#87d068"
                    }
                  >
                    {data?.levelOfDifficulty}
                  </Tag>
                  <Tag
                    key={lang}
                    color={languageColor[lang as languageEnum] ?? "blue"}
                  >
                    {lang}
                  </Tag>
                </div>
              </div>
            }
          />
          <div className="pl-20">
            <p className="text-xl font-bold">{t("content")}</p>
            <List
              itemLayout="horizontal"
              dataSource={data.contents as []}
              renderItem={(item: any, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      item.type === "video" ? (
                        <VideoCameraTwoTone />
                      ) : item.type === "article" ? (
                        <BookTwoTone />
                      ) : (
                        <AccountBookTwoTone />
                      )
                    }
                    title={<p>{item?.title}</p>}
                    description={item?.description}
                  />
                </List.Item>
              )}
            />
          </div>
        </List.Item>
      </List>
    </>
  );
};

export default PreviewEducation;
