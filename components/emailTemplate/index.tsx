"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Modal, Radio } from "antd";
import { noImage } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchEmailTemplate,
  handleChangeScenarioData,
} from "@/redux/slice/scenario";
import Image from "next/image";
import { EyeOutlined } from "@ant-design/icons";
import useLocalStorage from "@/hooks/useLocalStorage";

const { Meta } = Card;
type IProps = {
  next: () => void;
};
const EmailTemplateList: React.FC<IProps> = ({ next }) => {
  const status = useSelector(
    (state: RootState) => state.scenario.emailTemplateStatus
  );
  const data = useSelector((state: RootState) => state.scenario.emailTemplate);
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState({
    show: false,
    data: "",
  });
  const scenarioData = useSelector(
    (state: RootState) => state.scenario.creteScenario
  );
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState(
    scenarioData?.emailTemplate ?? ""
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchEmailTemplate());
    }
  }, [status, dispatch]);

  return (
    <div className="flex flex-col items-start">
      <div className="grid grid-cols-3 gap-8 mt-4">
        {data?.map((emailTemplate) => {
          const actions: React.ReactNode[] = [
            <EyeOutlined
              key="ellipsis"
              onClick={() =>
                setOpen({ show: true, data: emailTemplate.content })
              }
            />,
          ];
          return (
            <Radio.Group
              onChange={(e) => {
                dispatch(
                  handleChangeScenarioData({
                    ...scenarioData,
                    emailTemplate: e.target.value,
                  })
                );
                setSelectedEmailTemplate(e.target.value);
              }}
              key={emailTemplate._id}
              defaultValue={scenarioData?.emailTemplate}
              buttonStyle="solid"
              value={selectedEmailTemplate}
            >
              <Radio value={emailTemplate._id} className="">
                <Card
                  actions={actions}
                  key={emailTemplate._id}
                  hoverable
                  loading={status === "loading"}
                  style={{ width: 240 }}
                  cover={
                    <Image
                      width={240}
                      height={120}
                      className="bg-[#03162b] h-30 object-contain "
                      alt={emailTemplate.title}
                      src={status === "loading" ? noImage : emailTemplate.img}
                    />
                  }
                >
                  <Meta title={emailTemplate.title} />
                </Card>
              </Radio>
            </Radio.Group>
          );
        })}
      </div>
      <Button
        onClick={() => {
          if (!!selectedEmailTemplate) {
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

export default EmailTemplateList;
