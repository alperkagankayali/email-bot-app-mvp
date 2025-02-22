"use client";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Modal,
  notification,
  Pagination,
  Popconfirm,
  Popover,
  Tag,
} from "antd";
import { noImage } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  changeNewScenarioData,
  fetchScenario,
  fetchScenarioType,
} from "@/redux/slice/scenario";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  DeleteFilled,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Input, Select } from "antd";
import type { GetProps, PaginationProps } from "antd";
import { useSearchParams } from "next/navigation";
import { deleteScenario } from "@/services/service/scenarioService";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;
const { Option } = Select;
const { Meta } = Card;

const options = [
  { label: "Global", value: "superadmin" },
  { label: "Local", value: "User" },
];

const ScenarioList: React.FC = () => {
  const status = useSelector((state: RootState) => state.scenario.status);
  const scenarioTypeStatus = useSelector(
    (state: RootState) => state.scenario.scenarioTypeStatus
  );
  const scenarioType = useSelector(
    (state: RootState) => state.scenario.scenarioType
  );
  const languages = useSelector((state: RootState) => state.language.language);
  const data = useSelector((state: RootState) => state.scenario.scenario);
  const totalItems = useSelector(
    (state: RootState) => state.scenario.scenarioTotalItem
  );
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const t = useTranslations("pages");
  const [open, setOpen] = useState({
    show: false,
    data: "",
  });
  const [selectLanguage, setSelectLanguage] = useState("");
  const [selectScenarioType, setSelectSecenariType] = useState("");
  const [filter, setFilter] = useState({
    name: searchParams.get("name") ?? "",
    scenarioType: searchParams.get("scenarioType") ?? "",
    authorType: searchParams.get("authorType")?.split("&") ?? [],
    language: searchParams.get("language") ?? "",
  });
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchScenario({}));
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (scenarioTypeStatus === "idle") {
      dispatch(fetchScenarioType());
    }
  }, [scenarioTypeStatus, dispatch]);

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
        language: searchParams.get("language") ?? "",
        authorType: searchParams.get("authorType") ?? "",
        scenarioType: searchParams.get("scenarioType") ?? "",
        limit: pageSize,
        page: 1,
      })
    );
  }, [searchParams]);

  const handleDeleteEmailTemplate = async (id: string) => {
    const res = await deleteScenario(id);
    if (res.success) {
      notification.success({ message: res.data?.title + " deleted" });
      dispatch(changeNewScenarioData(data?.filter((e) => e._id !== id)));
    } else {
      notification.error({
        message: res.data?.title + " could not be deleted",
      });
    }
  };

  const onChangePagitnation: PaginationProps["onChange"] = async (
    page,
    pageNumber
  ) => {
    dispatch(
      fetchScenario({
        limit: pageNumber,
        page,
        name: searchParams.get("name") ?? "",
        language: searchParams.get("language") ?? "",
        authorType: searchParams.get("authorType") ?? "",
        scenarioType: searchParams.get("scenarioType") ?? "",
      })
    );
    setPageSize(pageNumber);
  };

  return (
    <div className="flex flex-col items-start">
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
        <Link href="/dashboard/education/add">
          <Button type="primary" className="!bg-[#181140] w-full">
            {" "}
            {t("menu-scenario-add")}
          </Button>
        </Link>
      </div>
      <div className="flex w-full">
        <div className="">
          {!!data && (
            <div className="flex flex-col items-start gap-5">
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
                  className="w-full "
                  value={selectScenarioType}
                  placeholder={t("scenario-type")}
                  onChange={(value: string) => {
                    setFilter({ ...filter, scenarioType: value });
                    setSelectSecenariType(value);
                    handleSelect(value, "scenarioType");
                  }}
                >
                  {scenarioType?.map((type) => {
                    return (
                      <Option
                        key={type._id + type.title}
                        value={type._id}
                        required
                      >
                        {type.title}
                      </Option>
                    );
                  })}
                </Select>
              )}
              <Select
                size="large"
                className="w-full"
                placeholder="language"
                value={selectLanguage}
                onChange={(value: string) => {
                  setSelectLanguage(value);
                  setFilter({ ...filter, language: value });
                  handleSelect(value, "language");
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
              <Checkbox.Group
                className="!my-4"
                options={options}
                value={filter.authorType}
                onChange={(value: string[]) => {
                  setFilter({ ...filter, authorType: value });
                  handleSelect(value, "authorType");
                }}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-4 w-full pl-4">
          {data?.map((scenario) => {
            const actions: React.ReactNode[] = [
              <Link href={"/dashboard/scenario/update/" + scenario._id}>
                <EditOutlined key="edit" />
              </Link>,
              <EyeOutlined
                key="ellipsis"
                onClick={() =>
                  setOpen({
                    show: true,
                    data: scenario.emailTemplate?.content ?? "",
                  })
                }
              />,
              <Popconfirm
                title={t("delete-document")}
                description={t("delete-document-2")}
                onConfirm={() => handleDeleteEmailTemplate(scenario._id)}
                okText={t("yes-btn")}
                cancelText={t("no-btn")}
              >
                <DeleteOutlined />
              </Popconfirm>,
            ];
            return (
              <Badge.Ribbon
                className="card-title-ribbon"
                color={scenario?.authorType === "superadmin" ? "green" : "red"}
                text={
                  scenario?.authorType === "superadmin" ? "Global" : "Local"
                }
                key={scenario._id}
              >
                <Card
                  actions={actions}
                  key={scenario._id}
                  hoverable
                  loading={status === "loading"}
                  style={{ width: 240 }}
                  rootClassName="flex h-full"
                  className="flex flex-col "
                  cover={
                    <Image
                      width={240}
                      height={120}
                      className="h-30 object-contain bg-[#03162b]"
                      alt={scenario.title}
                      src={status === "loading" ? noImage : scenario.img}
                    />
                  }
                >
                  <Meta
                    className="card-meta"
                    title={scenario.title}
                    description={
                      <div className="">
                        <p>{scenario.scenarioType.title}</p>
                        <p>{scenario?.language.name}</p>
                      </div>
                    }
                  />
                </Card>
              </Badge.Ribbon>
            );
          })}
        </div>
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
      <Modal
        title=""
        centered
        open={open.show}
        onOk={() => setOpen({ show: false, data: "" })}
        onCancel={() => setOpen({ show: false, data: "" })}
        width={1000}
      >
        <div dangerouslySetInnerHTML={{ __html: open.data }}></div>
      </Modal>
    </div>
  );
};

export default ScenarioList;
