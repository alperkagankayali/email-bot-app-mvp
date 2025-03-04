"use client";
import React, { useState } from "react";
import { Checkbox, Popover, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchEmailTemplate } from "@/redux/slice/scenario";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { DeleteFilled } from "@ant-design/icons";
import { Input, Select } from "antd";

const { Search } = Input;
const { Option } = Select;

const options = [
  { label: "Global", value: "superadmin" },
  { label: "Local", value: "User" },
];
export type IFilter = {
  name: string;
  language: string;
  authorType: string[];
};
type IContentFilter = {
  page: number;
  setFilter: (x: IFilter) => void;
  filter: IFilter;
  isLanguage?: boolean;
  handleGetContentFilter: (
    key: string,
    value: string | string[],
    isDelete?: boolean
  ) => void;
};

const ContentFilter: React.FC<IContentFilter> = ({
  page,
  filter,
  setFilter,
  handleGetContentFilter,
  isLanguage = true,
}) => {
  const languages = useSelector((state: RootState) => state.language.language);
  const t = useTranslations("pages");

  const FilterTagList = (!!filter.name ||
    (filter.language && isLanguage) ||
    filter.authorType.length > 0) && (
    <div className="flex">
      {filter.authorType.length > 0 &&
        filter.authorType.map((e) => (
          <Tag
            bordered={false}
            key={e}
            onClose={(event) =>
              handleGetContentFilter(
                "authorType",
                filter.authorType.filter((element) => element !== e)
              )
            }
            closable
          >
            {e === "superadmin" ? "Global" : "Local"}
          </Tag>
        ))}
      {!!filter.language && isLanguage && (
        <Tag
          bordered={false}
          onClose={(event) => handleGetContentFilter("language", "")}
          closable
        >
          {languages.find((e) => e._id === filter.language)?.name}
        </Tag>
      )}
      {!!filter.name && (
        <Tag
          bordered={false}
          onClose={(event) => handleGetContentFilter("name", "")}
          closable
        >
          {filter.name}
        </Tag>
      )}
      <Popover content={t("clear-filter")} title="">
        <DeleteFilled
          className="ml-2 cursor-pointer"
          onClick={() => {
            handleGetContentFilter("", "", true);
          }}
        />
      </Popover>
    </div>
  );

  const FilterInput = (
    <div className="flex items-center gap-2">
      <Search
        placeholder={t("title")}
        size="large"
        value={filter.name}
        className="!w-72 rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        allowClear
        onClear={() => handleGetContentFilter("name", "")}
        onChange={(event) => {
          setFilter({ ...filter, name: event.target.value });
        }}
        onSearch={(value: any, event: any, info: any) => {
          handleGetContentFilter("name", value);
        }}
        enterButton
      />
      {isLanguage && (
        <Select
          size="large"
          className="w-auto min-w-54"
          placeholder={t("language")}
          value={filter.language || undefined}
          onChange={(value: string) => {
            handleGetContentFilter("language", value);
          }}
        >
          {languages.map((e) => {
            return (
              <Option key={e.code} value={e._id}>
                {e.name}
              </Option>
            );
          })}
        </Select>
      )}
      <Checkbox.Group
        className="!my-4"
        options={options}
        value={filter.authorType}
        onChange={(value: string[]) => {
          handleGetContentFilter("authorType", value);
        }}
      />
    </div>
  );

  return (
    <div className="w-full">
      <div>
        {FilterTagList}
        {FilterInput}
      </div>
    </div>
  );
};

export default ContentFilter;
