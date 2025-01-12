"use client";
import React, { useEffect, useState } from "react";
import { Badge, Card, Modal, notification, Popconfirm, Popover } from "antd";
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
import type { GetProps } from "antd";
import { useSearchParams } from "next/navigation";
import { deleteScenario } from "@/services/service/scenarioService";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;
const { Option } = Select;
const { Meta } = Card;

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

  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    const params = new URLSearchParams(searchParams);
    if (value.length > 3) {
      params.set("name", value);
    } else {
      params.delete("name");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSelect = (value: string, type: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(type, value);
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
        scenarioType: searchParams.get("scenarioType") ?? "",
        limit: 10,
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

  return (
    <div className="flex flex-col items-start">
      <div className="flex justify-between w-full items-center">
        <div>
          <Link
            href={"/dashboard/scenario/add"}
            className="bg-[#1677ff] text-white px-4 py-2 rounded-md"
          >
            {t("menu-scenario-add")}
          </Link>
          <span className="ml-2">Total {totalItems} items</span>
        </div>

        {!!data && (
          <div className="flex items-center">
            <Search
              placeholder={t("input-scenario-name")}
              size="large"
              className="!w-72 mr-4 rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              allowClear
              onSearch={onSearch}
              enterButton
            />
            {!!scenarioType && (
              <Select
                size="large"
                className="w-50 "
                value={selectScenarioType}
                placeholder={t("scenario-type")}
                onChange={(value: string) => {
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
              className="w-36 !ml-4"
              placeholder="language"
              value={selectLanguage}
              onChange={(value: string) => {
                setSelectLanguage(value);
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
            <Popover content={t("clear-filter")} title="">
              <DeleteFilled
                className="ml-2 cursor-pointer"
                onClick={() => {
                  setSelectSecenariType("");
                  setSelectLanguage("");
                  replace(`${pathname}`);
                }}
              />
            </Popover>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-8 mt-4">
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
              text={scenario?.authorType === "superadmin" ? "Global" : "Local"}
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
