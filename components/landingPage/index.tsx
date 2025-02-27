"use client";
import React, { useEffect, useState } from "react";
import { Badge, Card, Modal, Pagination, PaginationProps } from "antd";
import { noImage } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchLandingPage,
  handleChangeLandingPage,
} from "@/redux/slice/scenario";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { EditOutlined, EyeOutlined, SettingOutlined } from "@ant-design/icons";
import { getLandingPage } from "@/services/service/generalService";

const { Meta } = Card;

const LandingPageList: React.FC = () => {
  const status = useSelector(
    (state: RootState) => state.scenario.landingPageStatus
  );
  const data = useSelector((state: RootState) => state.scenario.landingPage);
  const totalItems = useSelector(
    (state: RootState) => state.scenario.landingPageTotalItem
  );
  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslations("pages");
  const [pageSize, setPageSize] = useState(6);

  const [open, setOpen] = useState({
    show: false,
    data: "",
  });

  const onChange: PaginationProps["onChange"] = async (page, pageNumber) => {
    const res = await getLandingPage("", pageNumber, page);
    if (res.success && !!data) {
      dispatch(handleChangeLandingPage(res.data));
    }
    setPageSize(pageNumber);
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLandingPage(pageSize));
    }
  }, [status, dispatch]);

  return (
    <div className="flex flex-col items-start">
      <div className="flex justify-end w-full">
        <Link
          href={"/dashboard/scenario/landing-page/add"}
          className="bg-[#181140] text-white px-4 py-2 rounded-md"
        >
          {t("landing-page-add")}
        </Link>
      </div>

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
            <Badge.Ribbon
              className="card-title-ribbon"
              color={landingpage?.authorType === "superadmin" ? "green" : "red"}
              text={
                landingpage?.authorType === "superadmin" ? "Global" : "Local"
              }
              key={landingpage._id}
            >
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
            </Badge.Ribbon>
          );
        })}
      </div>
      <div className="mt-10 mb-20 w-full">
        {!!data && (
          <Pagination
            onChange={onChange}
            total={totalItems}
            pageSize={pageSize}
            showTotal={(total) => t("total-count", { count: total })}
            showSizeChanger
            defaultPageSize={6}
            align="center"
            pageSizeOptions={[6, 12, 18]}
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

export default LandingPageList;
