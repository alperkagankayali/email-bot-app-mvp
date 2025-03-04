"use client";
import { Button, Form, Input, notification, Select } from "antd";
import type { FormProps } from "antd";
import { useEffect, useState } from "react";
import { IVideoType } from "@/types/videoType";
import FileUpload from "@/components/fileUpload";
import {
  createVideo,
  getVideo,
  updateVideo,
} from "@/services/service/educationService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "@/i18n/routing";
import { fetchVideo } from "@/redux/slice/education";
import { useTranslations } from "next-intl";
import Loader from "@/components/common/Loader";

type IProps = {
  redirect?: boolean;
  videoId?: string;
};
const VideoForm = ({ redirect, videoId }: IProps) => {
  const [videolink, setVideoLink] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [form] = Form.useForm();
  const t = useTranslations("pages");
  const [loading, setLoading] = useState(false);
  const languages = useSelector((state: RootState) => state.language.language);

  const onFinish: FormProps<IVideoType>["onFinish"] = async (values) => {
    values.videolink = videolink;
    let res = null;
    if (!!videoId) {
      res = await updateVideo(videoId, values);
    } else {
      res = await createVideo(values);
    }
    if (res?.status) {
      if (redirect) {
        dispatch(fetchVideo({ limit: 8, page: 1 }));
        router.push("/dashboard/academy/video");
      }
      notification.info({ message: t(res.message) });
    } else {
      notification.error({ message: res?.message });
    }
  };

  useEffect(() => {
    if (!!videoId) {
      setLoading(true);
      const fetchArticleById = async () => {
        const res = await getVideo({ id: videoId });
        form.setFieldsValue({
          title: res.data.title,
          description: res.data.description,
          videolink: res.data.videolink,
          language: res.data.language,
        });
        setLoading(false);
        setVideoLink(res.data.videolink);
      };
      fetchArticleById();
    }
  }, [videoId]);

  if (!!videoId && loading) {
    return (
      <div className="mb-6 flex justify-center items-center h-[400px] bg-white w-full">
        <Loader className="w-full" />
      </div>
    );
  }
  return (
    <div className="mb-6 flex w-full">
      <Form
        name="resource"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        form={form}
        autoComplete="off"
        className="w-full"
        onFinishFailed={() => {
          notification.error({ message: t("form-require-error") });
        }}
      >
        <div className="mb-4">
          {/* <label className="mb-2.5 block font-medium text-black dark:text-white">
            {t("title")}
          </label> */}
          <div className="relative">
            <Form.Item<IVideoType>
              name="title"
              labelCol={{ span: 24 }}
              label={t("title")}
              rules={[{ required: true }]}
              wrapperCol={{ span: 24 }}
            >
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
            {t("description")}
          </label>
          <div className="relative">
            <Form.Item<IVideoType> name="description">
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
        <Form.Item
          layout="vertical"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          label={t("resources-language")}
          name="language"
          rules={[{ required: true }]}
          className="!mb-10 h-12"
        >
          <Select
            size="large"
            className="w-full"
            placeholder={t("resources-language")}
            options={languages?.map((type) => {
              return { value: type._id, label: type.name };
            })}
          />
        </Form.Item>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            {t("menu-academy-video")}
          </label>

          <div className="relative">
            <Form.Item<IVideoType> name="videolink">
              <FileUpload
                defaultValue={videolink}
                handleUploadFile={(url: string) => setVideoLink(url)}
                type="video"
              />
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

export default VideoForm;
