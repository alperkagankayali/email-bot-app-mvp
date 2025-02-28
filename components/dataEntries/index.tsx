"use client";
import React, { useEffect, useState } from "react";
import { Badge, Card, Modal } from "antd";
import { noImage } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchDataEntry, fetchEmailTemplate } from "@/redux/slice/scenario";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { EditOutlined, EyeOutlined, SettingOutlined } from "@ant-design/icons";

const { Meta } = Card;

const DataEntriesList: React.FC = () => {
  const status = useSelector(
    (state: RootState) => state.scenario.dataEntryStatus
  );
  const data = useSelector((state: RootState) => state.scenario.dataEntries);
  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslations("pages");
  const [open, setOpen] = useState({
    show: false,
    data: "",
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDataEntry(10));
    }
  }, [status, dispatch]);

  return (
    <div className="flex flex-col items-start">
      <Link
        href={"/dashboard/scenario/data-entries/add"}
        className="bg-[#181140] text-white px-4 py-2 rounded-md"
      >
        {t("data-entry-add")}
      </Link>

      <div className="grid grid-cols-4 gap-8 mt-4">
        {data?.map((dataEntry) => {
          const actions: React.ReactNode[] = [
            <Link
              href={"/dashboard/scenario/data-entries/update/" + dataEntry._id}
            >
              <EditOutlined key="edit" />
            </Link>,
            <EyeOutlined
              key="ellipsis"
              onClick={() => setOpen({ show: true, data: dataEntry.content })}
            />,
          ];
          return (
            <Badge.Ribbon
              className="card-title-ribbon"
              color={dataEntry?.authorType === "superadmin" ? "green" : "red"}
              text={dataEntry?.authorType === "superadmin" ? "Global" : "Local"}
              key={dataEntry._id}
            >
              <Card
                actions={actions}
                key={dataEntry._id}
                hoverable
                loading={status === "loading"}
                rootClassName="flex h-full"
                style={{ width: 240 }}
                cover={
                  <Image
                    width={240}
                    height={150}
                    className="min-h-50 object-cover"
                    alt={dataEntry.title}
                    src={status === "loading" || !!!dataEntry.img ? noImage : dataEntry.img}
                  />
                }
              >
                <Meta title={dataEntry.title} />
              </Card>
            </Badge.Ribbon>
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

export default DataEntriesList;
