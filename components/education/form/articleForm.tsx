"use client";
import { Button, Form, Input, notification, Select } from "antd";
import type { FormProps } from "antd";
import RinchTextEditor from "@/components/rinchTextEditor";
import { useState } from "react";
import { IArticleType } from "@/types/articleType";
import { createArticle } from "@/services/service/educationService";

type IProps = {};
const ArticleForm = ({}: IProps) => {
  const [content, setContent] = useState("");

  const onFinish: FormProps<IArticleType>["onFinish"] = async (values) => {
    values.content = content;
    const res = await createArticle(values);
    if (res.status) {
      notification.info({ message: "Başarıyla kaydedildi" });
    } else {
      notification.error({ message: res.message });
    }
  };

  return (
    <div className="mb-6 flex">
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
            <Form.Item<IArticleType> name="title">
              <Input
                size="large"
                type="text"
                placeholder="Title"
                className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </Form.Item>
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Description
          </label>
          <div className="relative">
            <Form.Item<IArticleType> name="description" required>
              <Input
                size="large"
                type="text"
                required
                placeholder="Description"
                className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </Form.Item>
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Content
          </label>
          <div className="relative">
            <Form.Item<IArticleType> name="content">
              <RinchTextEditor content={content} setContent={setContent} />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                className="w-full cursor-pointer rounded-lg border !border-primary !bg-primary !p-7 !text-white transition hover:bg-opacity-90"
              >
                Kaydet
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ArticleForm;
