"use client";

import { AppDispatch, RootState } from "@/redux/store";
import { Badge, Card, Modal, Pagination } from "antd";
import type { PaginationProps } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchArticle,
  handleArticleDataChange,
  handleAddEducationFormValue,
} from "@/redux/slice/education";
import clsx from "clsx";
import { Checkbox } from "antd";
import {  getArticle } from "@/services/service/educationService";
import {  EyeOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import ContentFilter, { IFilter } from "@/components/academy/filter";

const CheckboxGroup = Checkbox.Group;
const { Meta } = Card;

type IProps = {
  lang: string;
};

const ArticleTab = ({ lang }: IProps) => {
  const forms = useSelector((state: RootState) => state.education.forms);
  const [selected, setSelected] = useState<string[]>(
    (forms[lang]?.selectArticle as string[]) ?? []
  );
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(
    (state: RootState) => state.education.articleStatus
  );
  const data = useSelector((state: RootState) => state.education.article);
  const languages = useSelector((state: RootState) => state.language.language);
  const totalItems = useSelector(
    (state: RootState) => state.education.articleTotalItems
  );
  const [filter, setFilter] = useState<IFilter>({
    name: "",
    authorType: [],
    language: languages.find((e) => e.code === lang)?._id ?? "",
  });

  const [pageSize, setPageSize] = useState(8);
  const [page, setPage] = useState(1);
  const t = useTranslations("pages");
  const [open, setOpen] = useState({
    show: false,
    data: "",
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(
        fetchArticle({
          limit: pageSize,
          page,
          language: languages.find((e) => e.code === lang)?._id ?? "",
        })
      );
    }
  }, [status, dispatch]);

  const onChangePagination: PaginationProps["onChange"] = async (
    page,
    pageNumber
  ) => {
    const res = await getArticle({
      limit: pageNumber,
      page,
      language: languages.find((e) => e.code === lang)?._id ?? "",
    });
    if (res.success && !!data) {
      dispatch(handleArticleDataChange(res.data));
    }
    setPage(page);
    setPageSize(pageNumber);
  };

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
      <div className="mt-5">
        <div className="p-2">
          <ContentFilter
            page={page}
            isLanguage={false}
            handleGetContentFilter={handleGetQuizFilter}
            filter={filter}
            setFilter={setFilter}
          />
        </div>
        <CheckboxGroup
          onChange={onChangeArticleSelect}
          className={"card-checkbox !grid grid-cols-4 gap-10"}
          value={selected}
        >
          {data.map((article) => {
            const selectedArticle = selected.some((e) => e === article._id);
            const actions: React.ReactNode[] = [
              <EyeOutlined
                key="ellipsis"
                className="z-9999"
                onClick={() => setOpen({ show: true, data: article.content })}
              />,
            ];
            return (
              <Checkbox
                value={article._id}
                key={article._id}
                className="card-checkbox-check"
              >
                <Badge.Ribbon
                  color={article?.authorType === "superadmin" ? "green" : "red"}
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
      <Modal
        title=""
        centered
        open={open.show}
        onOk={() => setOpen({ show: false, data: "" })}
        onCancel={() => setOpen({ show: false, data: "" })}
      >
        <div dangerouslySetInnerHTML={{ __html: open.data }}></div>
      </Modal>
    </>
  );
};

export default ArticleTab;
