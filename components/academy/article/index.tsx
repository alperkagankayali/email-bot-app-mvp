"use client";

import { Link, useRouter } from "@/i18n/routing";
import { fetchArticle, handleArticleDataChange } from "@/redux/slice/education";
import { AppDispatch, RootState } from "@/redux/store";
import { deleteArticle, getArticle } from "@/services/service/educationService";
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
  Tag,
} from "antd";
import Meta from "antd/es/card/Meta";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContentFilter, { IFilter } from "../filter";

const ArticleList: React.FC = () => {
  const t = useTranslations("pages");
  const [open, setOpen] = useState({
    show: false,
    data: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(
    (state: RootState) => state.education.articleStatus
  );
  const user = useSelector((state: RootState) => state.user.user);
  const data = useSelector((state: RootState) => state.education.article);
  const totalItems = useSelector(
    (state: RootState) => state.education.articleTotalItems
  );
  const [filter, setFilter] = useState<IFilter>({
    name: "",
    authorType: [],
    language: "",
  });
  const router = useRouter();
  const [isEdit, setIsEdit] = useState({
    show: false,
    id: "",
  });
  const [pageSize, setPageSize] = useState(8);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchArticle({ limit: pageSize, page: page }));
    }
  }, [status, dispatch]);

  const handleDeletArticle = async (id: string) => {
    const res = await deleteArticle(id);
    dispatch(
      handleArticleDataChange(data?.filter((e) => e._id !== res.data?._id))
    );
  };

  const onChange: PaginationProps["onChange"] = async (page, pageNumber) => {
    const res = await getArticle({ limit: pageNumber, page });
    if (res.success && !!data) {
      dispatch(handleArticleDataChange(res.data));
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
        fetchArticle({
          limit: 8,
          page: page,
        })
      );
      setFilter({ name: "", authorType: [], language: "" });
    } else {
      dispatch(
        fetchArticle({
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
          <Link href="/dashboard/academy/article/add">
            <Button type="primary" className="!bg-[#181140] w-full">
              {" "}
              {t("menu-academy-article-add")}
            </Button>
          </Link>
        </div>
        <div>
          <div className="grid grid-cols-4 gap-8 mt-4">
            {data?.map((article) => {
              let deleteIcon;
              let editIcon;
              if (
                user?.role === "admin" &&
                article.authorType === "superadmin"
              ) {
                deleteIcon = (
                  <Popover
                    content={t("not-deleted", {
                      name: t("menu-academy-article"),
                    })}
                    title={""}
                  >
                    <CloseCircleOutlined />
                  </Popover>
                );
                editIcon = (
                  <Button
                    type="text"
                    onClick={() => setIsEdit({ show: true, id: article._id })}
                  >
                    <EditOutlined key="edit" />
                  </Button>
                );
              } else {
                deleteIcon = (
                  <Popconfirm
                    title={t("delete-document", {
                      document: t("menu-academy-article"),
                    })}
                    description={t("delete-document-2", {
                      document: t("menu-academy-article"),
                    })}
                    onConfirm={() => handleDeletArticle(article._id)}
                    okText={t("yes-btn")}
                    cancelText={t("no-btn")}
                  >
                    <DeleteOutlined />
                  </Popconfirm>
                );
                editIcon = (
                  <Link href={"/dashboard/academy/quiz/update/" + article._id}>
                    <EditOutlined key="edit" />
                  </Link>
                );
              }
              const actions: React.ReactNode[] = [
                editIcon,
                <EyeOutlined
                  key="ellipsis"
                  onClick={() => setOpen({ show: true, data: article.content })}
                />,
                deleteIcon,
              ];
              return (
                <Badge.Ribbon
                  className="card-title-ribbon"
                  color={article?.authorType === "superadmin" ? "green" : "red"}
                  text={
                    article?.authorType === "superadmin" ? "Global" : "Local"
                  }
                  key={article._id}
                >
                  <Card
                    actions={actions}
                    key={article._id}
                    rootClassName="h-full flex"
                    hoverable
                    loading={status === "loading"}
                    style={{ width: 240 }}
                    // title=" "
                  >
                    <Meta
                      title={article.title}
                      description={
                        <>
                          <p className="line-clamp-3">{article.description}</p>
                        </>
                      }
                    />
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
      <Modal
        title=""
        centered
        open={open.show}
        onOk={() => setOpen({ show: false, data: "" })}
        onCancel={() => setOpen({ show: false, data: "" })}
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
              router.push("/dashboard/academy/article/update/" + isEdit.id);
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

export default ArticleList;
