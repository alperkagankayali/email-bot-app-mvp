"use client";
import {  IScenario } from "@/types/scenarioType";
import { Button, Form, FormProps, Input, notification, Select } from "antd";
import FileUpload from "../fileUpload/inedx";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { handleChangeScenarioData } from "@/redux/slice/scenario";
const { Option } = Select;
type IProps = {
  next: () => void;
  title?: string;
  img?: string;
  defaultContent?: string;
  istType?: boolean;
  defaultScenarioType?: string;
};
const FirstTabForm = ({
  next,
  title = "",
  img = "",
  istType = false,
  defaultScenarioType = "",
}: IProps) => {
  const data = useSelector((state: RootState) => state.scenario.scenarioType);
  const scenarioData = useSelector(
    (state: RootState) => state.scenario.creteScenario
  );
  const dispatch = useDispatch<AppDispatch>();
  const [fileUrl, setFileUrl] = useState(img);
  const handleUploadFile = (img: string) => {
    dispatch(handleChangeScenarioData({ ...scenarioData, img }));
    setFileUrl(img);
  };

  const onFinish: FormProps<IScenario>["onFinish"] = async (values) => {
    if (!!fileUrl || !!scenarioData?.img) {
      dispatch(handleChangeScenarioData({ ...values, img: scenarioData?.img }));
      next();
    } else {
      notification.error({ message: "Please upload your logo" });
    }
  };
  console.log("scenarioData", scenarioData);

  return (
    <>
      <Form
        name="resource"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Title
          </label>
          <div className="relative">
            <Form.Item<IScenario> name="title" required>
              <Input
                defaultValue={scenarioData?.title}
                size="large"
                type="text"
                required
                placeholder="Title"
                className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </Form.Item>
          </div>
        </div>
        {!!data && data?.length > 0 && (
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Scenario Type
            </label>
            <div className="relative">
              <Form.Item<IScenario>
                name="scenarioType"
                rules={[
                  {
                    required: true,
                    message: "Please input your scenario type!",
                  },
                ]}
              >
                <Select size="large" defaultValue={scenarioData?.scenarioType}>
                  {data?.map((scenario) => {
                    return (
                      <Option
                        key={scenario._id + scenario.title}
                        value={scenario._id}
                        required
                      >
                        {scenario.title}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </div>
          </div>
        )}
        <div className="mb-6">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Image
          </label>
          <div className="relative">
            <Form.Item<IScenario> name="img">
              <FileUpload
                handleUploadFile={handleUploadFile}
                defaultValue={scenarioData?.img}
              />
            </Form.Item>
          </div>
        </div>
        <div className="mb-4">
          <Form.Item>
            <Button
              htmlType="submit"
              className="w-full cursor-pointer rounded-lg border !border-primary !bg-primary !p-7 !text-white transition hover:bg-opacity-90"
            >
              Kaydet ve Devam Et
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
};

export default FirstTabForm;