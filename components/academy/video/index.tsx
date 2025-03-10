"use client";

import { Link, useRouter } from "@/i18n/routing";
import {
  fetchArticle,
  fetchVideo,
  handleArticleDataChange,
  handleVideoDataChange,
} from "@/redux/slice/education";
import { AppDispatch, RootState } from "@/redux/store";
import {
  deleteArticle,
  deleteVideo,
  getArticle,
  getVideo,
} from "@/services/service/educationService";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Modal,
  Pagination,
  PaginationProps,
  Popconfirm,
  Popover,
} from "antd";
import Meta from "antd/es/card/Meta";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContentFilter, { IFilter } from "../filter";

const VideoList: React.FC = () => {
  const t = useTranslations("pages");
  const [open, setOpen] = useState<{ show: boolean; data: any }>({
    show: false,
    data: {},
  });
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.education.videoStatus);
  const data = useSelector((state: RootState) => state.education.videos);
  const totalItems = useSelector(
    (state: RootState) => state.education.videoTotalItems
  );
  const user = useSelector((state: RootState) => state.user.user);
  const [pageSize, setPageSize] = useState(8);
  const [page, setPage] = useState(1);
  const [isEdit, setIsEdit] = useState({
    show: false,
    id: "",
  });
  const [filter, setFilter] = useState<IFilter>({
    name: "",
    authorType: [],
    language: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchVideo(10));
    }
  }, [status, dispatch]);

  const handleDeleteVideo = async (id: string) => {
    const res = await deleteVideo(id);
    dispatch(
      handleVideoDataChange(data?.filter((e) => e._id !== res.data?._id))
    );
  };

  const onChange: PaginationProps["onChange"] = async (page, pageNumber) => {
    const res = await getVideo({ limit: pageNumber, page });
    if (res.success && !!data) {
      dispatch(handleVideoDataChange(res.data));
    }
    setPage(page);
    setPageSize(pageNumber);
  };

  const handleGetQuizFilter = async (
    key: string,
    value: string | string[],
    isDelete?: boolean
  ) => {
    if (isDelete) {
      dispatch(
        fetchVideo({
          limit: 8,
          page: page,
        })
      );
      setFilter({ name: "", authorType: [], language: "" });
    } else {
      dispatch(
        fetchVideo({
          limit: 8,
          page: page,
          ...filter,
          [key]: value,
        })
      );
      setFilter({ ...filter, [key]: value });
    }
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center ">
          <ContentFilter
            page={1}
            handleGetContentFilter={handleGetQuizFilter}
            filter={filter}
            setFilter={setFilter}
          />
          <Link href="/dashboard/academy/video/add">
            <Button type="primary" className="!bg-[#181140] w-full">
              {" "}
              {t("menu-academy-video-add")}
            </Button>
          </Link>
        </div>
        <div>
          <div className="grid grid-cols-4 gap-8 mt-4">
            {data?.map((video) => {
              let deleteIcon;
              let editIcon;
              if (user?.role === "admin" && video.authorType === "superadmin") {
                deleteIcon = (
                  <Popover
                    content={t("not-deleted", {
                      name: t("menu-academy-video"),
                    })}
                    title={""}
                  >
                    <CloseCircleOutlined />
                  </Popover>
                );
                editIcon = (
                  <Button
                    type="text"
                    onClick={() => setIsEdit({ show: true, id: video._id })}
                  >
                    <EditOutlined key="edit" />
                  </Button>
                );
              } else {
                deleteIcon = (
                  <Popconfirm
                    title={t("delete-document", {
                      document: t("menu-academy-video"),
                    })}
                    description={t("delete-document-2", {
                      document: t("menu-academy-video"),
                    })}
                    onConfirm={() => handleDeleteVideo(video._id)}
                    okText={t("yes-btn")}
                    cancelText={t("no-btn")}
                  >
                    <DeleteOutlined />
                  </Popconfirm>
                );
                editIcon = (
                  <Link href={"/dashboard/academy/video/update/" + video._id}>
                    <EditOutlined key="edit" />
                  </Link>
                );
              }
              const actions: React.ReactNode[] = [
                editIcon,
                <EyeOutlined
                  key="ellipsis"
                  onClick={() => {
                    setOpen({
                      show: true,
                      data: {
                        link: video.videolink,
                        title: video.title,
                        description: video.description,
                      },
                    });
                  }}
                />,
                deleteIcon,
              ];
              return (
                <Badge.Ribbon
                  className="card-title-ribbon"
                  color={video?.authorType === "superadmin" ? "green" : "red"}
                  text={video?.authorType === "superadmin" ? "Global" : "Local"}
                  key={video._id}
                >
                  <Card
                    actions={actions}
                    key={video._id}
                    rootClassName="flex h-full"
                    hoverable
                    loading={status === "loading"}
                    style={{ width: 240 }}
                  >
                    <Meta title={video.title} description={video.description} />
                  </Card>
                </Badge.Ribbon>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-10 mb-20 w-full">
        {!!totalItems && (
          <Pagination
            onChange={onChange}
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
      {open.show && (
        <Modal
          title=""
          centered
          open={open.show}
          onOk={() => setOpen({ show: false, data: {} })}
          onCancel={() => setOpen({ show: false, data: {} })}
          width={1000}
        >
          {Object.keys(open.data).length > 0 && (
            <div>
              <Meta
                title={open.data.title}
                description={open.data.description}
                className="mb-4"
              />
              <video
                width="1000"
                height="240"
                controls
                preload="none"
                className="max-h-96"
              >
                <source src={open.data.link} type="video/mp4" />
                <track
                  src="/path/to/captions.vtt"
                  kind="subtitles"
                  srcLang="en"
                  label="English"
                />
                {open.data.link}
              </video>
            </div>
          )}
        </Modal>
      )}
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
              router.push("/dashboard/academy/video/update/" + isEdit.id);
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
    </>
  );
};

export default VideoList;
