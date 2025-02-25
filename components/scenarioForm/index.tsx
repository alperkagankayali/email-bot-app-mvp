"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, notification, Steps, theme } from "antd";
import FirstTabForm from "./firstTab";
import { fetchScenarioType } from "@/redux/slice/scenario";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import TemplateList from "./templateList";
import { useTranslations } from "next-intl";
import Summary from "./summury";
import DataEntryTab from "./dataEntryTab";

type IProps = { handleCreateScenario: () => void };
const ScenarioForm: React.FC<IProps> = ({ handleCreateScenario }) => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
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
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.submit();
  };

  const handleNextClick = () => {
    if (!isDataEntry && steps[current]?.type === "dataEntry") {
      next();
    } else if (
      newScenario &&
      newScenario[steps[current]?.type as keyof typeof newScenario]
    ) {
      next();
    } else {
      notification.error({ message: t("error-choose") });
    }
  };

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

  const t = useTranslations("pages");
  const isDataEntry =
    scenarioType?.find((e) => e._id === (newScenario?.scenarioType ?? ""))
      ?.title === "data_entry";

  const steps = [
    {
      title: t("menu-scenario-template"),
      type: "form",
      content: <FirstTabForm next={next} form={form}  />,
    },
    {
      title: t("menu-mail"),
      type: "emailTemplate",
      content: (
        <div>
          <TemplateList
            current={current}
            prev={prev}
            next={next}
            type="emailTemplate"
          />
        </div>
      ),
    },
    {
      title: t("menu-landing-pages"),
      type: "landingPage",
      content: (
        <div>
          <TemplateList
            current={current}
            prev={prev}
            next={next}
            type="landingPage"
          />
        </div>
      ),
    },
    {
      title: t("menu-data-entries"),
      type: "dataEntry",
      content: (
        <DataEntryTab
          isDataEntry={isDataEntry}
          current={current}
          prev={prev}
          next={next}
        />
      ),
    },
    {
      title: t("summury-page"),
      type: "summury",
      content: <Summary />,
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
      <div className="mb-4">
        {current !== steps.length - 1 && (
          <div className="flex w-full justify-between">
            <Button
              disabled={current === 0}
              className="cursor-pointer rounded-lg border !border-black-2 !bg-transparent !p-7 !text-black transition hover:bg-opacity-90 mr-4"
              onClick={() => prev()}
            >
              {t("previous-btn")}
            </Button>

            {current > 0 ? (
              <Button
                onClick={handleNextClick}
                className="cursor-pointer rounded-lg border !border-primary !bg-primary !p-7 !text-white transition hover:bg-opacity-90"
              >
                {t("save-and-continue")}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="cursor-pointer rounded-lg border !border-primary !bg-primary !p-7 !text-white transition hover:bg-opacity-90"
              >
                {t("save-and-continue")}
              </Button>
            )}
          </div>
        )}
        {current === steps.length - 1 && (
          <div className="flex w-full justify-between">
            <Button
              className="cursor-pointer rounded-lg border !border-black-2 !bg-transparent !p-7 !text-black transition hover:bg-opacity-90 mr-4"
              onClick={() => prev()}
            >
              {t("previous-btn")}
            </Button>
            <Button
              type="primary"
              className="cursor-pointer rounded-lg border !border-logo !bg-logo !p-7 !text-white transition hover:bg-opacity-90 mr-4"
              onClick={handleCreateScenario}
            >
              {t("done-btn")}
            </Button>
          </div>
        )}
      </div>
      <Steps current={current} items={items} />
      <div style={contentStyle}>{steps[current]?.content}</div>
    </>
  );
};

export default ScenarioForm;
