"use client";
import React from "react";
import { Button, Checkbox, Popover, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { DeleteFilled, InfoCircleOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import parse from "html-react-parser";
import { fetchScenario } from "@/redux/slice/scenario";

const { Search } = Input;

const options = [
  { label: "Global", value: "superadmin" },
  { label: "Local", value: "User" },
];
export type IFilter = {
  name: string;
  scenarioType: string;
  authorType: Array<string>;
  language: string;
};
type IScenarioListFilter = {
  pageSize: number;
  setFilter: (x: IFilter) => void;
  filter: IFilter;
};

const ScenarioListFilter: React.FC<IScenarioListFilter> = ({
  filter,
  setFilter,
  pageSize,
}) => {
  const scenarioType = useSelector(
    (state: RootState) => state.scenario.scenarioType
  );
  const languages = useSelector((state: RootState) => state.language.language);
  const data = useSelector((state: RootState) => state.scenario.scenario);
  const t = useTranslations("pages");
  const dispatch = useDispatch<AppDispatch>();

  const handleGetScenarioFilter = async (
    key: string,
    value: string | string[],
    isDelete?: boolean
  ) => {
    if (isDelete) {
      dispatch(
        fetchScenario({
          limit: 8,
          page: pageSize,
        })
      );
      setFilter({ name: "", authorType: [], language: "", scenarioType: "" });
    } else {
      dispatch(
        fetchScenario({
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
        {!!filter.name ||
        filter.language ||
        filter.authorType.length > 0 ||
        filter.scenarioType ? (
          <div className="flex">
            {filter.authorType.length > 0 &&
              filter.authorType.map((e) => (
                <Tag
                  bordered={false}
                  key={e}
                  onClose={(event) => {
                    handleGetScenarioFilter(
                      "authorType",
                      filter.authorType.filter((element) => element !== e)
                    );
                  }}
                  closable
                >
                  {e === "superadmin" ? "Global" : "Local"}
                </Tag>
              ))}
            {!!filter.language && (
              <Tag
                bordered={false}
                onClose={(event) => handleGetScenarioFilter("language", "")}
                closable
              >
                {languages?.find((e) => e._id === filter.language)?.name}
              </Tag>
            )}
            {!!filter.name && (
              <Tag
                bordered={false}
                onClose={(event) => handleGetScenarioFilter("name", "")}
                closable
              >
                {filter.name}
              </Tag>
            )}
            {!!filter.scenarioType && (
              <Tag
                bordered={false}
                onClose={(event) => handleGetScenarioFilter("scenarioType", "")}
                closable
              >
                {
                  scenarioType?.find((e) => e._id === filter.scenarioType)
                    ?.title
                }
              </Tag>
            )}
            <Popover content={t("clear-filter")} title="">
              <DeleteFilled
                className="ml-2 cursor-pointer"
                onClick={() => {
                  handleGetScenarioFilter("", "", true);
                }}
              />
            </Popover>
          </div>
        ) : (
          <span></span>
        )}
        <Link href="/dashboard/scenario/add">
          <Button type="primary" className="!bg-[#181140] w-full">
            {" "}
            {t("menu-scenario-add")}
          </Button>
        </Link>
      </div>
      <div className="">
        {!!data && (
          <div className="flex items-center gap-1">
            <Search
              placeholder={t("input-scenario-name")}
              size="large"
              className="!w-72 rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              allowClear
              value={filter.name}
              onClear={() => {
                handleGetScenarioFilter("name", "");
              }}
              onChange={(event) =>
                setFilter({ ...filter, name: event.target.value })
              }
              onSearch={(value: any, event: any, info: any) => {
                handleGetScenarioFilter("name", value);
              }}
              enterButton
            />
            {!!scenarioType && (
              <Select
                size="large"
                className="w-auto min-w-54"
                value={filter.scenarioType || undefined}
                placeholder={t("scenario-type")}
                onChange={(value: string) => {
                  handleGetScenarioFilter("scenarioType", value);
                }}
                options={scenarioType?.map((type) => {
                  return { value: type._id, label: type.title };
                })}
              />
            )}
            <Select
              size="large"
              className="w-auto min-w-54"
              placeholder={t("language")}
              value={filter.language || undefined}
              onChange={(value: string) => {
                handleGetScenarioFilter("language", value);
              }}
              options={languages?.map((type) => {
                return { value: type._id, label: type.name };
              })}
            />
            <Checkbox.Group
              className="!my-4"
              options={options}
              value={filter.authorType}
              onChange={(value: string[]) => {
                handleGetScenarioFilter("authorType", value);
              }}
            />
            <Popover
              content={parse(t.raw("author-type-desc"))}
              title={t("description")}
            >
              <InfoCircleOutlined />
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioListFilter;
