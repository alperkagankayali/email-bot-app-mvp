"use client";
import React from "react";
import { Checkbox, Popover, Tag, Input } from "antd";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchDataEntry } from "@/redux/slice/scenario";
import { useTranslations } from "next-intl";
import { DeleteFilled } from "@ant-design/icons";

const { Search } = Input;

const options = [
  { label: "Global", value: "superadmin" },
  { label: "Local", value: "User" },
];
export type IFilter = {
  name: string;
  authorType: string[];
};
type IDataEntryFilter = {
  page: number;
  isPage: boolean;
  setFilter: (x: IFilter) => void;
  filter: IFilter;
};

const DataEntryFilter: React.FC<IDataEntryFilter> = ({
  page,
  isPage,
  filter,
  setFilter,
}) => {
  const t = useTranslations("pages");
  const dispatch = useDispatch<AppDispatch>();

  const handleGetDataEntryFilter = async (
    key: string,
    value: string | string[],
    isDelete?: boolean
  ) => {
    if (isDelete) {
      dispatch(
        fetchDataEntry({
          limit: isPage ? 8 : 6,
          page: page,
        })
      );
      setFilter({ name: "", authorType: [] });
    } else {
      dispatch(
        fetchDataEntry({
          limit: isPage ? 8 : 6,
          page: page,
          ...filter,
          [key]: value,
        })
      );
      setFilter({ ...filter, [key]: value });
    }
  };

  const FilterTagList = (!!filter.name || filter.authorType.length > 0) && (
    <div className="flex">
      {filter.authorType.length > 0 &&
        filter.authorType.map((e) => (
          <Tag
            bordered={false}
            key={e}
            onClose={(event) =>
              handleGetDataEntryFilter(
                "authorType",
                filter.authorType.filter((element) => element !== e)
              )
            }
            closable
          >
            {e === "superadmin" ? "Global" : "Local"}
          </Tag>
        ))}
      {!!filter.name && (
        <Tag
          bordered={false}
          onClose={(event) => handleGetDataEntryFilter("name", "")}
          closable
        >
          {filter.name}
        </Tag>
      )}
      <Popover content={t("clear-filter")} title="">
        <DeleteFilled
          className="ml-2 cursor-pointer"
          onClick={() => {
            handleGetDataEntryFilter("", "", true);
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
        onClear={() => handleGetDataEntryFilter("name", "")}
        onChange={(event) => {
          setFilter({ ...filter, name: event.target.value });
        }}
        onSearch={(value: any, event: any, info: any) => {
          handleGetDataEntryFilter("name", event.target.value);
        }}
        enterButton
      />
      <Checkbox.Group
        className="!my-4"
        options={options}
        value={filter.authorType}
        onChange={(value: string[]) => {
          handleGetDataEntryFilter("authorType", value);
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

export default DataEntryFilter;
