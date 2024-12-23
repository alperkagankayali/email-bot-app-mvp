"use client";
import { Button, Form, Input, notification, Select } from "antd";
import type { FormProps } from "antd";
import RinchTextEditor from "@/components/rinchTextEditor";
import { useEffect, useState } from "react";
import { getArticle } from "@/services/service/educationService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { INewsBlog } from "@/types/newsType";
import FileUpload from "../fileUpload";
import {
  createNews,
  getNews,
  updateNews,
} from "@/services/service/newsService";
const { Option } = Select;

type IProps = {
  redirect?: boolean;
  id?: string;
};
const NewsForm = ({ redirect = false, id }: IProps) => {
  const [content, setContent] = useState("");
  const router = useRouter();
  const [form] = Form.useForm();
  const t = useTranslations("pages");
  const [img, setImg] = useState("");
  const languages = useSelector((state: RootState) => state.language.language);

  const onFinish: FormProps<INewsBlog>["onFinish"] = async (values) => {
    values.content = content;
    values.featuredImageUrl = img;
    console.log("log", values);
    let res = null;
    if (!!id) {
      res = await updateNews(id, values);
    } else {
      res = await createNews(values);
    }
    if (res.success) {
      router.push("/dashboard/news");
      notification.info({ message: t("message-news-success") });
    } else {
      notification.error({ message: res?.message });
    }
  };

  useEffect(() => {
    if (!!id) {
      const fetchByIdNews = async () => {
        const res = await getNews(10, 1, id);
        form.setFieldsValue({
          headline: res.data.headline,
          description: res.data.description,
          category: res.data.category,
          tags: res.data.tags,
          language: res.data.language,
        });
        setImg(res.data.featuredImageUrl);
        setContent(res.data.content);
      };
      fetchByIdNews();
    }
  }, [id]);

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
            <Form.Item<INewsBlog> name="headline">
              <Input
                size="large"
                type="text"
                placeholder={t("label")}
                className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </Form.Item>
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            {t("description")}
          </label>
          <div className="relative">
            <Form.Item<INewsBlog> name="description" required>
              <Input.TextArea
                size="large"
                showCount
                rows={3}
                maxLength={500}
                minLength={50}
                required
                placeholder={t("description")}
                className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </Form.Item>
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            {t("category")}
          </label>
          <div className="relative">
            <Form.Item<INewsBlog> name="category" required>
              <Input
                size="large"
                type="text"
                required
                placeholder={t("category")}
                className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </Form.Item>
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            {t("tags")}
          </label>
          <div className="relative">
            <Form.Item<INewsBlog> name="tags" required>
              <Select
                mode="tags"
                size="large"
                style={{ width: "100%" }}
                placeholder={t("tags")}
                options={[
                  {
                    value: "IT",
                    label: "IT",
                  },
                ]}
              />
            </Form.Item>
          </div>
        </div>
        <div className="mb-6">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
          {t("image")}

          </label>
          <div className="relative">
            <Form.Item<INewsBlog> name="featuredImageUrl">
              <FileUpload
                handleUploadFile={(data) => setImg(data)}
                defaultValue={img}
              />
            </Form.Item>
          </div>
        </div>
        <div className="mb-6">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
          {t("resources-language")}
          </label>
          <div className="relative">
            <Form.Item<INewsBlog> name="language">
              <Select>
                {languages.map((e) => {
                  return (
                    <Option key={e.code} value={e.code}>
                      {e.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
          {t("content")}
          </label>
          <div className="relative">
            <Form.Item<INewsBlog> name="content">
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

export default NewsForm;
