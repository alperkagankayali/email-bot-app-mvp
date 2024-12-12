"use client";
import { Button, Form, Input, notification, Select } from "antd";
import type { FormProps } from "antd";
import RinchTextEditor from "@/components/rinchTextEditor";
import { useEffect, useState } from "react";
import { IArticleType } from "@/types/articleType";
import { createArticle, getArticle, updateArticle } from "@/services/service/educationService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useRouter } from "@/i18n/routing";
import { fetchArticle } from "@/redux/slice/education";
import { useTranslations } from "next-intl";

type IProps = {
  redirect?: boolean;
  articleId?: string;
};
const ArticleForm = ({ redirect = false, articleId }: IProps) => {
  const [content, setContent] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [form] = Form.useForm();
  const t = useTranslations("pages");

  const onFinish: FormProps<IArticleType>["onFinish"] = async (values) => {
    values.content = content;
    let res = null;
    if(!!articleId) {
      res = await updateArticle(articleId,values);
    }
    else{
      res = await createArticle(values);
    }
    if (res?.status) {
      if (redirect) {
        dispatch(fetchArticle(10));
        router.push("/dashboard/academy/article");
      }
      notification.info({ message: t("article-form-success-message") });
    } else {
      notification.error({ message: res?.message });
    }
  };

  useEffect(() => {
    if(!!articleId) {
      const fetchArticleById = async () => {
        const res = await getArticle(10,1,articleId);
        form.setFieldsValue({
          title:res.data.title,
          description:res.data.description,
        })
        setContent(res.data.content)
      }
      fetchArticleById()
    }
  },[articleId])

  return (
    <div className="mb-6 flex">
      <Form
        name="resource"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        form={form}
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
