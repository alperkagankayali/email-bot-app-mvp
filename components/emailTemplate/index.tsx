"use client";
import React, { useEffect, useState } from "react";
import { Badge, Card, Modal, PaginationProps } from "antd";
import { noImage } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchEmailTemplate,
  handleChangeEmailData,
} from "@/redux/slice/scenario";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Pagination } from "antd";
import {
  deleteEmailTemplate,
  getEmailTemplate,
} from "@/services/service/generalService";

const { Meta } = Card;

const EmailTemplateList: React.FC = () => {
  const status = useSelector(
    (state: RootState) => state.scenario.emailTemplateStatus
  );
  const data = useSelector((state: RootState) => state.scenario.emailTemplate);
  const totalItems = useSelector(
    (state: RootState) => state.scenario.emailTemplateTotalItem
  );

  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslations("pages");
  const [open, setOpen] = useState({
    show: false,
    data: "",
  });
  const [pageSize, setPageSize] = useState(8);

  const onChange: PaginationProps["onChange"] = async (page, pageNumber) => {
    const res = await getEmailTemplate("", pageNumber, page);
    if (res.success && !!data) {
      dispatch(handleChangeEmailData(res.data));
    }
    setPageSize(pageNumber);
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEmailTemplate(8));
    }
  }, [status, dispatch]);

  const handleDeleteEmailTemplate = async (id: string) => {
    const res = await deleteEmailTemplate(id);
    dispatch(
      handleChangeEmailData(data?.filter((e) => e._id !== res.data?._id))
    );
  };

  return (
    <div className="flex flex-col items-start">
      <Link
        href={"/dashboard/scenario/email-templates/add"}
        className="bg-[#1677ff] text-white px-4 py-2 rounded-md"
      >
        {t("email-template-add")}
      </Link>

      <div className="grid grid-cols-4 gap-8 mt-4">
        {data?.map((emailTemplate) => {
          const actions: React.ReactNode[] = [
            <Link
              href={
                "/dashboard/scenario/email-templates/update/" +
                emailTemplate._id
              }
            >
              <EditOutlined key="edit" />
            </Link>,
            <EyeOutlined
              key="ellipsis"
              onClick={() =>
                setOpen({ show: true, data: emailTemplate.content })
              }
            />,
            <DeleteOutlined
              onClick={() => handleDeleteEmailTemplate(emailTemplate._id)}
            />,
          ];
          return (
            <Badge.Ribbon
              className="card-title-ribbon"
              color={
                emailTemplate?.authorType === "superadmin" ? "green" : "red"
              }
              text={
                emailTemplate?.authorType === "superadmin" ? "Global" : "Local"
              }
              key={emailTemplate._id}
            >
              <Card
                actions={actions}
                key={emailTemplate._id}
                hoverable
                rootClassName="flex h-full"
                loading={status === "loading"}
                style={{ width: 240 }}
                cover={
                  <Image
                    width={240}
                    height={100}
                    className="h-30 object-contain bg-[#03162b]"
                    alt={emailTemplate.title}
                    src={status === "loading" ? noImage : emailTemplate.img}
                  />
                }
              >
                <Meta title={emailTemplate.title} />
              </Card>
            </Badge.Ribbon>
          );
        })}
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
    </div>
  );
};

export default EmailTemplateList;
