"use client";

import { noImage, randomColor } from "@/constants";
import { Link } from "@/i18n/routing";
import { fetchContent } from "@/redux/slice/education";
import { AppDispatch, RootState } from "@/redux/store";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, List, Popconfirm, Tag } from "antd";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const EducationList: React.FC = () => {
  const t = useTranslations("pages");
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(
    (state: RootState) => state.education.educationStatus
  );
  const data = useSelector(
    (state: RootState) => state.education.educationContent
  );
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchContent(10));
    }
  }, [status, dispatch]);

  return (
    <div>
      <div className="flex justify-end ">
        <Link href="/dashboard/education/add">
          <Button type="primary"> {t("menu-education-add")}</Button>
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-5">
        {data.map((item) => {
          const reduce = item.contents.reduce((acc: any, content) => {
            if (!acc[content.type]) {
              acc[content.type] = { type: content.type, count: 0 };
            }
            acc[content.type].count += 1; // Tür sayısını artır.
            return acc;
          }, {});
          const actions: React.ReactNode[] = [
            <Link href={"/dashboard/education/update/" + item._id}>
              <EditOutlined key="edit" />
            </Link>,
            <Popconfirm
              title="Delete the article"
              description="Are you sure to delete this article?"
              onConfirm={() => console.log(item._id)}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined />
            </Popconfirm>,
          ];
          return (
            <Card
              actions={actions}
              key={item.title}
              cover={
                <Image
                  src={!!item.img ? item.img : noImage}
                  width={64}
                  height={64}
                  className="max-h-36 object-cover"
                  alt="content img"
                />
              }
            >
              <div className="flex flex-col min-h-30">
                <h3 className="text-xl">{item.title}</h3>
                <p className="line-clamp-4 mt-3 ">{item.description}</p>
                <div className="grid grid-cols-3  gap-2 mt-auto pt-2">
                  <Tag color="purple" className="!m-0 !pl-1">
                    {" "}
                    Article {reduce["article"].count}
                  </Tag>
                  <Tag color="#f50" className="!m-0 !pl-1">
                    {" "}
                    Quiz {reduce["quiz"].count}
                  </Tag>
                  <Tag color="#2db7f5" className="!m-0 !pl-1">
                    {" "}
                    Video {reduce["video"].count}
                  </Tag>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default EducationList;
