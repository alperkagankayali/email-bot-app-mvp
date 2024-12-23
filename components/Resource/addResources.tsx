"use client";
import {
  Button,
  Form,
  FormProps,
  Input,
  Modal,
  notification,
  Select,
} from "antd";
import React, { useEffect } from "react";
import { DataType } from "./editableRow";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchLanguage } from "@/redux/slice/language";
import { createResource } from "@/services/service/generalService";
import { useTranslations } from "next-intl";
const { Option } = Select;

type IProps = {
  isModalOpen: boolean;
  setIsModalOpen: (x: boolean) => void;
  handleAdd: (x: DataType) => void;
};

const AddResource = ({ isModalOpen, setIsModalOpen, handleAdd }: IProps) => {
  const languages = useSelector((state: RootState) => state.language.language);
  const status = useSelector((state: RootState) => state.language.status);
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLanguage());
    }
  }, [status, dispatch]);

  const onFinish: FormProps<DataType>["onFinish"] = async (values) => {
    values.key = values.langKey;
    const res = await createResource({
      key: values.langKey,
      value: values.value,
      code: values.code,
    });
    if (res.success) {
      form.resetFields();
      notification.info({ message: "Başarı ile kaydedildi" });
    } else {
      notification.error({ message: "Kaydedilemedi" });
    }
    handleAdd({
      ...res.data,
      langKey: res.data?._id,
    });
  };
  const t = useTranslations("pages");

  return (
    <div>
      <Modal
        title={t("add-a-resource")}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={""}
      >
        <Form
          name="resource"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              {t("resources-key")}
            </label>
            <div className="relative">
              <Form.Item<DataType> name="langKey">
                <Input
                  size="large"
                  type="text"
                  placeholder={t("resources-key")}
                  className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </Form.Item>
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              {t("resources-value")}
            </label>

            <div className="relative">
              <Form.Item<DataType> name="value">
                <Input
                  size="large"
                  type="text"
                  placeholder={t("resources-value")}
                  className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </Form.Item>
            </div>
          </div>
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              {t("resources-language")}
            </label>
            <div className="relative">
              <Form.Item<DataType> name="code">
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
      </Modal>
    </div>
  );
};

export default AddResource;
