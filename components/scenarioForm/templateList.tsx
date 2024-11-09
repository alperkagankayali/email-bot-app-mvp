"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Modal, Radio } from "antd";
import { noImage } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchDataEntry,
  fetchEmailTemplate,
  fetchLandingPage,
  handleChangeScenarioData,
} from "@/redux/slice/scenario";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { EyeOutlined } from "@ant-design/icons";

const { Meta } = Card;
type IProps = {
  type: "emailTemplate" | "landingPage" | "dataEntry";
  next: () => void;
  current: number;
};

const TemplateList: React.FC<IProps> = ({ type, next, current }) => {
  console.log("ttype", type);

  const emailTemplateStatus = useSelector(
    (state: RootState) => state.scenario.emailTemplateStatus
  );
  const landingPageStatus = useSelector(
    (state: RootState) => state.scenario.landingPageStatus
  );
  const dataEntryStatus = useSelector(
    (state: RootState) => state.scenario.dataEntryStatus
  );
  const emailTemplate = useSelector(
    (state: RootState) => state.scenario.emailTemplate
  );
  const landingPage = useSelector(
    (state: RootState) => state.scenario.landingPage
  );
  const dataEntries = useSelector(
    (state: RootState) => state.scenario.dataEntries
  );
  const scenarioData = useSelector(
    (state: RootState) => state.scenario.creteScenario
  );

  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslations("pages");
  const [open, setOpen] = useState({
    show: false,
    data: "",
  });
  const [selected, setSelected] = useState(
    type === "emailTemplate"
      ? scenarioData?.emailTemplate
      : type === "dataEntry"
        ? scenarioData?.dataEntry
        : scenarioData?.landingPage
  );

  useEffect(() => {
    if (type === "emailTemplate" && emailTemplateStatus === "idle") {
      dispatch(fetchEmailTemplate());
    }
    if (type === "dataEntry" && dataEntryStatus === "idle") {
      dispatch(fetchDataEntry());
    }
    if (type === "landingPage" && landingPageStatus === "idle") {
      dispatch(fetchLandingPage());
    }
  }, [
    emailTemplateStatus,
    landingPageStatus,
    dataEntryStatus,
    dispatch,
    current,
  ]);

  return (
    <div className="flex flex-col items-start">
      <div className="grid grid-cols-3 gap-8 mt-4">
        {(type === "dataEntry"
          ? dataEntries
          : type === "emailTemplate"
            ? emailTemplate
            : landingPage
        )?.map((list) => {
          const actions: React.ReactNode[] = [
            <EyeOutlined
              key="ellipsis"
              onClick={() => setOpen({ show: true, data: list.content })}
            />,
          ];
          return (
            <Radio.Group
              onChange={(e) => {
                dispatch(
                  handleChangeScenarioData({
                    ...scenarioData,
                    [type]: e.target.value,
                  })
                );
                setSelected(e.target.value);
              }}
              key={list._id}
              buttonStyle="solid"
              value={selected}
            >
              <Radio value={list._id} className="">
                <Card
                  actions={actions}
                  key={list._id}
                  hoverable
                  loading={status === "loading"}
                  style={{ width: 240 }}
                  cover={
                    <Image
                      width={240}
                      height={120}
                      className="bg-[#03162b] h-30 object-contain "
                      alt={list.title}
                      src={
                        emailTemplateStatus === "loading" ||
                        dataEntryStatus === "loading" ||
                        landingPageStatus === "loading"
                          ? noImage
                          : list.img
                      }
                    />
                  }
                >
                  <Meta title={list.title} />
                </Card>
              </Radio>
            </Radio.Group>
          );
        })}
      </div>
      <Button
        onClick={() => {
          if (!!selected) {
            next();
          }
        }}
        className="w-full mt-10 cursor-pointer rounded-lg border !border-primary !bg-primary !p-7 !text-white transition hover:bg-opacity-90"
      >
        Kaydet ve Devam Et
      </Button>
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

export default TemplateList;
