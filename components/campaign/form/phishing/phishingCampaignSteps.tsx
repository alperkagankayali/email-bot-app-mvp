"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, notification, Steps, theme } from "antd";
import SelectUserForm from "../selectUserForm";
import type { TransferProps } from "antd";
import CampaignInfoForm from "./campaignInfoForm";
import { useTranslations } from "next-intl";
import { createCampaign } from "@/services/service/campaignService";
import { useRouter } from "@/i18n/routing";
import CampaignScenarioList from "./campaignScenarioList";
import EducationListRadio from "../education/educationListRadio";
import { getEducationListRelationship } from "@/services/service/educationService";
import { IEducationList } from "@/types/educationListType";
import ResponsiveSlider from "@/components/slider";
import { ICourse } from "@/types/courseType";

const PhishingCampaignSteps: React.FC = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [relationEducation, setRelationEducation] = useState<string[]>([]);
  const [relationEducationList, setRelationEducationList] = useState<
    IEducationList[]
  >([]);
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
    setInfo(values);
    next();
  };

  useEffect(() => {
    if (steps[current].title === "Select Education") {
      const fetchRelationEducation = async () => {
        const res = await getEducationListRelationship(relationEducation);
        if (res.success) {
          setRelationEducationList(res.data);
        }
      };
      fetchRelationEducation();
    }
  }, [current]);
console.log("relationEducationList",relationEducationList)
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
          relationEducation={relationEducation}
          setRelationEducation={setRelationEducation}
        />
      ),
    },
    isEducation
      ? {
          title: "Select Education",
          content: (
            <>
              <EducationListRadio
                relationEducation={relationEducation}
                selected={selectEducation}
                setSelected={setSelectEducation}
              />
              <ResponsiveSlider slidesToShow={4}>
                {relationEducationList.map((item,index:number) => {
                  return <div key={item._id}> <span>{index}</span>{(item.educations as any).title}</div>;
                })}
              </ResponsiveSlider>
            </>
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
      <Steps current={current} items={items} />
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
