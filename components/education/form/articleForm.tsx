"use client";
import { Button, Form, Input, notification, Select } from "antd";
import type { FormProps } from "antd";
import RinchTextEditor from "@/components/rinchTextEditor";
import { useEffect, useState } from "react";
import { IArticleType } from "@/types/articleType";
import {
  createArticle,
  getArticle,
  updateArticle,
} from "@/services/service/educationService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "@/i18n/routing";
import { fetchArticle } from "@/redux/slice/education";
import { useTranslations } from "next-intl";
import { titleCase } from "@/constants";

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
  const languages = useSelector((state: RootState) => state.language.language);
  const [loading, setLoading] = useState(false);

  const onFinish: FormProps<IArticleType>["onFinish"] = async (values) => {
    setLoading(true);
    values.content = content;
    let res = null;
    if (!!articleId) {
      res = await updateArticle(articleId, values);
      setLoading(false);
    } else {
      res = await createArticle(values);
      setLoading(false);
    }
    if (res.success) {
      if (redirect) {
        dispatch(fetchArticle({ limit: 8, page: 1 }));
        router.push("/dashboard/academy/article");
      }
      notification.info({ message: t("article-form-success-message") });
    } else {
      notification.error({ message: res?.message });
    }
  };

  useEffect(() => {
    if (!!articleId) {
      const fetchArticleById = async () => {
        const res = await getArticle({ id: articleId });
        form.setFieldsValue({
          title: res.data.title,
          description: res.data.description,
          language: res.data.language,
        });
        setContent(res.data.content);
      };
      fetchArticleById();
    }
  }, [articleId]);

  return (
    <div className="mb-6 flex">
      <Form
        name="resource"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        className="w-full"
        onFinish={onFinish}
        form={form}
        autoComplete="off"
        onFinishFailed={() => {
          notification.error({ message: t("form-require-error") });
        }}
      >
        <div className="mb-4 h-17">
          <div className="relative">
            <Form.Item<IArticleType>
              layout="vertical"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label={t("title")}
              name="title"
              rules={[{ required: true, message: t("title-required") }]}
              className="!h-15"
            >
              <Input
                size="large"
                type="text"
                placeholder={t("title")}
                className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </Form.Item>
          </div>
        </div>
        <div className="mb-4 h-17">
          <div className="relative">
            <Form.Item<IArticleType>
              layout="vertical"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label={titleCase(t("description"))}
              name="description"
              className="!h-15"
              rules={[{ required: false }]}
            >
              <Input
                size="large"
                type="text"
                placeholder={t("description")}
                className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </Form.Item>
          </div>
        </div>
        <div className="mb-4 h-17">
          <div className="relative">
            <Form.Item
              layout="vertical"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label={t("resources-language")}
              name="language"
              rules={[{ required: true, message: t("select-language") }]}
              className="!mb-30 mt-4 p-4"
            >
              <Select
                size="large"
                className="w-full "
                placeholder={t("resources-language")}
                options={languages?.map((type) => {
                  return { value: type._id, label: type.name };
                })}
              />
            </Form.Item>
          </div>
        </div>
        <div className="flex w-full ">
          <div className="relative">
            <RinchTextEditor content={content} setContent={setContent} />
          </div>
        </div>
        <div className="mt-10 w-full flex">
          <Button
            loading={loading}
            htmlType="submit"
            className="w-full cursor-pointer rounded-lg border !border-primary !bg-primary !p-7 !text-white transition hover:bg-opacity-90"
          >
            {t("save-btn")}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ArticleForm;
