"use client";

import { Link, useRouter } from "@/i18n/routing";
import { fetchQuiz, handleQuizDataChange } from "@/redux/slice/education";
import { AppDispatch, RootState } from "@/redux/store";
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
  List,
  Modal,
  notification,
  Pagination,
  PaginationProps,
  Popconfirm,
  Popover,
} from "antd";
import Meta from "antd/es/card/Meta";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IQuestion } from "@/types/quizType";
import { deleteQuiz, getQuiz } from "@/services/service/educationService";
import ContentFilter, { IFilter } from "../filter";

const QuizList: React.FC = () => {
  const t = useTranslations("pages");
  const [open, setOpen] = useState<{ show: boolean; data: IQuestion[] }>({
    show: false,
    data: [],
  });
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.education.quizStatus);
  const user = useSelector((state: RootState) => state.user.user);
  const data = useSelector((state: RootState) => state.education.quiz);
  const totalItems = useSelector(
    (state: RootState) => state.education.quizTotalItems
  );
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
    dispatch(fetchQuiz({ limit: 8, page: 1 }));
  }, [dispatch]);

  const handleDeletQuiz = async (id: string) => {
    const res = await deleteQuiz(id);
    if (res.success) {
      notification.success({ message: t(res.message) });
      dispatch(fetchQuiz({ limit: pageSize, page: page }));
    } else {
      notification.error({ message: t(res.message) });
    }
  };

  const onChange: PaginationProps["onChange"] = async (page, pageNumber) => {
    const res = await getQuiz({ limit: pageNumber, page });
    if (res.success && !!data) {
      dispatch(handleQuizDataChange(res.data));
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
      <div>
        <div className="flex justify-between items-center ">
          <ContentFilter
            page={1}
            handleGetContentFilter={handleGetQuizFilter}
            filter={filter}
            setFilter={setFilter}
          />
          <Link href="/dashboard/academy/quiz/add">
            <Button type="primary" className="!bg-[#181140] w-full">
              {" "}
              {t("menu-academy-quiz-add")}
            </Button>
          </Link>
        </div>
        <div className="min-h-115">
          <div className="grid grid-cols-4 gap-8 mt-4">
            {data?.map((quiz) => {
              let deleteIcon;
              let editIcon;
              if (user?.role === "admin" && quiz.authorType === "superadmin") {
                deleteIcon = (
                  <Popover
                    content={t("not-deleted", { name: t("menu-academy-quiz") })}
                    title={""}
                  >
                    <CloseCircleOutlined />
                  </Popover>
                );
                editIcon = (
                  <Button
                    type="text"
                    onClick={() => setIsEdit({ show: true, id: quiz._id })}
                  >
                    <EditOutlined key="edit" />
                  </Button>
                );
              } else {
                deleteIcon = (
                  <Popconfirm
                    title={t("delete-document", {
                      document: t("menu-academy-quiz"),
                    })}
                    description={t("delete-document-2", {
                      document: t("menu-academy-quiz"),
                    })}
                    onConfirm={() => handleDeletQuiz(quiz._id)}
                    okText={t("yes-btn")}
                    cancelText={t("no-btn")}
                  >
                    <DeleteOutlined />
                  </Popconfirm>
                );
                editIcon = (
                  <Link href={"/dashboard/academy/quiz/update/" + quiz._id}>
                    <EditOutlined key="edit" />
                  </Link>
                );
              }

              const actions: React.ReactNode[] = [
                editIcon,
                <EyeOutlined
                  key="ellipsis"
                  onClick={() => setOpen({ show: true, data: quiz.question })}
                />,
                deleteIcon,
              ];
              return (
                <Badge.Ribbon
                  className="card-title-ribbon"
                  color={quiz?.authorType === "superadmin" ? "green" : "red"}
                  text={quiz?.authorType === "superadmin" ? "Global" : "Local"}
                  key={quiz._id}
                >
                  <Card
                    actions={actions}
                    key={quiz._id}
                    hoverable
                    rootClassName="flex h-full"
                    loading={status === "loading"}
                    style={{ width: 240 }}
                  >
                    <Meta title={quiz.title} description={quiz.description} />
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
          className="itemssadas"
          renderItem={(item) => {
            return (
              <List.Item className="!flex-col">
                <p>{item.title}</p>
                <ul className="list-disc justify-between w-full mt-6">
                  {item.options.map((e) => (
                    <li>{e}</li>
                  ))}
                </ul>
                <div className="text-red-900 my-6 flex gap-3">
                  answer:{" "}
                  {item.answer.map((e) => (
                    <p>{e}</p>
                  ))}
                </div>
              </List.Item>
            );
          }}
        />
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
              router.push("/dashboard/academy/quiz/update/" + isEdit.id);
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

export default QuizList;
