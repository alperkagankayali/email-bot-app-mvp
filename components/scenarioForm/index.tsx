"use client";
import React, { useEffect, useState } from "react";
import { Button, Steps, Tabs, theme } from "antd";
import FirstTabForm from "./firstTab";
import { fetchScenarioType } from "@/redux/slice/scenario";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import TemplateAddForm from "./templateAddForm";
import TemplateList from "./templateList";
import { useTranslations } from "next-intl";

type IProps = {
  handleCreateScenario: () => void;
};
const ScenarioForm: React.FC<IProps> = ({ handleCreateScenario }) => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [tabKey, setTabKey] = useState("1");
  const status = useSelector(
    (state: RootState) => state.scenario.scenarioTypeStatus
  );
  const newScenario = useSelector(
    (state: RootState) => state.scenario.creteScenario
  );
  const scenarioType = useSelector(
    (state: RootState) => state.scenario.scenarioType
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchScenarioType());
    }
  }, [status, dispatch]);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const changeTab = (key: string) => {
    setTabKey(key);
  };
  const t = useTranslations("pages");

  const steps = [
    {
      title: t("menu-scenario-template"),
      content: <FirstTabForm next={next} />,
    },
    {
      title: t("menu-mail"),
      content: (
        <div>
          <Tabs
            defaultActiveKey="1"
            activeKey={tabKey}
            onChange={(key) => setTabKey(key)}
            items={[
              {
                key: "1",
                label: t("create-new-one"),
                children: (
                  <TemplateAddForm changeTab={changeTab} type="emailTemplate" />
                ),
              },
              {
                key: "2",
                label: t("choose-existing-one"),
                children: (
                  <TemplateList
                    current={current}
                    next={next}
                    type="emailTemplate"
                  />
                ),
              },
            ]}
          />
        </div>
      ),
    },
    {
      title: t("menu-landing-pages"),
      content: (
        <div>
          <Tabs
            defaultActiveKey="1"
            activeKey={tabKey}
            onChange={(key) => setTabKey(key)}
            items={[
              {
                key: "1",
                label: t("create-new-one"),
                children: (
                  <TemplateAddForm changeTab={changeTab} type="landingPage" />
                ),
              },
              {
                key: "2",
                label: "Choose existing one",
                children: (
                  <TemplateList
                    current={current}
                    next={next}
                    type="landingPage"
                  />
                ),
              },
            ]}
          />
        </div>
      ),
    },
    {
      title: t("menu-data-entries"),
      content:
        scenarioType?.find((e) => e._id === (newScenario?.scenarioType ?? ""))
          ?.title === "data_entry" ? (
          <div>
            <Tabs
              defaultActiveKey="1"
              activeKey={tabKey}
              onChange={(key) => setTabKey(key)}
              items={[
                {
                  key: "1",
                  label: "Create new one",
                  children: (
                    <TemplateAddForm changeTab={changeTab} type="dataEntry" />
                  ),
                },
                {
                  key: "2",
                  label: "Choose existing one",
                  children: (
                    <TemplateList
                      current={current}
                      next={next}
                      type="dataEntry"
                    />
                  ),
                },
              ]}
            />
          </div>
        ) : (
          <>
            <p>
            {t("data-entry-check-message")}

            </p>
          </>
        ),
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    color: token.colorTextTertiary,
    borderRadius: token.borderRadiusLG,
    marginTop: 16,
  };

  return (
    <>
      <Steps current={current} items={items} />
      <div style={contentStyle}>{steps[current]?.content}</div>
      <div className="mt-6 flex">
        {current === steps.length - 1 && (
          <Button type="primary" onClick={handleCreateScenario}>
            {t("done-btn")}
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            {t("previous-btn")}
          </Button>
        )}
      </div>
    </>
  );
};

export default ScenarioForm;
