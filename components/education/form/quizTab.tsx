"use client";

import { AppDispatch, RootState } from "@/redux/store";
import { Badge, Card, List, Modal, Pagination, Popconfirm } from "antd";
import type { PaginationProps } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuiz,
  handleQuizDataChange,
  handleAddEducationFormValue,
} from "@/redux/slice/education";
import clsx from "clsx";
import { Checkbox } from "antd";
import { deleteQuiz, getQuiz } from "@/services/service/educationService";
import { Link } from "@/i18n/routing";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { IQuestion } from "@/types/quizType";
import { useTranslations } from "next-intl";
import ContentFilter, { IFilter } from "@/components/academy/filter";

const CheckboxGroup = Checkbox.Group;
const { Meta } = Card;

type IProps = {
  lang: string;
};

const QuizTab = ({ lang }: IProps) => {
  const forms = useSelector((state: RootState) => state.education.forms);
  const [selected, setSelected] = useState(
    (forms[lang]?.selectQuiz as string[]) ?? []
  );
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const status = useSelector((state: RootState) => state.education.quizStatus);
  const data = useSelector((state: RootState) => state.education.quiz);
  const totalItems = useSelector(
    (state: RootState) => state.education.quizTotalItems
  );
  const languages = useSelector((state: RootState) => state.language.language);
  const [filter, setFilter] = useState<IFilter>({
    name: "",
    authorType: [],
    language: languages.find((e) => e.code === lang)?._id ?? "",
  });

  const [pageSize, setPageSize] = useState(8);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<{ show: boolean; data: IQuestion[] }>({
    show: false,
    data: [],
  });

  useEffect(() => {
    dispatch(
      fetchQuiz({
        limit: pageSize,
        page,
        language: languages.find((e) => e.code === lang)?._id ?? "",
      })
    );
  }, [dispatch]);

  const onChangePagination: PaginationProps["onChange"] = async (
    page,
    pageNumber
  ) => {
    const res = await getQuiz({ limit: pageNumber, page });
    if (res.success && !!data) {
      dispatch(handleQuizDataChange(res.data));
    }
    setPageSize(pageNumber);
  };

  const handleDeletQuiz = async (id: string) => {
    const res = await deleteQuiz(id);
    dispatch(
      handleQuizDataChange(data?.filter((e) => e._id !== res.data?._id))
    );
  };
  const t = useTranslations("pages");

  const onChangeQuizSelect = (e: string[]) => {
    const dataFormat = e.map((element: any) => {
      const findData = data.find((article) => article._id === element);
      return {
        type: "quiz",
        refId: findData?._id,
        order: 0,
        title: findData?.title,
        description: findData?.description,
      };
    });
    dispatch(
      handleAddEducationFormValue({
        language: lang,
        field: "selectQuiz",
        value: dataFormat,
      })
    );
    setSelected(e);
  };

  useEffect(() => {
    if (
      !!forms[lang]?.selectQuiz &&
      (forms[lang]?.selectQuiz as string[]).length > 0
    ) {
      setSelected(
        (forms[lang]?.selectQuiz as Array<any>).map((e) => e?.refId)
      );
    }
  }, []);

  const handleArticleFilter = async (
    key: string,
    value: string | string[],
    isDelete?: boolean
  ) => {
    if (isDelete) {
      dispatch(
        fetchQuiz({
          limit: 8,
          page: page,
        })
      );
      setFilter({ name: "", authorType: [], language: "" });
    } else {
      dispatch(
        fetchQuiz({
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
          onChange={onChangeQuizSelect}
          className={"card-checkbox !grid grid-cols-3 gap-10"}
          value={selected}
        >
          {data.map((quiz) => {
            const selectedArticle = selected.some((e) => e === quiz._id);
            const actions: React.ReactNode[] = [
              <EyeOutlined
                key="ellipsis"
                onClick={() => setOpen({ show: true, data: quiz.question })}
              />,
            ];
            return (
              <Checkbox value={quiz._id} key={quiz._id}>
                <Badge.Ribbon
                  color={quiz?.authorType === "superadmin" ? "green" : "red"}
                  text={quiz?.authorType === "superadmin" ? "Global" : "Local"}
                  key={quiz._id}
                >
                  <Card
                    className={clsx("!h-60 !pt-2", {
                      "!border !border-blue-700": selectedArticle,
                    })}
                    actions={actions}
                    key={quiz._id}
                    hoverable
                    loading={status === "loading"}
                    style={{
                      width: 240,
                      boxShadow: selectedArticle
                        ? "0 1px 2px -2px rgba(0, 0, 0, 0.16),0 3px 6px 0 rgba(0, 0, 0, 0.12),0 5px 12px 4px rgba(0, 0, 0, 0.09)"
                        : "inherit",
                    }}
                  >
                    <Meta
                      title={quiz.title}
                      className="!line-clamp-3"
                      description={quiz?.description}
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
        onOk={() => setOpen({ show: false, data: [] })}
        onCancel={() => setOpen({ show: false, data: [] })}
        width={1000}
      >
        <List
          size="large"
          // header={<div>Questions</div>}
          // footer={<div>Footer</div>}
          bordered
          dataSource={open.data}
          renderItem={(item) => {
            return (
              <List.Item className="!flex-col">
                <p>{item.title}</p>
                <ul className="flex flex-row list-disc justify-between w-full mt-6">
                  {item.options.map((e) => (
                    <li>{e}</li>
                  ))}
                </ul>
                <p className="text-red-900 my-6">
                  answer:{" "}
                  {item.answer.map((e) => (
                    <p>{e}</p>
                  ))}
                </p>
              </List.Item>
            );
          }}
        />
      </Modal>
    </>
  );
};

export default QuizTab;
