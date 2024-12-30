"use client";
import React, { useState } from "react";
import { Button, Form, notification, Steps, theme } from "antd";
import SelectUserForm from "../selectUserForm";
import NewsList from "./educationListRadio";
import type { TransferProps } from "antd";
import CampaignInfoForm from "../campaignInfoForm";
import { useTranslations } from "next-intl";
import { createCampaign } from "@/services/service/campaignService";
import { useRouter } from "@/i18n/routing";

const EducationCampaignSteps: React.FC = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [targetKeys, setTargetKeys] = useState<TransferProps["targetKeys"]>([]);
  const [info, setInfo] = useState<any>({});
  const [form] = Form.useForm();
  const t = useTranslations("pages");
  const router = useRouter();

  const onFinish = (values: any) => {
    setInfo(values);
    next();
  };

  const steps = [
    {
      title: "Campaign Info Form",
      content: (
        <Form
          name="resource"
          className="w-full"
          initialValues={{ remember: true }}
          form={form}
          autoComplete="off"
          onFinish={onFinish}
        >
          <CampaignInfoForm />
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
      title: "Select Education",
      content: <NewsList selected={selected} setSelected={setSelected} />,
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
    if (!!selected) {
      const newObj = {
        type: "education",
        ...info,
        education: selected,
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
              if (current === 0) {
                form.submit();
              } else if (current === 1) {
                if (targetKeys?.length === 0) {
                  notification.error({
                    message: t("campaign-error-user-select"),
                  });
                } else next();
              }
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

export default EducationCampaignSteps;
