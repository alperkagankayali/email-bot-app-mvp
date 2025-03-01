"use client";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Modal,
  notification,
  Pagination,
  PaginationProps,
  Popconfirm,
  Popover,
} from "antd";
import { noImage } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchDataEntry,
  fetchEmailTemplate,
  handleChangeDataEntry,
} from "@/redux/slice/scenario";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { IFilter } from "../landingPage/filter";
import {
  deleteLandingPage,
  getDataEntries,
} from "@/services/service/generalService";
import DataEntryFilter from "./filter";

const { Meta } = Card;

const DataEntriesList: React.FC = () => {
  const status = useSelector(
    (state: RootState) => state.scenario.dataEntryStatus
  );
  const data = useSelector((state: RootState) => state.scenario.dataEntries);
  const totalItems = useSelector(
    (state: RootState) => state.scenario.dataEntryTotalItem
  );
  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslations("pages");
  const user = useSelector((state: RootState) => state.user.user);
  const [isEdit, setIsEdit] = useState({
    show: false,
    id: "",
  });
  const [filter, setFilter] = useState<IFilter>({
    name: "",
    authorType: [],
  });
  const [pageSize, setPageSize] = useState(8);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [open, setOpen] = useState({
    show: false,
    data: "",
  });

  const onChange: PaginationProps["onChange"] = async (page, pageNumber) => {
    dispatch(fetchDataEntry({ limit: pageSize, page }));
    setPage(page);
    setPageSize(pageNumber);
  };

  const handleDeleteDataEntry = async (id: string) => {
    const res = await deleteLandingPage(id);
    if (res.success) {
      dispatch(fetchDataEntry({ limit: pageSize, page }));
      notification.success({ message: t(res.message) });
    }
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDataEntry({ limit: pageSize, page }));
    }
  }, [status, dispatch]);

  return (
    <div className="flex flex-col items-start">
      <div className="flex justify-end w-full">
        <DataEntryFilter
          isPage={true}
          filter={filter}
          setFilter={setFilter}
          page={page}
        />
        <Link
          href={"/dashboard/scenario/data-entries/add"}
          className="bg-[#181140] text-white w-48 flex items-center justify-center px-4 py-2 rounded-md"
        >
          {t("data-entry-add")}
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-8 mt-4">
        {data?.map((dataEntry) => {
          let deleteIcon;
          let editIcon;
          if (user?.role === "admin" && dataEntry.authorType === "superadmin") {
            deleteIcon = (
              <Popover
                content={t("not-deleted", { name: t("menu-data-entries") })}
                title={""}
              >
                <CloseCircleOutlined />
              </Popover>
            );
            editIcon = (
              <Button
                type="text"
                onClick={() =>
                  setIsEdit({ show: true, id: dataEntry._id || "" })
                }
              >
                <EditOutlined key="edit" />
              </Button>
            );
          } else {
            deleteIcon = (
              <Popconfirm
                title={t("delete-document", {
                  document: t("menu-data-entries"),
                })}
                description={t("delete-document-2", {
                  document: t("menu-data-entries"),
                })}
                onConfirm={() => handleDeleteDataEntry(dataEntry._id || "")}
                okText={t("yes-btn")}
                cancelText={t("no-btn")}
              >
                <DeleteOutlined />
              </Popconfirm>
            );
            editIcon = (
              <Link
                href={
                  "/dashboard/scenario/data-entries/update/" + dataEntry._id
                }
              >
                <EditOutlined key="edit" />
              </Link>
            );
          }
          const actions: React.ReactNode[] = [
            editIcon,
            <EyeOutlined
              key="ellipsis"
              onClick={() => setOpen({ show: true, data: dataEntry.content })}
            />,
            deleteIcon,
          ];
          return (
            <Badge.Ribbon
              className="card-title-ribbon"
              color={dataEntry?.authorType === "superadmin" ? "green" : "red"}
              text={dataEntry?.authorType === "superadmin" ? "Global" : "Local"}
              key={dataEntry._id}
            >
              <Card
                actions={actions}
                key={dataEntry._id}
                hoverable
                loading={status === "loading"}
                rootClassName="flex h-full"
                style={{ width: 240 }}
                cover={
                  <Image
                    width={240}
                    height={100}
                    className="h-30 object-contain bg-[#03162b]"
                    alt={dataEntry.title}
                    src={
                      status === "loading" || !!!dataEntry.img
                        ? noImage
                        : dataEntry.img
                    }
                  />
                }
              >
                <Meta title={dataEntry.title} />
              </Card>
            </Badge.Ribbon>
          );
        })}
      </div>
      <div className="mt-10 mb-20 w-full">
        {!!data && (
          <Pagination
            onChange={onChange}
            total={totalItems}
            pageSize={pageSize}
            showTotal={(total) => t("total-count", { count: total })}
            showSizeChanger
            defaultPageSize={6}
            align="center"
            pageSizeOptions={[6, 12, 18]}
          />
        )}
      </div>
      <Modal
        title=""
        centered
        open={open.show}
        onOk={() => setOpen({ show: false, data: "" })}
        onCancel={() => setOpen({ show: false, data: "" })}
        footer={[]}
        width={"auto"}
      >
        <div
          className="w-auto min-w-[520px] overflow-auto min-h-75 max-h-[600px]"
          dangerouslySetInnerHTML={{ __html: open.data }}
        ></div>
      </Modal>
      <Modal
        title=""
        key={"edit-modal"}
        centered
        open={isEdit.show}
        onCancel={() => setIsEdit({ show: false, id: "" })}
        onClose={() => setIsEdit({ show: false, id: "" })}
        className="min-w-[620px]"
        footer={[
          <Button key="back" onClick={() => setIsEdit({ show: false, id: "" })}>
            {t("cancel-btn")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              router.push(
                "/dashboard/scenario/data-entries/update/" + isEdit.id
              );
              setIsEdit({ id: "", show: false });
            }}
          >
            {t("save-and-continue")}
          </Button>,
        ]}
      >
        <div className="p-5">
          <p className="leading-5">{t("global-edit-content")}</p>
        </div>
      </Modal>
    </div>
  );
};

export default DataEntriesList;
