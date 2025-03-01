"use client";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Modal,
  notification,
  PaginationProps,
  Popconfirm,
  Popover,
} from "antd";
import { noImage } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchEmailTemplate,
  handleChangeEmailData,
} from "@/redux/slice/scenario";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Pagination } from "antd";
import {
  deleteEmailTemplate,
  getEmailTemplate,
} from "@/services/service/generalService";
import EmailTemplateFilter from "./filter";
import { useSearchParams } from "next/navigation";

const { Meta } = Card;

const EmailTemplateList: React.FC = () => {
  const status = useSelector(
    (state: RootState) => state.scenario.emailTemplateStatus
  );
  const data = useSelector((state: RootState) => state.scenario.emailTemplate);
  const totalItems = useSelector(
    (state: RootState) => state.scenario.emailTemplateTotalItem
  );
  const user = useSelector((state: RootState) => state.user.user);
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState({
    name: searchParams.get("name") ?? "",
    authorType: searchParams.get("authorType")?.split("&") ?? [],
    language: searchParams.get("language") ?? "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const [isEdit, setIsEdit] = useState({
    show: false,
    id: "",
  });
  const router = useRouter();
  const [open, setOpen] = useState({
    show: false,
    data: "",
  });
  const [pageSize, setPageSize] = useState(8);
  const t = useTranslations("pages");
  const [page, setPage] = useState(1);
  const onChange: PaginationProps["onChange"] = async (page, pageNumber) => {
    const res = await getEmailTemplate({ limit: pageNumber, page: page });
    if (res.success && !!data) {
      dispatch(handleChangeEmailData(res.data));
    }
    setPage(page);
    setPageSize(pageNumber);
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEmailTemplate({ limit: 8, page: page }));
    }
  }, [status, dispatch]);

  const handleDeleteEmailTemplate = async (id: string) => {
    const res = await deleteEmailTemplate(id);
    if (res.success) {
      dispatch(fetchEmailTemplate({ limit: 8, page: page }));
      notification.success({ message: t(res.message) });
    }
  };

  return (
    <div className="flex flex-col items-start">
      <EmailTemplateFilter
        filter={filter}
        pageSize={page}
        isPage={true}
        setFilter={setFilter}
      />
      <div className="grid grid-cols-3 xl:grid-cols-4 gap-4 2xl:grid-cols-4 mt-4 w-full">
        {data?.map((emailTemplate) => {
          let deleteIcon;
          let editIcon;
          if (
            user?.role === "admin" &&
            emailTemplate.authorType === "superadmin"
          ) {
            deleteIcon = (
              <Popover
                content={t("not-deleted", { name: t("menu-mail") })}
                title={""}
              >
                <CloseCircleOutlined />
              </Popover>
            );
            editIcon = (
              <Button
                type="text"
                onClick={() => setIsEdit({ show: true, id: emailTemplate._id })}
              >
                <EditOutlined key="edit" />
              </Button>
            );
          } else {
            deleteIcon = (
              <Popconfirm
                title={t("delete-document", {
                  document: t("menu-mail"),
                })}
                description={t("delete-document-2", {
                  document: t("menu-mail"),
                })}
                onConfirm={() => handleDeleteEmailTemplate(emailTemplate._id)}
                okText={t("yes-btn")}
                cancelText={t("no-btn")}
              >
                <DeleteOutlined />
              </Popconfirm>
            );
            editIcon = (
              <Link
                href={
                  "/dashboard/scenario/email-templates/update/" +
                  emailTemplate._id
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
              onClick={() =>
                setOpen({ show: true, data: emailTemplate.content })
              }
            />,
            deleteIcon,
          ];
          return (
            <Badge.Ribbon
              className="card-title-ribbon"
              color={
                emailTemplate?.authorType === "superadmin" ? "green" : "red"
              }
              text={
                emailTemplate?.authorType === "superadmin" ? "Global" : "Local"
              }
              key={emailTemplate._id}
            >
              <Card
                actions={actions}
                key={emailTemplate._id}
                hoverable
                rootClassName="flex h-full"
                className="flex flex-col "
                loading={status === "loading"}
                style={{ width: 240 }}
                cover={
                  <Image
                    width={240}
                    height={100}
                    className="h-30 object-contain bg-[#03162b]"
                    alt={emailTemplate.title}
                    src={
                      status === "loading" || !!!emailTemplate.img
                        ? noImage
                        : emailTemplate.img
                    }
                  />
                }
              >
                <Meta title={emailTemplate.title} />
              </Card>
            </Badge.Ribbon>
          );
        })}
      </div>
      <div className="mt-10 mb-20 w-full">
        {!!totalItems && (
          <Pagination
            onChange={onChange}
            total={totalItems}
            current={page}
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
        footer={[]}
        width={"auto"}
      >
        <div className="w-auto min-w-[520px] overflow-auto min-h-75 max-h-[600px]" dangerouslySetInnerHTML={{ __html: open.data }}></div>
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
              router.push(
                "/dashboard/scenario/email-templates/update/" + isEdit.id
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

export default EmailTemplateList;
