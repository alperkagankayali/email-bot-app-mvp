"use client";
import { Button, Form, FormProps, Input, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { ICourse } from "@/types/courseType";
import FileUpload from "@/components/fileUpload/inedx";
import { handleAddEducationForm } from "@/redux/slice/education";
import { useEffect, useState } from "react";

type IProps = {
  next: () => void;
  lang: string;
};
const EducationInfoForm = ({ next, lang }: IProps) => {
  const [form] = Form.useForm();
  const [img, setImg] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const educationDetail = useSelector(
    (state: RootState) => state.education.educationDetail
  );

  const onFinish: FormProps<ICourse>["onFinish"] = async (values) => {
    if (img === "") {
      notification.error({ message: "Please upload your logo" });
    }
    values.img = img;
    dispatch(
      handleAddEducationForm({
        language: lang,
        values: {
          img,
          title: values.title,
          description: values.description,
          language: lang,
        },
      })
    );
    next();
  };

  useEffect(() => {
    if (!!educationDetail) {
      form.setFieldsValue({
        title: educationDetail.title,
        description: educationDetail.description,
      });
      setImg(educationDetail.img);
    }
  }, [educationDetail]);

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
            Title
          </label>
          <div className="relative">
            <Form.Item<ICourse> name="title" required>
              <Input
                size="large"
                type="text"
                required
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
            <Form.Item<ICourse> name="description" required>
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
        <div className="mb-6">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Fotoğraf
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
        <div className="mb-4">
          <Form.Item>
            <Button
              htmlType="submit"
              className="w-full cursor-pointer rounded-lg border !border-primary !bg-primary !p-7 !text-white transition hover:bg-opacity-90"
            >
              Kaydet ve Devam Et
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
};

export default EducationInfoForm;
