"use client";
import { ILandingPage, IScenario } from "@/types/scenarioType";
import { Button, Form, Input, Select } from "antd";
import FileUpload from "../fileUpload/inedx";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
const { Option } = Select;
type IProps = {
  handleSave: (x: ILandingPage) => void;
  title?: string;
  img?: string;
  defaultContent?: string;
  istType?: boolean;
  defaultScenarioType?: string;
};
const FirstTabForm = ({
  handleSave,
  title = "",
  img = "",
  istType = false,
  defaultScenarioType = "",
}: IProps) => {
  const data = useSelector((state: RootState) => state.scenario.scenarioType);

  const [fileUrl, setFileUrl] = useState(img);
  const handleUploadFile = (img: string) => {
    setFileUrl(img);
  };
  const scenarioType = useSelector(
    (state: RootState) => state.scenario.scenarioType
  );
 

  return (
    <>
      <div className="mb-4">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Title
        </label>
        <div className="relative">
          <Form.Item<IScenario> name="title">
            <Input
              defaultValue={title}
              size="large"
              type="text"
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
            <Form.Item<IScenario> name="scenarioType">
              <Select size="large" defaultValue={defaultScenarioType}>
                {data?.map((scenario) => {
                  return (
                    <Option
                      key={scenario._id + scenario.title}
                      value={scenario._id}
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
              defaultValue={img}
            />
          </Form.Item>
        </div>
      </div>
      {/* <div className="mb-4">
          <Form.Item>
            <Button
              htmlType="submit"
              className="w-full cursor-pointer rounded-lg border !border-primary !bg-primary !p-7 !text-white transition hover:bg-opacity-90"
            >
              Kaydet
            </Button>
          </Form.Item>
        </div> */}
    </>
  );
};

export default FirstTabForm;
