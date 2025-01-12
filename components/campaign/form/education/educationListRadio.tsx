"use client";
import Loader from "@/components/common/Loader";
import { languageColor, languageEnum, noImage } from "@/constants";
import { Link } from "@/i18n/routing";
import { getEducationListContent } from "@/services/service/educationService";
import { getNews } from "@/services/service/newsService";
import { IEducationList } from "@/types/educationListType";
import { EditOutlined } from "@ant-design/icons";
import {
  Badge,
  Card,
  Pagination,
  PaginationProps,
  Popconfirm,
  Radio,
  Tag,
} from "antd";
import Meta from "antd/es/card/Meta";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

type IPorps = {
  selected: string;
  setSelected: (x: string) => void;
};

const EducationListRadio: React.FC<IPorps> = ({ selected, setSelected }) => {
  const t = useTranslations("pages");

  const [data, setData] = useState<IEducationList[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageSize, setPageSize] = useState(8);

  const fetchEducationList = async (limit: number, page: number) => {
    const res = await getEducationListContent(limit, page, "");
    setLoading(false);
    if (res.success) {
      setTotalItems(res?.totalItems ?? 0);
      setData(res.data);
    }
  };

  useEffect(() => {
    const fetchEducationList = async (limit: number, page: number) => {
      const res = await getEducationListContent(limit, page, "");
      setLoading(false);
      if (res.success) {
        setTotalItems(res?.totalItems ?? 0);
        setData(res.data);
      }
    };
    fetchEducationList(8, 1);
  }, []);

  const onChangePagitnation: PaginationProps["onChange"] = async (
    page,
    pageNumber
  ) => {
    await fetchEducationList(pageNumber, page);
    setPageSize(pageNumber);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="flex justify-center  mt-5">
        {!!data && (
          <div className="grid grid-cols-4 text-left gap-5">
            {data.map((item) => {
              const education = item.educations[0];
              const reduce = education?.contents?.reduce(
                (acc: any, content) => {
                  if (!acc[content.type]) {
                    acc[content.type] = { type: content.type, count: 0 };
                  }
                  acc[content.type].count += 1; // Tür sayısını artır.
                  return acc;
                },
                {}
              );
              const actions: React.ReactNode[] = [
                <Link href={"/dashboard/education/update/" + item._id}>
                  <EditOutlined key="edit" />
                </Link>,
              ];
              return (
                <Radio.Group
                  onChange={(e) => {
                    setSelected(e.target.value);
                  }}
                  key={item._id}
                  buttonStyle="solid"
                  rootClassName="h-full"
                  className={
                    "!h-full !flex" + selected === item._id
                      ? "template-list selected"
                      : "template-list"
                  }
                  value={selected}
                >
                  <Radio
                    value={item._id}
                    className="h-full flex"
                    rootClassName="h-full"
                  >
                    <Badge.Ribbon
                      className={clsx("card-title-ribbon")}
                      color={
                        item?.authorType === "superadmin" ? "green" : "red"
                      }
                      text={
                        item?.authorType === "superadmin" ? "Global" : "Local"
                      }
                      key={item._id}
                    >
                      <Card
                        actions={actions}
                        key={item._id}
                        hoverable
                        className={clsx("h-full flex", {
                          "!border !border-blue-700": selected === item._id,
                        })}
                        loading={status === "loading"}
                        style={{ width: 240, height: 405 }}
                        cover={
                          <Image
                            width={240}
                            height={100}
                            className="h-30 object-contain bg-[#03162b]"
                            alt={education?.title}
                            src={
                              status === "loading" ||
                              education?.img === "" ||
                              education?.img === undefined
                                ? noImage
                                : education?.img
                            }
                          />
                        }
                      >
                        <Meta
                          className="card-meta"
                          title={education.title}
                          description={
                            <div className="mt-auto">
                              <div className="my-4">
                                {!!education.levelOfDifficulty && (
                                  <Tag
                                    className="!m-0 !pl-1"
                                    color={
                                      education.levelOfDifficulty === "hard"
                                        ? "#cd201f"
                                        : education.levelOfDifficulty ===
                                            "medium"
                                          ? "#108ee9"
                                          : "#87d068"
                                    }
                                  >
                                    {education.levelOfDifficulty}
                                  </Tag>
                                )}
                              </div>
                              <div className="grid grid-cols-3  gap-2 mt-auto pt-2">
                                {!!reduce["article"]?.count && (
                                  <Tag className="!m-0 !pl-1">
                                    {" "}
                                    Article: {reduce["article"]?.count ?? 0}
                                  </Tag>
                                )}
                                {!!reduce["quiz"]?.count && (
                                  <Tag className="!m-0 !px-1">
                                    {" "}
                                    Quiz: {reduce["quiz"]?.count ?? 0}
                                  </Tag>
                                )}
                                {!!reduce["video"]?.count && (
                                  <Tag className="!m-0 !pl-1">
                                    {" "}
                                    Video: {reduce["video"]?.count ?? 0}
                                  </Tag>
                                )}
                              </div>

                              <div className="my-4">
                                {item.languages.map((e: any) => (
                                  <Tag
                                    key={e}
                                    color={
                                      languageColor[e as languageEnum] ?? "blue"
                                    }
                                  >
                                    {e}
                                  </Tag>
                                ))}
                              </div>
                            </div>
                          }
                        />
                      </Card>
                    </Badge.Ribbon>
                  </Radio>
                </Radio.Group>
              );
            })}
          </div>
        )}
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

export default EducationListRadio;
