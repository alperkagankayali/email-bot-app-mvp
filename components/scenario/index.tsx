"use client";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Modal,
  notification,
  Pagination,
  Popconfirm,
  Popover,
} from "antd";
import { noImage } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchScenario, fetchScenarioType } from "@/redux/slice/scenario";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
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
  const user = useSelector((state: RootState) => state.user.user);
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
  const [page, setPage] = useState(1);
  const [isEdit, setIsEdit] = useState({
    show: false,
    id: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchScenario({ limit: pageSize, page: page }));
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

  const handleDeleteScenario = async (id: string) => {
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
          page: page,
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
    setPage(page);
  };

  return (
    <div className="">
      <ScenarioListFilter
        filter={filter}
        setPage={setPage}
        setFilter={setFilter}
        pageSize={pageSize}
      />
      <div className="w-full">
        <div className="grid grid-cols-3 xl:grid-cols-4 gap-4 2xl:grid-cols-4">
          {data?.map((scenario) => {
            let deleteIcon;
            let editIcon;
            if (
              user?.role === "admin" &&
              scenario.authorType === "superadmin"
            ) {
              deleteIcon = (
                <Popover
                  content={t("not-deleted", { name: t("menu-scenario") })}
                  title={""}
                >
                  <CloseCircleOutlined />
                </Popover>
              );
              editIcon = (
                <Button
                  type="text"
                  onClick={() => setIsEdit({ show: true, id: scenario._id })}
                >
                  <EditOutlined key="edit" />
                </Button>
              );
            } else {
              deleteIcon = (
                <Popconfirm
                  title={t("delete-document", {
                    document: t("menu-scenario"),
                  })}
                  description={t("delete-document-2", {
                    document: t("menu-scenario"),
                  })}
                  onConfirm={() => handleDeleteScenario(scenario._id)}
                  okText={t("yes-btn")}
                  cancelText={t("no-btn")}
                >
                  <DeleteOutlined />
                </Popconfirm>
              );
              editIcon = (
                <Link href={"/dashboard/scenario/update/" + scenario._id}>
                  <EditOutlined key="edit" />
                </Link>
              );
            }
            const actions: React.ReactNode[] = [
              editIcon,
              <EyeOutlined
                key="ellipsis"
                onClick={() =>
                  setOpen({
                    show: true,
                    data: scenario.emailTemplate?.content ?? "",
                  })
                }
              />,
              deleteIcon,
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
            current={page}
            onChange={onChangePagitnation}
            total={totalItems}
            pageSize={pageSize}
            showTotal={(total) => t("total-count", { count: total })}
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
        onClose={() => setOpen({ show: false, data: "" })}
        footer={[]}
        width={1000}
      >
        <div dangerouslySetInnerHTML={{ __html: open.data }}></div>
      </Modal>
      <Modal
        title=""
        key={"edit-modal"}
        centered
        open={isEdit.show}
        onCancel={() => setIsEdit({ show: false, id: "" })}
        onClose={() => setIsEdit({ show: false, id: "" })}
        footer={[
          <Button key="back" onClick={() => setIsEdit({ show: false, id: "" })}>
            {t("cancel-btn")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              router.push("/dashboard/scenario/update/" + isEdit.id);
              setIsEdit({ id: "", show: false });
            }}
          >
            {t("save-and-continue")}
          </Button>,
        ]}
      >
        <div className="p-5">
          <p>{t("global-edit-scenario")}</p>
        </div>
      </Modal>
    </div>
  );
};

export default ScenarioList;
