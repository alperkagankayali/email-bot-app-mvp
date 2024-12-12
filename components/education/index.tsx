"use client";

import { languageColor, languageEnum, noImage, randomColor } from "@/constants";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import {
  fetchEducationList,
  handleEducationContentDataChange,
} from "@/redux/slice/education";
import { AppDispatch, RootState } from "@/redux/store";
import {
  deleteEducation,
  getEducationContent,
} from "@/services/service/educationService";
import {
  DeleteFilled,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Input,
  Pagination,
  PaginationProps,
  Popconfirm,
  Popover,
  Select,
  Tag,
} from "antd";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;

const EducationList: React.FC = () => {
  const t = useTranslations("pages");
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(
    (state: RootState) => state.education.educationListStatus
  );
  const data = useSelector(
    (state: RootState) => state.education.educationListContent
  );
  const user = useSelector((state: RootState) => state.user.user);
  const totalItems = useSelector(
    (state: RootState) => state.education.educationListTotalItems
  );
  const [selectLanguage, setSelectLanguage] = useState<string[]>(
    searchParams.get("language")?.split("&") ?? []
  );
  const languages = useSelector((state: RootState) => state.language.language);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEducationList({}));
    }
  }, [status, dispatch]);

  useEffect(() => {
    dispatch(
      fetchEducationList({
        language: searchParams.get("language") ?? "",
        title: searchParams.get("title") ?? "",
        description: searchParams.get("description") ?? "",
      })
    );
  }, [searchParams, dispatch]);

  const handleDeleteEducation = async (id: string) => {
    const res = await deleteEducation(id);
    dispatch(
      handleEducationContentDataChange(
        data?.filter((e) => e._id !== res.data?._id)
      )
    );
  };

  const onChangePagitnation: PaginationProps["onChange"] = async (
    page,
    pageNumber
  ) => {
    dispatch(
      fetchEducationList({
        limit: pageNumber,
        page,
        language: searchParams.get("language") ?? "",
        title: searchParams.get("title") ?? "",
        description: searchParams.get("description") ?? "",
      })
    );
    setPageSize(pageNumber);
  };

  const handleSelect = (value: string[], type: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(type, value.join("&").replaceAll(" ", ""));
    } else {
      params.delete(type);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const onSearch = (value: any, event: any, info: any, name: string) => {
    const params = new URLSearchParams(searchParams);
    if (value.length > 3) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <div className="flex justify-between w-full items-center mb-4">
        <Link href="/dashboard/education/add">
          <Button type="primary"> {t("menu-education-add")}</Button>
        </Link>
        <span className="ml-2">Total {totalItems} items</span>
      </div>
      {!!data && (
        <div className="flex items-center justify-between">
          <Search
            placeholder="input education list title"
            size="large"
            name="title"
            className="!w-full mr-4 rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            allowClear
            onSearch={(value: any, event: any, info: any) =>
              onSearch(value, event, info, "title")
            }
            enterButton
          />
          <Search
            placeholder="input education list description"
            size="large"
            name="value"
            className="!w-full mr-4 rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            allowClear
            onSearch={(value: any, event: any, info: any) =>
              onSearch(value, event, info, "value")
            }
            enterButton
          />
          <Select
            mode="multiple"
            size="large"
            className="w-full !ml-4"
            placeholder="Select language"
            value={selectLanguage}
            onChange={(value: string[]) => {
              setSelectLanguage(value);
              handleSelect(value, "language");
            }}
          >
            {languages.map((e) => {
              return (
                <Option key={e.code} value={e.code}>
                  {e.name}
                </Option>
              );
            })}
          </Select>
          <Popover content={"Clear filter"} title="">
            <DeleteFilled
              className="ml-2 cursor-pointer"
              onClick={() => {
                setSelectLanguage([]);
                replace(`${pathname}`);
              }}
            />
          </Popover>
        </div>
      )}

      <div className="grid grid-cols-4 gap-9 mt-5">
        {data.map((item) => {
          const education = item.educations[0];
          const reduce = education?.contents.reduce((acc: any, content) => {
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
              onConfirm={() => handleDeleteEducation(item._id)}
              okText="Yes"
              cancelText="No"
              disabled={
                item?.authorType === "superadmin" && user?.role !== "superadmin"
              }
            >
              <DeleteOutlined />
            </Popconfirm>,
          ];
          return (
            <Badge.Ribbon
              className="card-title-ribbon"
              color={item?.authorType === "superadmin" ? "green" : "red"}
              text={item?.authorType === "superadmin" ? "Global" : "Local"}
              key={item._id}
            >
              <Card
                actions={actions}
                key={item._id}
                hoverable
                rootClassName="flex h-full"
                loading={status === "loading"}
                style={{ width: 240 }}
                cover={
                  <Image
                    width={240}
                    height={100}
                    className="h-30 object-contain bg-[#03162b]"
                    alt={education?.title}
                    src={
                      status === "loading" || !!!education?.img
                        ? noImage
                        : education?.img
                    }
                  />
                }
              >
                <Meta
                  title={education.title}
                  description={
                    <div className="mt-auto">
                      <div className="grid grid-cols-3  gap-2 mt-auto pt-2">
                        <Tag className="!m-0 !pl-1">
                          {" "}
                          Article {reduce["article"].count}
                        </Tag>
                        <Tag className="!m-0 !pl-1">
                          {" "}
                          Quiz {reduce["quiz"]?.count}
                        </Tag>
                        <Tag className="!m-0 !pl-1">
                          {" "}
                          Video {reduce["video"]?.count}
                        </Tag>
                      </div>
                      <div className="my-4">
                        {item.languages.map((e: any) => (
                          <Tag
                            key={e}
                            color={languageColor[e as languageEnum] ?? "blue"}
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

export default EducationList;
