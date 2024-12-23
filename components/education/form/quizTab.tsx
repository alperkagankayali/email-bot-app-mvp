"use client";

import { AppDispatch, RootState } from "@/redux/store";
import { Badge, Card, List, Modal, Pagination, Popconfirm, Radio } from "antd";
import type { PaginationProps, RadioChangeEvent } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuiz,
  handleQuizDataChange,
  handleAddEducationFormValue,
} from "@/redux/slice/education";
import clsx from "clsx";
import { Checkbox } from "antd";
import QuizForm from "./quizForm";
import { deleteQuiz, getQuiz } from "@/services/service/educationService";
import { Link } from "@/i18n/routing";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { IQuestion } from "@/types/quizType";
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

const QuizTab = ({ lang }: IProps) => {
  const [value, setValue] = useState("select");
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
  const [pageSize, setPageSize] = useState(8);
  const [open, setOpen] = useState<{ show: boolean; data: IQuestion[] }>({
    show: false,
    data: [],
  });
  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    setValue(value);
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchQuiz(6));
    }
  }, [status, dispatch]);

  const onChangePagination: PaginationProps["onChange"] = async (
    page,
    pageNumber
  ) => {
    const res = await getQuiz(pageNumber, page);
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
      <div className="mt-5 w-full">
        {value === "add" && (
          <>
            <QuizForm />
          </>
        )}

        {value === "select" && (
          <CheckboxGroup
            onChange={onChangeQuizSelect}
            className={"card-checkbox !grid grid-cols-3 gap-10"}
            value={selected}
          >
            {data.map((quiz) => {
              const selectedArticle = selected.some((e) => e === quiz._id);
              const actions: React.ReactNode[] = [
                <Link href={"/dashboard/academy/quiz/update/" + quiz._id}>
                  <EditOutlined key="edit" />
                </Link>,
                <EyeOutlined
                  key="ellipsis"
                  onClick={() => setOpen({ show: true, data: quiz.question })}
                />,
                <Popconfirm
                  title={t("delete-document")}
                  disabled={
                    quiz?.authorType === "superadmin" &&
                    user?.role !== "superadmin"
                  }
                  description={t("delete-document-2")}
                  onConfirm={() => handleDeletQuiz(quiz._id)}
                  okText={t("yes-btn")}
                  cancelText={t("no-btn")}
                >
                  <DeleteOutlined />
                </Popconfirm>,
              ];
              return (
                <Checkbox value={quiz._id} key={quiz._id}>
                  <Badge.Ribbon
                    color={quiz?.authorType === "superadmin" ? "green" : "red"}
                    text={
                      quiz?.authorType === "superadmin" ? "Global" : "Local"
                    }
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
        )}
        <div className="mt-10 mb-20 w-full">
          {!!totalItems && (
            <Pagination
              onChange={onChangePagination}
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
