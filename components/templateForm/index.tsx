"use client";
import { IEmailTemplate } from "@/types/scenarioType";
import { Button, Form, Input, Select } from "antd";
import type { FormInstance, FormProps } from "antd";
import RinchTextEditor from "../rinchTextEditor";
import FileUpload from "../fileUpload";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
const { Option } = Select;
type IProps = {
  handleSave: (x: IEmailTemplate) => void;
  title?: string;
  img?: string;
  defaultContent?: string;
  istType?: boolean;
  defaultScenarioType?: string;
  handleResetForm?: () => void;
  form?: FormInstance<any>;
  language?: string;
  isLanguage?:boolean;
};
const TemplateForm = ({
  handleSave,
  title = "",
  img = "",
  defaultContent = "",
  handleResetForm,
  form,
  language,
  isLanguage=false
}: IProps) => {
  const [fileUrl, setFileUrl] = useState(img);
  const [content, setContent] = useState(defaultContent);
  const languages = useSelector((state: RootState) => state.language.language);
  const t = useTranslations("pages");
  const handleUploadFile = (img: string) => {
    setFileUrl(img);
  };

  const onFinish: FormProps<IEmailTemplate>["onFinish"] = async (values) => {
    await handleSave({ ...values, img: fileUrl, content });
  };

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
            <Form.Item<IEmailTemplate>
              name="title"
              rules={[
                {
                  required: true,
                  message: t("title-required"),
                },
              ]}
            >
              <Input
                defaultValue={title}
                size="large"
                type="text"
                placeholder={t("title")}
                className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </Form.Item>
          </div>
        </div>
        {isLanguage && !!languages && languages?.length > 0 && (
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              {t("menu-language")}
            </label>
            <div className="relative">
              <Form.Item<IEmailTemplate>
                name="language"
                rules={[
                  { required: true, message: "Please input your language!" },
                ]}
              >
                <Select
                  size="large"
                  className=""
                  defaultValue={language}
                  placeholder={t("menu-language")}
                >
                  {languages.map((e) => {
                    return (
                      <Option key={e.code} value={e._id}>
                        {e.name}
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
            {t("image")}
          </label>

          <div className="relative">
            <Form.Item<IEmailTemplate> name="img">
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
            <Form.Item<IEmailTemplate> name="content">
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
