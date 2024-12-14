"use client";
import { getNews } from "@/services/service/newsService";
import { INewsBlog } from "@/types/newsType";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import Loader from "../common/Loader";
import { useFormatter } from "next-intl";
import { Tag } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type IProps = {
  redirect?: boolean;
  id?: string;
};
const NewsDetail: React.FC<IProps> = ({ id }) => {
  const t = useTranslations("pages");
  const [data, setData] = useState<INewsBlog>();
  const [loading, setLoading] = useState<boolean>(true);
  const format = useFormatter();
  const user = useSelector((state: RootState) => state.user.user);

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
                user?.role !== "superadmin"
                  ? (user?.companyLogo ?? "")
                  : "/images/user/user-01.png"
              }
              alt="User"
            />
          </span>
          <span className="hidden text-right lg:block ml-2">
            <span className="block text-sm font-medium text-black dark:text-white">
              {!!user && user.nameSurname}
            </span>
            <span className="block text-xs">
              {!!user && user.role === "superadmin"
                ? "Super Admin"
                : user?.department}
            </span>
            <span className="block text-xs">
              {!!user && user.role !== "superadmin" && user?.role}
            </span>
          </span>
        </div>
        <p className="mb-4">{data.description}</p>
        <p className="mb-4">
          {format.dateTime(dateTime, {
            hour: "numeric",
            minute: "numeric",
            month: "numeric",
            day: "numeric",
            year: "numeric",
          })}
        </p>
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
        {data.tags.map((value) => (
          <Tag key={value}>{value}</Tag>
        ))}
      </div>
    );
  }
  return <Loader />;
};

export default NewsDetail;
