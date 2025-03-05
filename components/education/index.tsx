"use client";

import {
  languageColor,
  languageEnum,
  noImage,
  queryStringTo,
  randomColor,
} from "@/constants";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import {
  fetchEducationList,
  handleEducationContentDataChange,
} from "@/redux/slice/education";
import { AppDispatch, RootState } from "@/redux/store";
import { deleteEducation } from "@/services/service/educationService";
import { CloseCircleOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
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
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EducationFilter, { IFilter } from "./filter";
const { Meta } = Card;

const EducationList: React.FC = () => {
  const t = useTranslations("pages");
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(
    (state: RootState) => state.education.educationListStatus
  );
  const data = useSelector(
    (state: RootState) => state.education.educationListContent
  );
  const user = useSelector((state: RootState) => state.user.user);
  const totalItems = useSelector(
    (state: RootState) => state.education.educationListTotalItems
  );
  const [pageSize, setPageSize] = useState(8);
  const [filter, setFilter] = useState<IFilter>({
    title: "",
    authorType: [],
    levelOfDifficulty: [],
    language: [],
  });
 const [isEdit, setIsEdit] = useState({
    show: false,
    id: "",
  });
  const router = useRouter()

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEducationList({ limit: pageSize }));
    }
  }, [status, dispatch]);

  const handleDeleteEducation = async (id: string) => {
    const res = await deleteEducation(id);
    dispatch(
      handleEducationContentDataChange(
        data?.filter((e) => e._id !== res.data?._id)
      )
    );
  };

  const onChangePagitnation: PaginationProps["onChange"] = async (
    page,
    pageNumber
  ) => {
    dispatch(
      fetchEducationList({
        limit: pageNumber,
        page,
        ...filter,
      })
    );
    setPageSize(pageNumber);
  };

  const handleDeleteEducationList = async (id: string) => {
    // const res = await deleteEducati(id);
    // if (res.success) {
    //   notification.success({ message: res.data?.title + " deleted" });
    //   dispatch(
    //     fetchScenario({
    //       limit: pageSize,
    //       page: page,
    //     })
    //   );
    // } else {
    //   notification.error({
    //     message: res.data?.title + " could not be deleted",
    //   });
    // }
  };

  return (
    <div>
      <EducationFilter filter={filter} setFilter={setFilter} pageSize={1} />
      <div className="">
        {!!data && (
          <div className="grid grid-cols-4 gap-5 mt-8">
            {data.map((item) => {
              const education = item.educations[0];
              const reduce = education?.contents?.reduce(
                (acc: any, content) => {
                  if (!acc[content.type]) {
                    acc[content.type] = { type: content.type, count: 0 };
                  }
                  acc[content.type].count += 1; // Tür sayısını artır.
                  return acc;
                },
                {}
              );
              let deleteIcon;
            let editIcon;
            if (
              user?.role === "admin" &&
              item.authorType === "superadmin"
            ) {
              deleteIcon = (
                <Popover
                  content={t("not-deleted", { name: t("menu-education") })}
                  title={""}
                >
                  <CloseCircleOutlined />
                </Popover>
              );
              editIcon = (
                <Button
                  type="text"
                  onClick={() => setIsEdit({ show: true, id: item._id })}
                >
                  <EditOutlined key="edit" />
                </Button>
              );
            } else {
              deleteIcon = (
                <Popconfirm
                  title={t("delete-document", {
                    document: t("menu-education"),
                  })}
                  description={t("delete-document-2", {
                    document: t("menu-education"),
                  })}
                  onConfirm={() => handleDeleteEducationList(item._id)}
                  okText={t("yes-btn")}
                  cancelText={t("no-btn")}
                >
                  <DeleteOutlined />
                </Popconfirm>
              );
              editIcon = (
                <Link href={"/dashboard/education/update/" + item._id}>
                  <EditOutlined key="edit" />
                </Link>
              );
            }
              const actions: React.ReactNode[] = [
                editIcon,
                deleteIcon,
              ];
              return (
                <div style={{ width: 240 }} className="flex" key={item._id}>
                  <Badge.Ribbon
                    className="card-title-ribbon"
                    color={item?.authorType === "superadmin" ? "green" : "red"}
                    text={
                      item?.authorType === "superadmin" ? "Global" : "Local"
                    }
                    key={item._id}
                  >
                    <Card
                      actions={actions}
                      key={item._id}
                      hoverable
                      rootClassName="flex h-full"
                      loading={status === "loading"}
                      style={{ width: 240 }}
                      cover={
                        <Image
                          width={240}
                          height={100}
                          className="h-30 object-contain bg-[#03162b]"
                          alt={education?.title}
                          src={
                            status === "loading" ||
                            education?.img === "" ||
                            education?.img === undefined
                              ? noImage
                              : education?.img
                          }
                        />
                      }
                    >
                      <Meta
                        className="card-meta"
                        title={education.title}
                        description={
                          <div className="mt-auto">
                            <div className="my-4">
                              {!!education.levelOfDifficulty && (
                                <Tag
                                  className="!m-0 !pl-1"
                                  color={
                                    education.levelOfDifficulty === "hard"
                                      ? "#cd201f"
                                      : education.levelOfDifficulty === "medium"
                                        ? "#108ee9"
                                        : "#87d068"
                                  }
                                >
                                  {education.levelOfDifficulty}
                                </Tag>
                              )}
                            </div>
                            <div className="grid grid-cols-3  gap-2 mt-auto pt-2">
                              {!!reduce["article"]?.count && (
                                <Tag className="!m-0 !pl-1">
                                  {" "}
                                  {t("menu-academy-article")}: {reduce["article"]?.count ?? 0}
                                </Tag>
                              )}
                              {!!reduce["quiz"]?.count && (
                                <Tag className="!m-0 !px-1">
                                  {" "}
                                  {t("menu-academy-quiz")}: {reduce["quiz"]?.count ?? 0}
                                </Tag>
                              )}
                              {!!reduce["video"]?.count && (
                                <Tag className="!m-0 !pl-1">
                                  {" "}
                                  {t("menu-academy-video")}: {reduce["video"]?.count ?? 0}
                                </Tag>
                              )}
                            </div>

                            <div className="my-4">
                              {item.languages.map((e: any) => (
                                <Tag
                                  key={e}
                                  color={
                                    languageColor[e as languageEnum] ?? "blue"
                                  }
                                >
                                  {e}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </Badge.Ribbon>
                </div>
              );
            })}
          </div>
        )}
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
              router.push("/dashboard/education/update/" + isEdit.id);
              setIsEdit({ id: "", show: false });
            }}
          >
            {t("save-and-continue")}
          </Button>,
        ]}
      >
        <div className="p-5">
          <p>{t("global-edit-content")}</p>
        </div>
      </Modal>
    </div>
  );
};

export default EducationList;
