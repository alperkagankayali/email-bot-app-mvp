"use client";
import React, { useEffect, useState } from "react";
import { Badge, Card, Modal, notification, Pagination, Popconfirm } from "antd";
import { noImage } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchScenario, fetchScenarioType } from "@/redux/slice/scenario";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import type { PaginationProps } from "antd";
import { useSearchParams } from "next/navigation";
import { deleteScenario } from "@/services/service/scenarioService";
import ScenarioListFilter from "./filter";

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
  const t = useTranslations("pages");
  const [open, setOpen] = useState({
    show: false,
    data: "",
  });
  const [filter, setFilter] = useState({
    name: searchParams.get("name") ?? "",
    scenarioType: searchParams.get("scenarioType") ?? "",
    authorType: searchParams.get("authorType")?.split("&") ?? [],
    language: searchParams.get("language") ?? "",
  });
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchScenario({ limit: pageSize, page: 1 }));
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (scenarioTypeStatus === "idle") {
      dispatch(fetchScenarioType());
    }
  }, [scenarioTypeStatus, dispatch]);

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

  const handleDeleteEmailTemplate = async (id: string) => {
    const res = await deleteScenario(id);
    if (res.success) {
      notification.success({ message: res.data?.title + " deleted" });
      dispatch(
        fetchScenario({
          name: searchParams.get("name") ?? "",
          language:
            languages.find((e) => e.code === searchParams.get("language"))
              ?._id ?? "",
          authorType: searchParams.get("authorType") ?? "",
          scenarioType:
            scenarioType?.find(
              (e) => e.title === searchParams.get("scenarioType")
            )?._id ?? "",
          limit: pageSize,
          page: 1,
        })
      );
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
    <div className="">
      <ScenarioListFilter
        filter={filter}
        setFilter={setFilter}
        pageSize={pageSize}
      />
      <div className="w-full">
        <div className="grid grid-cols-4 gap-4">
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
                      src={
                        status === "loading" || scenario.img === undefined
                          ? noImage
                          : scenario.img
                      }
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
