"use client";
import { Button, Form, FormProps, Input, Modal, Select } from "antd";
import React, { useEffect } from "react";
import { DataType } from "./editableRow";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchLanguage } from "@/redux/slice/language";
import { createResource } from "@/services/service/generalService";
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
    handleAdd({
      ...res.data,
      langKey: res.data?._id
    });
  };

  return (
    <div>
      <Modal
        title="Dil kaynağı ekle"
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
              Key
            </label>
            <div className="relative">
              <Form.Item<DataType> name="langKey">
                <Input
                  size="large"
                  type="text"
                  placeholder="Key"
                  className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </Form.Item>
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Value
            </label>

            <div className="relative">
              <Form.Item<DataType> name="value">
                <Input
                  size="large"
                  type="text"
                  placeholder="Value"
                  className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </Form.Item>
            </div>
          </div>
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Code
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
                  Kaydet
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
