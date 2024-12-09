"use client";

import { noImage, randomColor } from "@/constants";
import { Link } from "@/i18n/routing";
import {
  fetchContent,
  fetchEducationList,
  handleEducationContentDataChange,
} from "@/redux/slice/education";
import { AppDispatch, RootState } from "@/redux/store";
import {
  deleteEducation,
  getEducationContent,
} from "@/services/service/educationService";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  List,
  Pagination,
  PaginationProps,
  Popconfirm,
  Tag,
} from "antd";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const { Meta } = Card;

const EducationList: React.FC = () => {
  const t = useTranslations("pages");
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(
    (state: RootState) => state.education.educationStatus
  );
  const data = useSelector(
    (state: RootState) => state.education.educationContent
  );
  const user = useSelector((state: RootState) => state.user.user);
  const totalItems = useSelector(
    (state: RootState) => state.education.educationContentTotalItems
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchContent(10));
      dispatch(fetchEducationList(10));
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

  const [pageSize, setPageSize] = useState(8);

  const onChangePagitnation: PaginationProps["onChange"] = async (
    page,
    pageNumber
  ) => {
    const res = await getEducationContent(pageNumber, page);
    if (res.success && !!data) {
      dispatch(handleEducationContentDataChange(res.data));
    }
    setPageSize(pageNumber);
  };

  return (
    <div>
      <div className="flex justify-end ">
        <Link href="/dashboard/education/add">
          <Button type="primary"> {t("menu-education-add")}</Button>
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-9 mt-5">
        {data.map((item) => {
          const reduce = item.contents.reduce((acc: any, content) => {
            if (!acc[content.type]) {
              acc[content.type] = { type: content.type, count: 0 };
            }
            acc[content.type].count += 1; // Tür sayısını artır.
            return acc;
          }, {});
          const actions: React.ReactNode[] = [
            <Link href={"/dashboard/education/update/" + item._id}>
              <EditOutlined key="edit" />
            </Link>,
            <Popconfirm
              title="Delete the article"
              description="Are you sure to delete this article?"
              onConfirm={() => handleDeleteEducation(item._id)}
              okText="Yes"
              cancelText="No"
              disabled={
                item?.authorType === "superadmin" && user?.role !== "superadmin"
              }
            >
              <DeleteOutlined />
            </Popconfirm>,
          ];
          return (
            <Badge.Ribbon
              className="card-title-ribbon"
              color={item?.authorType === "superadmin" ? "green" : "red"}
              text={item?.authorType === "superadmin" ? "Global" : "Local"}
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
                    alt={item.title}
                    src={
                      status === "loading" || !!!item.img ? noImage : item.img
                    }
                  />
                }
              >
                <Meta
                  title={item.title}
                  description={
                    <div className="grid grid-cols-3  gap-2 mt-auto pt-2">
                      <Tag color="purple" className="!m-0 !pl-1">
                        {" "}
                        Article {reduce["article"].count}
                      </Tag>
                      <Tag color="#f50" className="!m-0 !pl-1">
                        {" "}
                        Quiz {reduce["quiz"]?.count}
                      </Tag>
                      <Tag color="#2db7f5" className="!m-0 !pl-1">
                        {" "}
                        Video {reduce["video"]?.count}
                      </Tag>
                    </div>
                  }
                />
              </Card>
            </Badge.Ribbon>
          );
        })}
      </div>
      <div className="mt-10 mb-20 w-full">
        {!!totalItems && (
          <Pagination
            onChange={onChangePagitnation}
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
  );
};

export default EducationList;
