"use client";

import { useRouter } from "@/i18n/routing";
import { fetchCompanies } from "@/redux/slice/companies";
import { fetchLanguage } from "@/redux/slice/language";
import { AppDispatch, RootState } from "@/redux/store";
import { createUser } from "@/services/service/generalService";
import { IUser } from "@/types/userType";
import { Button, Form, Input, message, Select } from "antd";
import type { FormProps } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { sendVerificationEmail } from "@/services/service/emailService";

const { Option } = Select;

const AddUser = () => {
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
  const searchParams = useSearchParams();
  const company = searchParams.get("company");
  const role = searchParams.get("role");

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

  const onFinish: FormProps<IUser>["onFinish"] = async (values) => {
    const res = await createUser(values);
    if (res.success) {
      // Mail at
      const result = await sendVerificationEmail(
        res.data?._id ?? "",
        {
          resetLink:
            "https://email-bot-app-mvp-mx28.vercel.app/en/reset-password?token=" +
            res.data?._id,
        },
        "675756f633beb29459bc4aac"
      );
      console.log("res", result);
      message.info(res.message);
      router.push("/dashboard/users/" + res.data.company);
    } else {
      message.error(res.message);
    }
  };
  // Deperment dışındaki alanlar zorunlu olacak
  return (
    <Form
      name="resource"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <div className="mb-4">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Name Surname
        </label>
        <div className="relative">
          <Form.Item<IUser> name="nameSurname">
            <Input
              size="large"
              type="text"
              placeholder="Name Surname"
              className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </Form.Item>
        </div>
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Email
        </label>

        <div className="relative">
          <Form.Item<IUser> name="email">
            <Input
              size="large"
              type="text"
              placeholder="Email"
              className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </Form.Item>
        </div>
      </div>
      <div className="mb-4">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Department
        </label>
        <div className="relative">
          <Form.Item<IUser> name="department">
            <Input
              size="large"
              type="text"
              placeholder="department"
              className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </Form.Item>
        </div>
      </div>
      {!!user && companies?.length > 0 && (
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Companies
          </label>
          <div className="relative">
            <Form.Item<IUser> name="company">
              <Select size="large" defaultValue={company}>
                {companies?.map((company) => {
                  return (
                    <Option
                      key={company._id + company.companyName}
                      value={company._id}
                    >
                      {company.companyName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </div>
        </div>
      )}
      <div className="mb-4">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Role
        </label>
        <div className="relative">
          <Form.Item<IUser> name="role">
            <Select size="large" defaultValue={role}>
              <Option value="user">Kullanıcı</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
        </div>
      </div>
      <div className="mb-4">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Language
        </label>
        <div className="relative">
          <Form.Item<IUser> name="language">
            <Select size="large">
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
  );
};

export default AddUser;
