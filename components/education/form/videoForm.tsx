"use client";
import { Button, Form, Input, notification, Select } from "antd";
import type { FormProps } from "antd";
import { useEffect, useState } from "react";
import { IVideoType } from "@/types/videoType";
import FileUpload from "@/components/fileUpload/inedx";
import {
  createVideo,
  getVideo,
  updateVideo,
} from "@/services/service/educationService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useRouter } from "@/i18n/routing";
import { fetchVideo } from "@/redux/slice/education";

type IProps = {
  redirect?: boolean;
  videoId?: string;
};
const VideoForm = ({ redirect, videoId }: IProps) => {
  const [videolink, setVideoLink] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [form] = Form.useForm();

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
        dispatch(fetchVideo(10));
        router.push("/dashboard/academy/video");
      }
      notification.info({ message: "Başarıyla kaydedildi" });
    } else {
      notification.error({ message: res?.message });
    }
  };

  useEffect(() => {
    if (!!videoId) {
      const fetchArticleById = async () => {
        const res = await getVideo(10, 1, videoId);
        form.setFieldsValue({
          title: res.data.title,
          description: res.data.description,
          videolink: res.data.videolink,
        });
        setVideoLink(res.data.videolink);
      };
      fetchArticleById();
    }
  }, [videoId]);

  return (
    <div className="mb-6 flex w-full">
      <Form
        name="resource"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        form={form}
        autoComplete="off"
        className="w-full"
      >
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Title
          </label>
          <div className="relative">
            <Form.Item<IVideoType> name="title">
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
            <Form.Item<IVideoType> name="description" required>
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
            Video
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
                Kaydet
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default VideoForm;
