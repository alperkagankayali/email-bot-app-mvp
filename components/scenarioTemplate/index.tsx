"use client";
import React, { useEffect, useState } from "react";
import { Card, Modal } from "antd";
import { noImage } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchEmailTemplate } from "@/redux/slice/scenario";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { EditOutlined, EyeOutlined, SettingOutlined } from "@ant-design/icons";
import Loader from "../common/Loader";

const { Meta } = Card;

const ScenarioList: React.FC = () => {
  const status = useSelector(
    (state: RootState) => state.scenario.emailTemplateStatus
  );
  const data = useSelector((state: RootState) => state.scenario.emailTemplate);
  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslations("pages");
  const [open, setOpen] = useState({
    show: false,
    data: "",
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEmailTemplate(6));
    }
  }, [status, dispatch]);

  if(status !== "succeeded") {
    <Loader />
  }
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
                "/dashboard/scenario/email-templates/update/" + emailTemplate._id
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
          ];
          return (
            <Card
              actions={actions}
              key={emailTemplate._id}
              hoverable
              loading={status === "loading"}
              style={{ width: 240 }}
              cover={
                <Image
                  width={240}
                  height={100}
                  className="h-30 object-cover"
                  alt={emailTemplate.title}
                  src={status === "loading" ? noImage : emailTemplate.img}
                />
              }
            >
              <Meta title={emailTemplate.title} description={emailTemplate.scenarioType.title}/>
            </Card>
          );
        })}
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

export default ScenarioList;
