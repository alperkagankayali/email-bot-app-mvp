"use client";

import { AppDispatch, RootState } from "@/redux/store";
import ArticleForm from "./articleForm";
import { Badge, Card, Pagination, Popconfirm, Radio } from "antd";
import type { PaginationProps, RadioChangeEvent } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchArticle,
  handleArticleDataChange,
  handleAddEducationFormValue,
} from "@/redux/slice/education";
import clsx from "clsx";
import { Checkbox } from "antd";
import { deleteArticle, getArticle } from "@/services/service/educationService";
import { Link } from "@/i18n/routing";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

const CheckboxGroup = Checkbox.Group;
const { Meta } = Card;

type IProps = {
  lang: string;
};
const optionsWithDisabled = [
  { label: "Select", value: "select" },
  { label: "Add", value: "add" },
];

const ArticleTab = ({ lang }: IProps) => {
  const [value, setValue] = useState("select");
  const forms = useSelector((state: RootState) => state.education.forms);
  const [selected, setSelected] = useState<string[]>(
    (forms[lang]?.selectArticle as string[]) ?? []
  );
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(
    (state: RootState) => state.education.articleStatus
  );
  const data = useSelector((state: RootState) => state.education.article);
  const totalItems = useSelector(
    (state: RootState) => state.education.articleTotalItems
  );
  const user = useSelector((state: RootState) => state.user.user);
  const [pageSize, setPageSize] = useState(8);

  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    setValue(value);
  };
  const [open, setOpen] = useState({
    show: false,
    data: "",
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchArticle(8));
    }
  }, [status, dispatch]);

  const onChangePagination: PaginationProps["onChange"] = async (
    page,
    pageNumber
  ) => {
    const res = await getArticle(pageNumber, page);
    if (res.success && !!data) {
      dispatch(handleArticleDataChange(res.data));
    }
    setPageSize(pageNumber);
  };

  const handleDeletArticle = async (id: string) => {
    const res = await deleteArticle(id);
    dispatch(
      handleArticleDataChange(data?.filter((e) => e._id !== res.data?._id))
    );
  };
    const t = useTranslations("pages");
  

  const onChangeArticleSelect = (e: string[]) => {
    const dataFormat = e.map((element: any) => {
      const findArticle = data.find((article) => article._id === element);
      return {
        type: "article",
        refId: findArticle?._id,
        order: 0,
        title: findArticle?.title,
        description: findArticle?.description,
      };
    });
    dispatch(
      handleAddEducationFormValue({
        language: lang,
        field: "selectArticle",
        value: dataFormat,
      })
    );
    setSelected(e);
  };

  return (
    <>
      <Radio.Group
        block
        options={optionsWithDisabled}
        defaultValue="select"
        optionType="button"
        onChange={onChange}
        buttonStyle="solid"
      />
      <div className="mt-5">
        {value === "add" && <ArticleForm />}

        {value === "select" && (
          <CheckboxGroup
            onChange={onChangeArticleSelect}
            className={"card-checkbox !grid grid-cols-3 gap-10"}
            value={selected}
          >
            {data.map((article) => {
              const selectedArticle = selected.some((e) => e === article._id);
              const actions: React.ReactNode[] = [
                <Link href={"/dashboard/academy/article/update/" + article._id}>
                  <EditOutlined key="edit" />
                </Link>,
                <EyeOutlined
                  key="ellipsis"
                  onClick={() => setOpen({ show: true, data: article.content })}
                />,
                <Popconfirm
                  title={t("delete-document")}
                  description={t("delete-document-2")}
                  onConfirm={() => handleDeletArticle(article._id)}
                  okText={t("yes-btn")}
                  disabled={
                    article?.authorType === "superadmin" &&
                    user?.role !== "superadmin"
                  }
                  cancelText={t("no-btn")}
                >
                  <DeleteOutlined />
                </Popconfirm>,
              ];
              return (
                <Checkbox
                  value={article._id}
                  key={article._id}
                  className="card-checkbox-check"
                >
                  <Badge.Ribbon
                    color={
                      article?.authorType === "superadmin" ? "green" : "red"
                    }
                    text={
                      article?.authorType === "superadmin" ? "Global" : "Local"
                    }
                    key={article._id}
                  >
                    <Card
                      className={clsx("!h-full !pt-2", {
                        "!border !border-blue-700": selectedArticle,
                      })}
                      rootClassName="!flex !h-full"
                      key={article._id}
                      hoverable
                      actions={actions}
                      loading={status === "loading"}
                      style={{
                        width: 240,
                        boxShadow: selectedArticle
                          ? "0 1px 2px -2px rgba(0, 0, 0, 0.16),0 3px 6px 0 rgba(0, 0, 0, 0.12),0 5px 12px 4px rgba(0, 0, 0, 0.09)"
                          : "inherit",
                      }}
                    >
                      <Meta
                        title={article.title}
                        className="!line-clamp-3"
                        description={article?.description}
                      />
                    </Card>
                  </Badge.Ribbon>
                </Checkbox>
              );
            })}
          </CheckboxGroup>
        )}
        <div className="mt-10 mb-20 w-full">
          {!!totalItems && (
            <Pagination
              onChange={onChangePagination}
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
      </div>
    </>
  );
};

export default ArticleTab;
