"use client";

import { Link } from "@/i18n/routing";
import {
  fetchArticle,
  fetchVideo,
  handleArticleDataChange,
  handleVideoDataChange,
} from "@/redux/slice/education";
import { AppDispatch, RootState } from "@/redux/store";
import { deleteArticle, getArticle } from "@/services/service/educationService";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Modal,
  Pagination,
  PaginationProps,
  Popconfirm,
} from "antd";
import Meta from "antd/es/card/Meta";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const VideoList: React.FC = () => {
  const t = useTranslations("pages");
  const [open, setOpen] = useState({
    show: false,
    data: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.education.videoStatus);
  const data = useSelector((state: RootState) => state.education.videos);
  const totalItems = useSelector(
    (state: RootState) => state.education.videoTotalItems
  );
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchVideo(10));
    }
  }, [status, dispatch]);
  const handleDeletArticle = async (id: string) => {
    const res = await deleteArticle(id);
    dispatch(
      handleVideoDataChange(data?.filter((e) => e._id !== res.data?._id))
    );
  };

  const onChange: PaginationProps["onChange"] = async (page, pageNumber) => {
    const res = await getArticle(pageNumber, page);
    if (res.success && !!data) {
      dispatch(handleVideoDataChange(res.data));
    }
    setPageSize(pageNumber);
  };

  return (
    <>
      <div>
        <div className="flex justify-end ">
          <Link href="/dashboard/academy/video/add">
            <Button type="primary"> {t("menu-academy-video-add")}</Button>
          </Link>
        </div>
        <div>
          <div className="grid grid-cols-4 gap-8 mt-4">
            {data?.map((video) => {
              const actions: React.ReactNode[] = [
                <Link href={"/dashboard/academy/video/update/" + video._id}>
                  <EditOutlined key="edit" />
                </Link>,
                <EyeOutlined
                  key="ellipsis"
                  onClick={() => setOpen({ show: true, data: video.videolink })}
                />,
                <Popconfirm
                  title="Delete the article"
                  description="Are you sure to delete this article?"
                  onConfirm={() => handleDeletArticle(video._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined />
                </Popconfirm>,
              ];
              return (
                <Card
                  actions={actions}
                  key={video._id}
                  hoverable
                  loading={status === "loading"}
                  style={{ width: 240 }}
                >
                  <Meta title={video.title} description={video.description} />
                </Card>
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
            showTotal={(total) => `Total ${total} items`}
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
          onOk={() => setOpen({ show: false, data: "" })}
          onCancel={() => setOpen({ show: false, data: "" })}
          width={1000}
        >
          {!!open.data && (
            <video
              width="1000"
              height="240"
              controls
              preload="none"
              className="max-h-96"
            >
              <source src={open.data} type="video/mp4" />
              <track
                src="/path/to/captions.vtt"
                kind="subtitles"
                srcLang="en"
                label="English"
              />
              {open.data}
            </video>
          )}
        </Modal>
      )}
    </>
  );
};

export default VideoList;
