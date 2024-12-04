"use client";

import { Link } from "@/i18n/routing";
import { fetchQuiz, handleQuizDataChange } from "@/redux/slice/education";
import { AppDispatch, RootState } from "@/redux/store";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  List,
  Modal,
  Pagination,
  PaginationProps,
  Popconfirm,
} from "antd";
import Meta from "antd/es/card/Meta";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IQuestion } from "@/types/quizType";
import { deleteQuiz, getQuiz } from "@/services/service/educationService";
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
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchQuiz(10));
    }
  }, [status, dispatch]);

  const handleDeletQuiz = async (id: string) => {
    const res = await deleteQuiz(id);
    dispatch(
      handleQuizDataChange(data?.filter((e) => e._id !== res.data?._id))
    );
  };

  const onChange: PaginationProps["onChange"] = async (page, pageNumber) => {
    const res = await getQuiz(pageNumber, page);
    if (res.success && !!data) {
      dispatch(handleQuizDataChange(res.data));
    }
    setPageSize(pageNumber);
  };

  return (
    <>
      <div>
        <div className="flex justify-end ">
          <Link href="/dashboard/academy/quiz/add">
            <Button type="primary"> {t("menu-academy-quiz-add")}</Button>
          </Link>
        </div>
        <div>
          <div className="grid grid-cols-4 gap-8 mt-4">
            {data?.map((quiz) => {
              const actions: React.ReactNode[] = [
                <Link
                  href={
                    "/dashboard/academy/quiz/update/" + quiz._id
                  }
                >
                  <EditOutlined key="edit" />
                </Link>,
                <EyeOutlined
                  key="ellipsis"
                  onClick={() => setOpen({ show: true, data: quiz.question })}
                />,
                <Popconfirm
                  title="Delete the quiz"
                  disabled={quiz?.authorType === "superadmin" && user?.role !== "superadmin"}
                  description="Are you sure to delete this quiz?"
                  onConfirm={() => handleDeletQuiz(quiz._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined />
                </Popconfirm>,
              ];
              return (
                <Badge.Ribbon
                  className="card-title-ribbon"
                  color={quiz?.authorType === "superadmin" ? "green" : "red"}
                  text={quiz?.authorType === "superadmin" ? "Global" : "Local"}
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

export default QuizList;
