"use client";
import React from "react";
import { Button, Checkbox, Popover, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { DeleteFilled } from "@ant-design/icons";
import { Input, Select } from "antd";
import { fetchEducationList } from "@/redux/slice/education";

const { Search } = Input;

const options = [
  { label: "Global", value: "superadmin" },
  { label: "Local", value: "User" },
];
export type IFilter = {
  title: string;
  authorType: Array<string>;
  levelOfDifficulty: string;
  language: Array<string>;
};
type IEducationFilter = {
  pageSize: number;
  setFilter: (x: IFilter) => void;
  filter: IFilter;
};

const EducationFilter: React.FC<IEducationFilter> = ({
  filter,
  setFilter,
  pageSize,
}) => {
  const languages = useSelector((state: RootState) => state.language.language);
  const data = useSelector(
    (state: RootState) => state.education.educationListContent
  );
  const t = useTranslations("pages");
  const dispatch = useDispatch<AppDispatch>();

  const handleGetEducationFilter = async (
    key: string,
    value: string | string[],
    isDelete?: boolean
  ) => {
    if (isDelete) {
      dispatch(
        fetchEducationList({
          limit: 8,
          page: pageSize,
        })
      );
      setFilter({
        authorType: [],
        language: [],
        title: "",
        levelOfDifficulty:"",
      });
    } else {
      dispatch(
        fetchEducationList({
          limit: 8,
          page: pageSize,
          ...filter,
          [key]: value,
        })
      );
      setFilter({ ...filter, [key]: value });
    }
  };

  return (
    <div className="">
      <div className="flex justify-between w-full items-center mb-4">
        {!!filter.title ||
        filter.levelOfDifficulty ||
        filter.language.length > 0 ||
        filter.authorType.length > 0 ? (
          <div className="flex">
            {filter.authorType.length > 0 &&
              filter.authorType.map((e) => (
                <Tag
                  bordered={false}
                  key={e}
                  onClose={(event) =>
                    handleGetEducationFilter(
                      "authorType",
                      filter.authorType.filter((element) => element !== e)
                    )
                  }
                  closable
                >
                  {e === "superadmin" ? "Global" : "Local"}
                </Tag>
              ))}
            {filter.language.length > 0 &&
              filter.language.map((e: string) => (
                <Tag
                  bordered={false}
                  key={e}
                  onClose={(event) =>
                    handleGetEducationFilter(
                      "language",
                      filter.language.filter((element) => element !== e)
                    )
                  }
                  closable
                >
                  {languages?.find((x) => x.code === e)?.name}
                </Tag>
              ))}
            {!!filter.title && (
              <Tag
                bordered={false}
                onClose={(event) => handleGetEducationFilter("title", "")}
                closable
              >
                {filter.title}
              </Tag>
            )}

            {filter.levelOfDifficulty.length > 0 && (
              <Tag
                bordered={false}
                onClose={(event) =>
                  handleGetEducationFilter("levelOfDifficulty", "")
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
                  handleGetEducationFilter("", "", true);
                }}
              />
            </Popover>
          </div>
        ) : (
          <span></span>
        )}
        <Link href="/dashboard/education/add">
          <Button type="primary" className="!bg-[#181140] w-full">
            {" "}
            {t("menu-education-add")}
          </Button>
        </Link>
      </div>
      <div className="">
        {!!data && (
          <div className="flex items-center gap-2">
            <Search
              placeholder={t("education-title")}
              size="large"
              name="title"
              value={filter.title}
              defaultValue={filter.title}
              className="!w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary "
              allowClear
              onClear={() => {
                handleGetEducationFilter("title", "");
              }}
              onChange={(event) =>
                setFilter({ ...filter, title: event.target.value })
              }
              onSearch={(value: any, event: any, info: any) => {
                handleGetEducationFilter("title", value);
              }}
              enterButton
            />
            <Select
              mode="multiple"
              size="large"
              className="w-full"
              placeholder={t("resources-language")}
              value={filter.language || undefined}
              onChange={(value: string[]) => {
                handleGetEducationFilter("language", value);
              }}
              options={languages?.map((type) => {
                return { value: type.code, label: type.name };
              })}
            />
            <Checkbox.Group
              className=""
              options={options}
              value={filter.authorType}
              onChange={(value: string[]) => {
                handleGetEducationFilter("authorType", value);
              }}
            />
            <Select
              size="large"
              className="w-full "
              placeholder={t("level-of-difficulty")}
              // mode=""
              value={filter.levelOfDifficulty || undefined}
              onChange={(value: string) => {
                handleGetEducationFilter("levelOfDifficulty", value);
              }}
              options={[
                {
                  value: "easy",
                  label: t("easy"),
                },
                {
                  value: "medium",
                  label: t("medium"),
                },
                {
                  value: "hard",
                  label: t("hard"),
                },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationFilter;
