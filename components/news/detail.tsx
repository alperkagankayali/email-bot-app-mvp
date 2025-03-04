"use client";
import { getNews } from "@/services/service/newsService";
import { INewsBlog } from "@/types/newsType";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import Loader from "../common/Loader";
import { useFormatter } from "next-intl";
import { Tag } from "antd";
import { IUser } from "@/types/userType";

type IProps = {
  redirect?: boolean;
  id?: string;
};
const NewsDetail: React.FC<IProps> = ({ id }) => {
  const t = useTranslations("pages");
  const [data, setData] = useState<INewsBlog>();
  const [loading, setLoading] = useState<boolean>(true);
  const format = useFormatter();

  useEffect(() => {
    const fetchNes = async (limit: number, page: number) => {
      const res = await getNews(limit, page, id ?? "");
      setLoading(false);
      if (res.success) {
        setData(res.data);
      }
    };
    fetchNes(8, 1);
  }, []);

  if (loading) {
    return <Loader />;
  } else if (!!data) {
    const dateTime = new Date(data.created_at);
    const dateTime2 = new Date(data.updated_at);
    const type = data.authorType?.toLocaleLowerCase();

    return (
      <div>
        <h1 className="text-4xl text-black font-bold mb-4">{data.headline}</h1>
        <div className="flex mb-4">
          <span className="bg-slate-200 rounded-full w-12">
            <Image
              width={48}
              height={48}
              className="rounded-full bg-slate-200 h-12 object-contain mr-2"
              src={
                type === "user"
                  ? ((data.author as IUser)?.company.logo ?? "")
                  : "/images/user/user-01.png"
              }
              alt="User"
            />
          </span>
          <span className="hidden lg:block ml-2">
            <span className="block text-sm font-medium text-black dark:text-white">
              {data.author.nameSurname}
            </span>
            <span className="block text-xs">
              {type === "superadmin"
                ? "Super Admin"
                : (data.author as IUser)?.department}
            </span>
          </span>
        </div>
        <p className="mb-4">{data.description}</p>

        <Image
          className="!w-full mb-4 rounded-md"
          width={1000}
          height={500}
          quality={100}
          src={data.featuredImageUrl}
          alt={data.headline}
        />
        <div
          className="mb-4"
          dangerouslySetInnerHTML={{ __html: data?.content }}
        ></div>
        <div className="flex w-full justify-between">
          <p className="mb-4">
            {t("create-date")}:{" "}
            {format.dateTime(dateTime, {
              hour: "numeric",
              minute: "numeric",
              month: "numeric",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="mb-4">
            {t("update-date")}:{" "}
            {format.dateTime(dateTime2, {
              hour: "numeric",
              minute: "numeric",
              month: "numeric",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        {data.tags.map((value) => (
          <Tag key={value}>{value}</Tag>
        ))}
      </div>
    );
  }
  return <Loader />;
};

export default NewsDetail;
