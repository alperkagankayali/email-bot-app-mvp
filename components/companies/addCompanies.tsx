"use client";
import {
  Button,
  Form,
  FormProps,
  Input,
  Modal,
  Select,
  DatePicker,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchLanguage } from "@/redux/slice/language";
import FileUpload from "../fileUpload/inedx";
import type { SelectProps } from "antd";
import {
  createCompany,
  updateCompany,
} from "@/services/service/generalService";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
interface DataType {
  key: string;
  companyName: string;
  logo: string;
  emailDomainAddress: string[];
  lisanceEndDate: Date;
  lisanceStartDate: Date;
}

type IProps = {
  isModalOpen: boolean;
  setIsModalOpen: (x: boolean) => void;
  setisEditing: (x: { edit: boolean; data: DataType | null | {} }) => void;
  handleAdd: (x: DataType) => void;
  isEditig: {
    edit: boolean;
    data: DataType;
  };
};

const AddCompanies = ({
  isModalOpen,
  setIsModalOpen,
  handleAdd,
  setisEditing,
  isEditig,
}: IProps) => {
  const status = useSelector((state: RootState) => state.language.status);
  const [logo, setLogo] = useState("");
  const [licanceDate, setLicanceDate] = useState<Date[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLanguage());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (isEditig.edit) {
      setLicanceDate([
        new Date(isEditig.data.lisanceStartDate),
        new Date(isEditig.data.lisanceEndDate),
      ]);
      setLogo(isEditig.data.logo);
      form.setFieldsValue({
        companyName: isEditig.data.companyName,
        lisanceStartDate: [
          dayjs(new Date(isEditig.data.lisanceStartDate)),
          dayjs(new Date(isEditig.data.lisanceEndDate)),
        ],
        logo: isEditig.data.logo,
        emailDomainAddress: isEditig.data.emailDomainAddress,
      });
    }
  }, [isEditig]);

  const onFinish: FormProps<DataType>["onFinish"] = async (values) => {
    const body = {
      companyName: values.companyName,
      logo: logo,
      emailDomainAddress: values.emailDomainAddress,
      lisanceStartDate: licanceDate[0],
      lisanceEndDate: licanceDate[1],
    };
    if (isEditig.edit) {
      const res = await updateCompany({ ...body, id: isEditig.data.key });
      if (res.success) {
        message.info(res.message);
        setIsModalOpen(false);
        form.resetFields();
        handleAdd({
          ...res.data,
          key: res.data._id,
        });
      } else {
        message.info(res.message);
      }
    } else {
      const res = await createCompany(body);
      if (res.success) {
        message.info(res.message);
        setIsModalOpen(false);
        form.resetFields();
        handleAdd({
          ...res.data,
          langKey: res.data._id,
        });
      } else {
        message.info(res.message);
      }
    }
  };
  const handleUploadFile = (x: string) => {
    setLogo(x);
  };
  const options: SelectProps["options"] = [];
  console.log("logo", licanceDate, [
    dayjs(licanceDate[0]),
    dayjs(licanceDate[1]),
  ]);

  return (
    <div>
      <Modal
        title="Şirket Ekle"
        open={isModalOpen}
        onCancel={() => {
          setLogo("");
          setisEditing({ edit: false, data: {} });
          form.resetFields();
          setIsModalOpen(false);
        }}
        footer={""}
      >
        <Form
          form={form}
          name="resource"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Company name
            </label>
            <div className="relative">
              <Form.Item<DataType> name="companyName">
                <Input
                  size="large"
                  type="text"
                  placeholder="Company name"
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
              <FileUpload
                handleUploadFile={handleUploadFile}
                defaultValue={logo}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Lisans Süresi
            </label>
            <div className="relative">
              <Form.Item<DataType> name="lisanceStartDate">
                <RangePicker
                  defaultValue={
                    licanceDate.length > 0
                      ? ([dayjs(licanceDate[0]), dayjs(licanceDate[1])] as any)
                      : undefined
                  }
                  format={{
                    format: "DD-MM-YYYY",
                    type: "mask",
                  }}
                  className="w-full"
                  id={{
                    start: "startInput",
                    end: "endInput",
                  }}
                  onChange={(date: any, dateString: string[]) => {
                    setLicanceDate(date);
                    console.log("date", date);
                  }}
                />
              </Form.Item>
            </div>
          </div>
          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Email Domains
            </label>
            <div className="relative">
              <Form.Item<DataType> name="emailDomainAddress">
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Tags Mode"
                  // onChange={handleChange}
                  options={options}
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
      </Modal>
    </div>
  );
};

export default AddCompanies;