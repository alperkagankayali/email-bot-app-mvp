"use client";
import React, { useEffect, useState } from "react";
import { Button, Checkbox, Popover, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchScenario } from "@/redux/slice/scenario";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { DeleteFilled, InfoCircleOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import { useSearchParams } from "next/navigation";
import parse from "html-react-parser";

const { Search } = Input;
const { Option } = Select;

const options = [
  { label: "Global", value: "superadmin" },
  { label: "Local", value: "User" },
];
type IFilter = {
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

const ScenarioListFilter: React.FC<IScenarioListFilter> = ({ pageSize,filter,setFilter }) => {
  const scenarioType = useSelector(
    (state: RootState) => state.scenario.scenarioType
  );
  const languages = useSelector((state: RootState) => state.language.language);
  const data = useSelector((state: RootState) => state.scenario.scenario);

  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const t = useTranslations("pages");
  const [selectLanguage, setSelectLanguage] = useState("");
  const [selectScenarioType, setSelectSecenariType] = useState("");

  const onSearch = (value: any, event: any, info: any, name: string) => {
    const params = new URLSearchParams(searchParams);
    if (value.length > 3) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSelect = (value: string | string[], type: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(
        type,
        Array.isArray(value) ? value.join("&").replaceAll(" ", "") : value
      );
    } else {
      params.delete(type);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    dispatch(
      fetchScenario({
        name: searchParams.get("name") ?? "",
        language:
          languages.find((e) => e.code === searchParams.get("language"))?._id ??
          "",
        authorType: searchParams.get("authorType") ?? "",
        scenarioType:
          scenarioType?.find(
            (e) => e.title === searchParams.get("scenarioType")
          )?._id ?? "",
        limit: pageSize,
        page: 1,
      })
    );
  }, [searchParams]);

  return (
    <div className="">
      <div className="flex justify-between w-full items-center mb-4">
        {!!filter.name || filter.language || filter.authorType ? (
          <div className="flex">
            {filter.authorType.length > 0 &&
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
            {!!filter.language && (
              <Tag
                bordered={false}
                onClose={(event) =>
                  setFilter({
                    ...filter,
                    language: filter.language,
                  })
                }
                closable
              >
                {filter.language}
              </Tag>
            )}
            {!!filter.name && (
              <Tag
                bordered={false}
                onClose={(event) =>
                  setFilter({
                    ...filter,
                    name: "",
                  })
                }
                closable
              >
                {filter.name}
              </Tag>
            )}
            {!!filter.scenarioType && (
              <Tag
                bordered={false}
                onClose={(event) =>
                  setFilter({
                    ...filter,
                    scenarioType: "",
                  })
                }
                closable
              >
                {filter.scenarioType}
              </Tag>
            )}
            <Popover content={t("clear-filter")} title="">
              <DeleteFilled
                className="ml-2 cursor-pointer"
                onClick={() => {
                  setFilter({
                    authorType: [],
                    name: "",
                    scenarioType: "",
                    language: "",
                  });
                  setSelectSecenariType("");
                  setSelectLanguage("");
                  replace(`${pathname}`);
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
              onSearch={(value: any, event: any, info: any) => {
                setFilter({ ...filter, name: value });
                onSearch(value, event, info, "name");
              }}
              enterButton
            />
            {!!scenarioType && (
              <Select
                size="large"
                className="w-auto min-w-54"
                value={selectScenarioType || undefined}
                placeholder={t("scenario-type")}
                onChange={(value: string) => {
                  setFilter({ ...filter, scenarioType: value });
                  setSelectSecenariType(value);
                  handleSelect(value, "scenarioType");
                }}
                options={scenarioType?.map((type) => {
                  return { value: type.title, label: type.title };
                })}
              />
            )}
            <Select
              size="large"
              className="w-auto min-w-54"
              placeholder="language"
              value={selectLanguage || undefined}
              onChange={(value: string) => {
                setSelectLanguage(value);
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
              onChange={(value: string[]) => {
                setFilter({ ...filter, authorType: value });
                handleSelect(value, "authorType");
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
