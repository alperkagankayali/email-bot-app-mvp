"use client";

import { Link } from "@/i18n/routing";
import { fetchArticle, handleArticleDataChange } from "@/redux/slice/education";
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
  Tag,
} from "antd";
import Meta from "antd/es/card/Meta";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
  const data = useSelector((state: RootState) => state.education.article);
  const totalItems = useSelector(
    (state: RootState) => state.education.articleTotalItems
  );
  const [pageSize, setPageSize] = useState(10);
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchArticle(10));
    }
  }, [status, dispatch]);
  const handleDeletArticle = async (id: string) => {
    const res = await deleteArticle(id);
    dispatch(
      handleArticleDataChange(data?.filter((e) => e._id !== res.data?._id))
    );
  };

  const onChange: PaginationProps["onChange"] = async (page, pageNumber) => {
    const res = await getArticle(pageNumber, page);
    if (res.success && !!data) {
      dispatch(handleArticleDataChange(res.data));
    }
    setPageSize(pageNumber);
  };

  return (
    <>
      <div>
        <div className="flex justify-end ">
          <Link href="/dashboard/academy/article/add">
            <Button type="primary"> {t("menu-academy-article-add")}</Button>
          </Link>
        </div>
        <div>
          <div className="grid grid-cols-4 gap-8 mt-4">
            {data?.map((article) => {
              const actions: React.ReactNode[] = [
                <Link href={"/dashboard/academy/article/update/" + article._id}>
                  <EditOutlined key="edit" />
                </Link>,
                <EyeOutlined
                  key="ellipsis"
                  onClick={() => setOpen({ show: true, data: article.content })}
                />,
                <Popconfirm
                  title="Delete the article"
                  description="Are you sure to delete this article?"
                  onConfirm={() => handleDeletArticle(article._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined />
                </Popconfirm>,
              ];
              return (
                <Card
                  actions={actions}
                  key={article._id}
                  hoverable
                  loading={status === "loading"}
                  style={{ width: 240 }}
                >
                  <Meta
                    title={article.title}
                    description={
                      <>
                        <p className="line-clamp-3">{article.description}</p>
                        <Tag color="warning" className="mt-auto"> {article?.authorType === "superadmin" ? "Super Admin" : "Admin"}</Tag>
                      </>
                    }
                  />
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
    </>
  );
};

export default ArticleList;
