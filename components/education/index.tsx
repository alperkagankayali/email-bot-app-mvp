"use client";

import {
  languageColor,
  languageEnum,
  noImage,
  queryStringTo,
  randomColor,
} from "@/constants";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import {
  fetchEducationList,
  handleEducationContentDataChange,
} from "@/redux/slice/education";
import { AppDispatch, RootState } from "@/redux/store";
import { deleteEducation } from "@/services/service/educationService";
import { DeleteFilled, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Pagination,
  PaginationProps,
  Popconfirm,
  Popover,
  Select,
  Splitter,
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

const options = [
  { label: "Global", value: "superadmin" },
  { label: "Local", value: "User" },
];

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
  const languages = useSelector((state: RootState) => state.language.language);
  const [pageSize, setPageSize] = useState(8);
  const [filter, setFilter] = useState({
    title: searchParams.get("title") ?? "",
    description: searchParams.get("description") ?? "",
    levelOfDifficulty: searchParams.get("levelOfDifficulty") ?? "",
    authorType: searchParams.get("authorType")?.split("&") ?? [],
    language: searchParams.get("language")?.split("&") ?? [],
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEducationList({}));
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status !== "idle") {
      dispatch(
        fetchEducationList({
          language: searchParams.get("language") ?? "",
          title: searchParams.get("title") ?? "",
          description: searchParams.get("description") ?? "",
          levelOfDifficulty: searchParams.get("levelOfDifficulty") ?? "",
          authorType: searchParams.get("authorType") ?? "",
        })
      );
    }
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
        levelOfDifficulty: searchParams.get("levelOfDifficulty") ?? "",
        authorType: searchParams.get("authorType") ?? "",
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
        {!!filter.title ||
        !!filter.description ||
        filter.levelOfDifficulty ||
        filter.language.length > 0 ||
        filter.authorType.length > 0 ? (
          <div className="flex">
            {!!filter.authorType &&
              filter.authorType.map((e) => (
                <Tag
                  bordered={false}
                  key={e}
                  onClose={(event) =>
                    setFilter({
                      ...filter,
                      authorType: filter.authorType.filter(
                        (element) => element !== e
                      ),
                    })
                  }
                  closable
                >
                  {e === "superadmin" ? "Global" : "Local"}
                </Tag>
              ))}
            {!!filter.language &&
              filter.language.map((e) => (
                <Tag
                  bordered={false}
                  key={e}
                  onClose={(event) =>
                    setFilter({
                      ...filter,
                      language: filter.language.filter(
                        (element) => element !== e
                      ),
                    })
                  }
                  closable
                >
                  {e}
                </Tag>
              ))}
            {!!filter.title && (
              <Tag
                bordered={false}
                onClose={(event) =>
                  setFilter({
                    ...filter,
                    title: "",
                  })
                }
                closable
              >
                {filter.title}
              </Tag>
            )}
            {!!filter.description && (
              <Tag
                bordered={false}
                onClose={(event) =>
                  setFilter({
                    ...filter,
                    description: "",
                  })
                }
                closable
              >
                {filter.description}
              </Tag>
            )}
            {!!filter.levelOfDifficulty && (
              <Tag
                bordered={false}
                onClose={(event) =>
                  setFilter({
                    ...filter,
                    levelOfDifficulty: "",
                  })
                }
                closable
              >
                {filter.levelOfDifficulty}
              </Tag>
            )}
            <Popover content={t("clear-filter")} title="">
              <DeleteFilled
                className="ml-2 cursor-pointer"
                onClick={() => {
                  setFilter({
                    authorType: [],
                    description: "",
                    title: "",
                    language: [],
                    levelOfDifficulty: "",
                  });
                  replace(`${pathname}`);
                }}
              />
            </Popover>
          </div>
        ) : (
          <span></span>
        )}
        <Link href="/dashboard/education/add">
          <Button type="primary" className="!bg-[#181140] w-full"> {t("menu-education-add")}</Button>
        </Link>
      </div>
      <div className="flex justify-between">
        {!!data && (
          <div className="flex flex-col ">
            <Search
              placeholder={t("education-title")}
              size="large"
              name="title"
              defaultValue={filter.title}
              className="!w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary "
              allowClear
              onSearch={(value: any, event: any, info: any) => {
                setFilter({ ...filter, title: value });
                onSearch(value, event, info, "title");
              }}
              enterButton
            />
            <Search
              placeholder={t("education-description")}
              size="large"
              name="description"
              defaultValue={filter.description}
              className="!w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mt-4"
              allowClear
              onSearch={(value: any, event: any, info: any) => {
                setFilter({ ...filter, description: value });
                onSearch(value, event, info, "description");
              }}
              enterButton
            />
            <Select
              mode="multiple"
              size="large"
              className="w-full !mt-4"
              placeholder={t("resources-language")}
              value={filter.language}
              onChange={(value: string[]) => {
                setFilter({ ...filter, language: value });
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
            <Checkbox.Group
              className="!my-4"
              options={options}
              value={filter.authorType}
              defaultValue={["Pear"]}
              onChange={(value: string[]) => {
                setFilter({ ...filter, authorType: value });
                handleSelect(value, "authorType");
              }}
            />
            <Select
              size="large"
              className="w-full "
              placeholder="level of difficulty"
              value={filter.levelOfDifficulty}
              onChange={(value: string) => {
                setFilter({ ...filter, levelOfDifficulty: value });
                onSearch(value, "", "", "levelOfDifficulty");
              }}
              options={[
                {
                  value: "easy",
                  label: "easy",
                },
                {
                  value: "medium",
                  label: "medium",
                },
                {
                  value: "hard",
                  label: "hard",
                },
              ]}
            />
          </div>
        )}

        {!!data && (
          <div className="grid grid-cols-4 gap-5">
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
                <Popconfirm
                  title={t("delete-document")}
                  description={t("delete-document-2")}
                  onConfirm={() => handleDeleteEducation(item._id)}
                  okText={t("yes-btn")}
                  cancelText={t("no-btn")}
                  disabled={
                    item?.authorType === "superadmin" &&
                    user?.role !== "superadmin"
                  }
                >
                  <DeleteOutlined />
                </Popconfirm>,
              ];
              return (
                <div style={{ width: 240 }} className="flex" key={item._id}>
                  <Badge.Ribbon
                    className="card-title-ribbon"
                    color={item?.authorType === "superadmin" ? "green" : "red"}
                    text={
                      item?.authorType === "superadmin" ? "Global" : "Local"
                    }
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
                                      : education.levelOfDifficulty === "medium"
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
                </div>
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

export default EducationList;
