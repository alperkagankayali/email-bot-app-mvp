"use client";
import React, { useState } from "react";
import { Button, Form, notification, Steps, theme } from "antd";
import SelectUserForm from "../selectUserForm";
import type { TransferProps } from "antd";
import CampaignInfoForm from "./campaignInfoForm";
import { useTranslations } from "next-intl";
import { createCampaign } from "@/services/service/campaignService";
import { useRouter } from "@/i18n/routing";
import CampaignScenarioList from "./campaignScenarioList";
import EducationListRadio from "../education/educationListRadio";

const PhishingCampaignSteps: React.FC = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectEducation, setSelectEducation] = useState<string>("");
  const [targetKeys, setTargetKeys] = useState<TransferProps["targetKeys"]>([]);
  const [info, setInfo] = useState<any>({});
  const [form] = Form.useForm();
  const t = useTranslations("pages");
  const router = useRouter();
  const [isEducation, setIsEducation] = useState(
    !!info?.isEducation ? info?.isEducation === "1" : false
  );

  const onFinish = (values: any) => {
    if (values.isEducation === "1") {
      values.educationAvailableDate = new Date(values.created_at);
    }
    setInfo(values);
    next();
  };

  const steps = [
    {
      title: "Campaign Info Form",
      content: (
        <Form
          name="Campaign"
          className="w-full"
          initialValues={{
            remember: true,
            isEducation: isEducation ? "1" : "0",
          }}
          form={form}
          autoComplete="off"
          onFinish={onFinish}
        >
          <CampaignInfoForm
            isEducation={isEducation}
            setIsEducation={setIsEducation}
          />
        </Form>
      ),
    },
    {
      title: "Select Users",
      content: (
        <SelectUserForm targetKeys={targetKeys} setTargetKeys={setTargetKeys} />
      ),
    },
    {
      title: "Select Scenario",
      content: (
        <CampaignScenarioList
          selected={selected}
          scenarioType={info.scenarioType}
          setSelected={setSelected}
        />
      ),
    },
    isEducation
      ? {
          title: "Select Education",
          content: (
            <EducationListRadio
              selected={selectEducation}
              setSelected={setSelectEducation}
            />
          ),
        }
      : {
          title: "Select Education",
          content:
            "Eğitim ekleme yapmadığınız eğitim seçemiyorsunuz kaydetmek için Done tıklayınız",
        },
  ];
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    lineHeight: "260px",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  const handleCreateNewsCampaign = async () => {
    console.log("values", info, "selected", selected, "users", targetKeys);
    if (!!selected) {
      const newObj = {
        type: "phishing",
        ...info,
        scenario: selected,
        education: selectEducation,
        userList: targetKeys,
      };
      const res = await createCampaign(newObj);
      if (res.success) {
        notification.info({ message: "Error" });
        router.push("/dashboard/campaign");
      } else {
        notification.error({ message: "Error" });
      }
    } else {
      notification.error({
        message: t("campaign-error-news-select"),
      });
    }
  };

  return (
    <>
      <Steps
        current={current}
        items={items}
        onChange={(value) => setCurrent(value)}
      />
      <div style={contentStyle}>{steps[current].content}</div>
      <div style={{ marginTop: 24 }}>
        {current < steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => {
              debugger;
              if (current === 0) {
                form.submit();
              } else if (current === 1) {
                if (targetKeys?.length === 0) {
                  notification.error({
                    message: t("campaign-error-user-select"),
                  });
                } else next();
              } else next();
            }}
          >
            {t("next")}
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            htmlType="submit"
            onClick={handleCreateNewsCampaign}
          >
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </>
  );
};

export default PhishingCampaignSteps;