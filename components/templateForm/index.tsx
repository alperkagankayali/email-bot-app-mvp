"use client";
import { ILandingPage } from "@/types/scenarioType";
import { Button, Form, Input, Select } from "antd";
import type { FormInstance, FormProps } from "antd";
import RinchTextEditor from "../rinchTextEditor";
import FileUpload from "../fileUpload/inedx";
import { useState } from "react";
import { useTranslations } from "next-intl";
const { Option } = Select;
type IProps = {
  handleSave: (x: ILandingPage) => void;
  title?: string;
  img?: string;
  defaultContent?: string;
  istType?: boolean;
  defaultScenarioType?: string;
  handleResetForm?: () => void;
  form?: FormInstance<any>;
};
const TemplateForm = ({
  handleSave,
  title = "",
  img = "",
  defaultContent = "",
  handleResetForm,
  form,
}: IProps) => {
  const [fileUrl, setFileUrl] = useState(img);
  const [content, setContent] = useState(defaultContent);
  const handleUploadFile = (img: string) => {
    setFileUrl(img);
  };

  const onFinish: FormProps<ILandingPage>["onFinish"] = async (values) => {
    await handleSave({ ...values, img: fileUrl, content });
  };
  const t = useTranslations("pages");

  return (
    <div className="mb-6 flex">
      <Form
        name="resource"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onReset={handleResetForm}
        form={form}
        autoComplete="off"
      >
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
          {t("label")}
          </label>
          <div className="relative">
            <Form.Item<ILandingPage> name="title">
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
        <div className="mb-6">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
          {t("image")}
          </label>

          <div className="relative">
            <Form.Item<ILandingPage> name="img">
              <FileUpload
                handleUploadFile={handleUploadFile}
                defaultValue={img}
              />
            </Form.Item>
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
          {t("content")}

          </label>
          <div className="relative">
            <Form.Item<ILandingPage> name="content">
              <RinchTextEditor content={content} setContent={setContent} />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                className="w-full cursor-pointer rounded-lg border !border-primary !bg-primary !p-7 !text-white transition hover:bg-opacity-90"
              >
                                                  {t("save-btn")}

              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default TemplateForm;
