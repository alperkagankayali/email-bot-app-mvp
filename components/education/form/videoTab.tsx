"use client";

import { AppDispatch, RootState } from "@/redux/store";
import { Badge, Card, Modal, Pagination, Popconfirm } from "antd";
import type { PaginationProps } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVideo,
  handleAddEducationFormValue,
  handleVideoDataChange,
} from "@/redux/slice/education";
import clsx from "clsx";
import { Checkbox } from "antd";
import { deleteVideo, getVideo } from "@/services/service/educationService";
import { Link } from "@/i18n/routing";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import ContentFilter, { IFilter } from "@/components/academy/filter";

const CheckboxGroup = Checkbox.Group;
const { Meta } = Card;

type IProps = {
  lang: string;
};

const VideoTab = ({ lang }: IProps) => {
  const forms = useSelector((state: RootState) => state.education.forms);
  const [selected, setSelected] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.education.videoStatus);
  const data = useSelector((state: RootState) => state.education.videos);
  const totalItems = useSelector(
    (state: RootState) => state.education.videoTotalItems
  );
  const languages = useSelector((state: RootState) => state.language.language);
  const user = useSelector((state: RootState) => state.user.user);
  const [open, setOpen] = useState<{ show: boolean; data: any }>({
    show: false,
    data: {},
  });
  const [pageSize, setPageSize] = useState(8);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<IFilter>({
    name: "",
    authorType: [],
    language: languages.find((e) => e.code === lang)?._id ?? "",
  });

  useEffect(() => {
    dispatch(
      fetchVideo({
        limit: pageSize,
        page,
        language: languages.find((e) => e.code === lang)?._id ?? "",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (
      !!forms[lang]?.selectVideo &&
      (forms[lang]?.selectVideo as string[]).length > 0
    ) {
      setSelected(
        (forms[lang]?.selectVideo as Array<any>).map((e) => e?.refId)
      );
    }
  }, []);

  const onChangePagitnation: PaginationProps["onChange"] = async (
    page,
    pageNumber
  ) => {
    const res = await getVideo({
      limit: pageNumber,
      page,
      language: languages.find((e) => e.code === lang)?._id ?? "",
    });
    if (res.success && !!data) {
      dispatch(handleVideoDataChange(res.data));
    }
    setPage(page);
    setPageSize(pageNumber);
  };

  const handleDeleteVideo = async (id: string) => {
    const res = await deleteVideo(id);
    dispatch(
      handleVideoDataChange(data?.filter((e) => e._id !== res.data?._id))
    );
  };
  const t = useTranslations("pages");

  const onChangeVideoSelect = (e: string[]) => {
    const dataFormat = e.map((element: any) => {
      const findData = data.find((article) => article._id === element);
      return {
        type: "video",
        refId: findData?._id,
        order: 0,
        title: findData?.title,
        description: findData?.description,
      };
    });
    dispatch(
      handleAddEducationFormValue({
        language: lang,
        field: "selectVideo",
        value: dataFormat,
      })
    );
    setSelected(e);
  };

  const handleArticleFilter = async (
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
      <div className="mt-5 w-full">
        <div className="p-2">
          <ContentFilter
            page={page}
            isLanguage={false}
            handleGetContentFilter={handleArticleFilter}
            filter={filter}
            setFilter={setFilter}
          />
        </div>
        <CheckboxGroup
          onChange={onChangeVideoSelect}
          className={"card-checkbox !grid grid-cols-4 gap-10"}
          value={selected}
        >
          {data.map((video) => {
            const selectedVideo = selected.some((e) => e === video._id);
            const actions: React.ReactNode[] = [
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
            ];
            return (
              <Checkbox
                value={video._id}
                key={video._id}
                className="card-checkbox-check"
              >
                <Badge.Ribbon
                  color={video?.authorType === "superadmin" ? "green" : "red"}
                  text={video?.authorType === "superadmin" ? "Global" : "Local"}
                  key={video._id}
                >
                  <Card
                    className={clsx("!h-60 !pt-2", {
                      "!border !border-blue-700": selectedVideo,
                    })}
                    actions={actions}
                    key={video._id}
                    hoverable
                    loading={status === "loading"}
                    style={{
                      width: 240,
                      boxShadow: selectedVideo
                        ? "0 1px 2px -2px rgba(0, 0, 0, 0.16),0 3px 6px 0 rgba(0, 0, 0, 0.12),0 5px 12px 4px rgba(0, 0, 0, 0.09)"
                        : "inherit",
                    }}
                  >
                    <Meta
                      title={video.title}
                      className="!line-clamp-3"
                      description={video?.description}
                    />
                  </Card>
                </Badge.Ribbon>
              </Checkbox>
            );
          })}
        </CheckboxGroup>
      </div>
      <div className="mt-10 mb-20 w-full">
        {!!totalItems && (
          <Pagination
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
    </>
  );
};

export default VideoTab;
