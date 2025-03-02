"use client";
import {
  Button,
  Form,
  FormInstance,
  FormProps,
  Input,
  notification,
  Select,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { ICourse } from "@/types/courseType";
import FileUpload from "@/components/fileUpload";
import { handleAddEducationForm } from "@/redux/slice/education";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type IProps = {
  next: () => void;
  lang: string;
  form: FormInstance<any>;
};
const EducationInfoForm = ({ next, lang, form }: IProps) => {
  const educationDetail = useSelector(
    (state: RootState) => state.education.forms
  );
  const [img, setImg] = useState((educationDetail[lang]?.img as string) ?? "");
  const dispatch = useDispatch<AppDispatch>();

  const onFinish: FormProps<ICourse>["onFinish"] = async (values) => {
    values.img = img;
    dispatch(
      handleAddEducationForm({
        language: lang,
        values: {
          ...(!!educationDetail[lang] ? educationDetail[lang] : {}),
          img,
          title: values.title,
          description: values.description,
          language: lang,
          levelOfDifficulty: values.levelOfDifficulty,
        },
      })
    );
    next();
  };

  useEffect(() => {
    if (!!educationDetail[lang]) {
      form.setFieldsValue({
        title: educationDetail[lang]?.title,
        description: educationDetail[lang]?.description,
        levelOfDifficulty: educationDetail[lang]?.levelOfDifficulty,
      });
      setImg(educationDetail[lang]?.img as string);
    }
  }, [educationDetail]);

  const t = useTranslations("pages");

  return (
    <>
      <Form
        name="resource"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        form={form}
      >
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            {t("label")}
          </label>
          <div className="relative">
            <Form.Item<ICourse>
              name="title"
              rules={[{ required: true, message: "" }]}
            >
              <Input
                size="large"
                type="text"
                required
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
            <Form.Item<ICourse>
              name="description"
              rules={[{ required: true, message: "" }]}
            >
              <Input
                size="large"
                type="text"
                required
                placeholder={t("description")}
                className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </Form.Item>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            {t("level-of-difficulty")}
          </label>
          <div className="relative">
            <Form.Item<ICourse>
              name="levelOfDifficulty"
              rules={[{ required: true, message: "" }]}
            >
              <Select
                size="large"
                style={{ width: "100%" }}
                placeholder={t("level-of-difficulty")}
                options={[
                  {
                    value: "easy",
                    label: t("easy"),
                  },
                  {
                    value: "medium",
                    label: t("medium"),
                  },
                  {
                    value: "hard",
                    label: t("hard"),
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
            <Form.Item<ICourse> name="img">
              <FileUpload
                handleUploadFile={(data) => setImg(data)}
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
              {t("save-and-continue")}
            </Button>
          </Form.Item>
        </div> */}
      </Form>
    </>
  );
};

export default EducationInfoForm;
