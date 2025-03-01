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
  fetchLandingPage,
  handleChangeLandingPage,
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
import {
  deleteEmailTemplate,
  getLandingPage,
} from "@/services/service/generalService";
import LandingPageFilter, { IFilter } from "./filter";

const { Meta } = Card;

const LandingPageList: React.FC = () => {
  const status = useSelector(
    (state: RootState) => state.scenario.landingPageStatus
  );
  const data = useSelector((state: RootState) => state.scenario.landingPage);
  const totalItems = useSelector(
    (state: RootState) => state.scenario.landingPageTotalItem
  );
  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslations("pages");
  const [pageSize, setPageSize] = useState(8);
  const user = useSelector((state: RootState) => state.user.user);
  const [isEdit, setIsEdit] = useState({
    show: false,
    id: "",
  });
  const [filter, setFilter] = useState<IFilter>({
    name: "",
    authorType: [],
  });
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [open, setOpen] = useState({
    show: false,
    data: "",
  });

  const handleDeleteLandingPage = async (id: string) => {
    const res = await deleteEmailTemplate(id);
    if (res.success) {
      dispatch(fetchLandingPage({ limit: pageSize, page }));
      notification.success({ message: t(res.message) });
    }
  };

  const onChange: PaginationProps["onChange"] = async (page, pageNumber) => {
    const res = await getLandingPage({ limit: pageNumber, page });
    if (res.success && !!data) {
      dispatch(handleChangeLandingPage(res.data));
    }
    setPage(page);
    setPageSize(pageNumber);
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLandingPage({ limit: pageSize, page }));
    }
  }, [status, dispatch]);

  return (
    <div className="flex flex-col items-start">
      <div className="flex justify-end w-full">
        <LandingPageFilter
          isPage={true}
          filter={filter}
          setFilter={setFilter}
          page={page}
        />
        <Link
          href={"/dashboard/scenario/landing-page/add"}
          className="bg-[#181140] text-white px-4 w-56 flex items-center justify-center py-2 rounded-md"
        >
          {t("landing-page-add")}
        </Link>
      </div>

      <div className="grid grid-cols-3 xl:grid-cols-4 gap-4 2xl:grid-cols-4 mt-8 w-full">
        {data?.map((landingpage) => {
          let deleteIcon;
          let editIcon;
          if (
            user?.role === "admin" &&
            landingpage.authorType === "superadmin"
          ) {
            deleteIcon = (
              <Popover
                content={t("not-deleted", { name: t("menu-landing-pages") })}
                title={""}
              >
                <CloseCircleOutlined />
              </Popover>
            );
            editIcon = (
              <Button
                type="text"
                onClick={() =>
                  setIsEdit({ show: true, id: landingpage._id || "" })
                }
              >
                <EditOutlined key="edit" />
              </Button>
            );
          } else {
            deleteIcon = (
              <Popconfirm
                title={t("delete-document", {
                  document: t("menu-landing-pages"),
                })}
                description={t("delete-document-2", {
                  document: t("menu-landing-pages"),
                })}
                onConfirm={() => handleDeleteLandingPage(landingpage._id || "")}
                okText={t("yes-btn")}
                cancelText={t("no-btn")}
              >
                <DeleteOutlined />
              </Popconfirm>
            );
            editIcon = (
              <Link
                href={
                  "/dashboard/scenario/landing-page/update/" + landingpage._id
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
              onClick={() => setOpen({ show: true, data: landingpage.content })}
            />,
            deleteIcon,
          ];
          return (
            <Badge.Ribbon
              className="card-title-ribbon"
              color={landingpage?.authorType === "superadmin" ? "green" : "red"}
              text={
                landingpage?.authorType === "superadmin" ? "Global" : "Local"
              }
              key={landingpage._id}
            >
              <Card
                actions={actions}
                key={landingpage._id}
                hoverable
                loading={status === "loading"}
                style={{ width: 240 }}
                rootClassName="flex h-full"
                className="flex flex-col "
                cover={
                  <Image
                    width={240}
                    height={100}
                    className="h-30 object-contain bg-[#03162b]"
                    alt={landingpage.title}
                    src={
                      status === "loading" || !!!landingpage.img
                        ? noImage
                        : landingpage.img
                    }
                  />
                }
              >
                <Meta title={landingpage.title} />
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
        footer={[
          <Button key="back" onClick={() => setIsEdit({ show: false, id: "" })}>
            {t("cancel-btn")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              router.push(
                "/dashboard/scenario/landing-page/update/" + isEdit.id
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

export default LandingPageList;
