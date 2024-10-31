"use client";

import { useRouter } from "@/i18n/routing";
import { fetchCompanies } from "@/redux/slice/companies";
import { fetchLanguage } from "@/redux/slice/language";
import { AppDispatch, RootState } from "@/redux/store";
import { createUser } from "@/services/service/generalService";
import { ILandingPage } from "@/types/scenarioType";
import { Button, Form, Input, message, Select } from "antd";
import type { FormProps } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import RinchTextEditor from "../rinchTextEditor";
import FileUpload from "../fileUpload/inedx";
const { Option } = Select;

const TemplateForm = () => {
  const router = useRouter();
  const languages = useSelector((state: RootState) => state.language.language);
  const status = useSelector((state: RootState) => state.language.status);
  const companies = useSelector(
    (state: RootState) => state.companies.companies
  );
  const companyStatus = useSelector(
    (state: RootState) => state.companies.status
  );
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLanguage());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (!!user && user.role === "superadmin" && companyStatus === "idle") {
      dispatch(fetchCompanies());
    }
  }, [companyStatus, dispatch, user]);

  const onFinish: FormProps<ILandingPage>["onFinish"] = async (values) => {
    // const res = await createUser(values);
    // if (res.success) {
    //   message.info(res.message);
    //   router.push("/dashboard/users/" + res.data.company);
    // } else {
    //   message.error(res.message);
    // }
  };

  return (
    <div className="mb-6 flex">
      <Form
        name="resource"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Title
          </label>
          <div className="relative">
            <Form.Item<ILandingPage> name="title">
              <Input
                size="large"
                type="text"
                placeholder="Title"
                className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </Form.Item>
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Image
          </label>

          <div className="relative">
            <Form.Item<ILandingPage> name="img">
              <FileUpload handleUploadFile={(img) => console.log("img", img)} />
            </Form.Item>
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Content
          </label>
          <div className="relative">
            <Form.Item<ILandingPage> name="content">
              <RinchTextEditor />
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

export default TemplateForm;
