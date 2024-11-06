"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, Form, message, Steps, theme } from "antd";
import FirstTabForm from "./firstTab";
import { fetchScenarioType } from "@/redux/slice/scenario";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import type { FormProps } from "antd";
import { IScenario } from "@/types/scenarioType";
import clsx from "clsx";
import useLocalStorage from "@/hooks/useLocalStorage";

const ScenarioForm: React.FC = () => {
  const [colorMode, setColorMode] = useLocalStorage("formData", "{}");

  const steps = [
    {
      title: "Scenario Info",
      content: <FirstTabForm handleSave={() => console.log("")} />,
    },
    {
      title: "Emmail Template",
      content: "Emmail Template",
    },
    {
      title: "Landing Page",
      content: "Landing Page",
    },
  ];
  const status = useSelector(
    (state: RootState) => state.scenario.scenarioTypeStatus
  );
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchScenarioType());
    }
  }, [status, dispatch]);

  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    color: token.colorTextTertiary,
    borderRadius: token.borderRadiusLG,
    marginTop: 16,
  };
  const onFinish: FormProps<IScenario>["onFinish"] = async (values) => {
    setColorMode(JSON.stringify(values))
    next()
  };
  console.log(JSON.parse(colorMode))

  return (
    <>
      <Form
        name="resource"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Steps current={current} items={items} />
        <div style={contentStyle}>{steps[current].content}</div>
        <div className="mt-6 flex">
          {current < steps.length - 1 && (
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Next
              </Button>
            </Form.Item>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => message.success("Processing complete!")}
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
      </Form>
    </>
  );
};

export default ScenarioForm;
