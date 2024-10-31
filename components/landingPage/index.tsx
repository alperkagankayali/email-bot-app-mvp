"use client";
import React, { useEffect, useState } from "react";
import { Card, Modal } from "antd";
import { noImage } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchLandingPage } from "@/redux/slice/scenario";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { EditOutlined, EyeOutlined, SettingOutlined } from "@ant-design/icons";

const { Meta } = Card;

const LandingPageList: React.FC = () => {
  const status = useSelector(
    (state: RootState) => state.scenario.landingPageStatus
  );
  const data = useSelector((state: RootState) => state.scenario.landingPage);
  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslations("pages");
  const [open, setOpen] = useState({
    show: false,
    data: "",
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLandingPage())
      dispatch(fetchLandingPage());
    }
  }, [status, dispatch]);

  return (
    <div className="flex flex-col items-start">
      <Link
        href={"/dashboard/scenario/landing-page/add"}
        className="bg-[#1677ff] text-white px-4 py-2 rounded-md"
      >
        {t("landing-page-add")}
      </Link>

      <div className="grid grid-cols-4 gap-8 mt-4">
        {data?.map((landingpage) => {
          const actions: React.ReactNode[] = [
            <Link
              href={
                "/dashboard/scenario/landing-page/update/" + landingpage._id
              }
            >
              <EditOutlined key="edit" />
            </Link>,
            <EyeOutlined
              key="ellipsis"
              onClick={() => setOpen({ show: true, data: landingpage.content })}
            />,
          ];
          return (
            <Card
              actions={actions}
              key={landingpage._id}
              hoverable
              loading={status === "loading"}
              style={{ width: 240 }}
              cover={
                <Image
                  width={240}
                  height={150}
                  className="min-h-50 object-cover"
                  alt={landingpage.title}
                  src={status === "loading" ? noImage : landingpage.img}
                />
              }
            >
              <Meta title={landingpage.title} />
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

export default LandingPageList;
