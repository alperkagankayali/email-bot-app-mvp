"use client";
import { noImage } from "@/constants";
import { Link } from "@/i18n/routing";
import { getNews } from "@/services/service/newsService";
import { INewsBlog } from "@/types/newsType";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";

import { Button, Card, Pagination, PaginationProps } from "antd";
import Meta from "antd/es/card/Meta";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

const NewsList: React.FC = () => {
  const t = useTranslations("pages");

  const [data, setData] = useState<INewsBlog[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageSize, setPageSize] = useState(8);

  const fetchNes = async (limit: number, page: number) => {
    const res = await getNews(limit, page, "");
    setLoading(false);
    if (res.success) {
      setTotalItems(res?.totalItems ?? 0);
      setData(res.data);
    }
  };

  useEffect(() => {
    const fetchNes = async (limit: number, page: number) => {
      const res = await getNews(limit, page, "");
      setLoading(false);
      if (res.success) {
        setTotalItems(res?.totalItems ?? 0);
        setData(res.data);
      }
    };
    fetchNes(8, 1);
  }, []);

  const onChangePagitnation: PaginationProps["onChange"] = async (
    page,
    pageNumber
  ) => {
    await fetchNes(pageNumber, page);
    setPageSize(pageNumber);
  };

  return (
    <div>
      <div className="flex justify-between w-full items-center mb-4">
        <Link href="/dashboard/news/add">
          <Button type="primary"> {t("menu-news-add")}</Button>
        </Link>
        <span className="ml-2">Total items</span>
      </div>

      <div className="grid grid-cols-4 gap-8 mt-4">
        {data?.map((news) => {
          const actions: React.ReactNode[] = [
            <Link href={"/dashboard/news/update/" + news._id}>
              <EditOutlined key="edit" />
            </Link>,
            <Link href={"/dashboard/news/" + news._id}>
              <EyeOutlined key="ellipsis" />
            </Link>,
          ];
          return (
            <Card
              actions={actions}
              key={news._id}
              hoverable
              loading={loading}
              style={{ width: 240 }}
              cover={
                <Image
                  width={240}
                  height={100}
                  className="h-30 object-cover"
                  alt={news.headline}
                  src={loading ? noImage : news.featuredImageUrl}
                />
              }
            >
              <Meta title={news.headline} description={news.description} />
            </Card>
          );
        })}
      </div>
      <div className="mt-10 mb-20 w-full">
        {!!totalItems && (
          <Pagination
            onChange={onChangePagitnation}
            total={totalItems}
            pageSize={pageSize}
            showTotal={(total) => `Total ${total} items`}
            showSizeChanger
            defaultPageSize={8}
            align="center"
            pageSizeOptions={[8, 16, 24]}
          />
        )}
      </div>
    </div>
  );
};

export default NewsList;
