"use client";
import React, { useEffect, useState } from "react";
import type { FormProps } from "antd";
import { Form, Input, Select, message, notification } from "antd";
import { Link } from "@/i18n/routing";
import { Button } from "antd";
import { useRouter } from "@/i18n/routing";
import {
  getLanguage,
  handleLogin,
  updatePassword,
} from "@/services/service/generalService";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { userInfo } from "@/redux/slice/user";
import { useTranslations } from "next-intl";
import Loader from "../common/Loader";
import { useSearchParams } from "next/navigation";

type FieldType = {
  passwordTwo?: string;
  password?: string;
};

export type IProps = {
  locale: string;
};
export type ISelect = {
  id: string;
  label: "en" | "de" | "tr";
  value: string;
};

export default function ResetPasswordCom({ locale }: IProps) {
  const [language, setLanguage] = useState<any[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const t = useTranslations("pages");
  const searchParams = useSearchParams();
  const id = searchParams.get("token");

  const handleMenuClick = (e: ISelect) => {
    router.push("/", { locale: e.label });
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (!!id) {
      if (
        !!values.password &&
        !!values.passwordTwo &&
        values.password === values?.passwordTwo
      ) {
        const res = await updatePassword(id, values.password);
        if (res.success) {
          router.push("/");
        } else {
          notification.open({
            type: "error",
            message: t("login-failed"),
            description: t("login-failedDesc"),
          });
        }
      } else {
        message.error("Invalid form data");
      }
    }
    else {
        message.error("Invalid password url");
      }
  };

  useEffect(() => {
    async function fetchResource() {
      const res: any = await getLanguage();
      const newList = res?.data?.map((e: any) => {
        const newObj: any = {};
        newObj.label = e.code;
        newObj.value = e.name;
        newObj.id = e._id;
        return newObj;
      });
      setLanguage(newList);
    }
    fetchResource();
  }, []);

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  if (!language) return <Loader />;

  return (
    <div className="flex items-center h-screen justify-center">
      <div className="m-auto flex justify-center flex-col">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-wrap items-center">
            <div className="hidden w-full xl:block xl:w-1/2">
              <div className="px-26 py-17.5 text-center">
                <Link className="mb-5.5 inline-block" href="/">
                  <Image
                    className="hidden dark:block"
                    src={"/images//logo/logo-dark.svg"}
                    alt="Logo"
                    width={176}
                    height={32}
                  />
                  <Image
                    className="dark:hidden"
                    src={"/images//logo/logo-dark.svg"}
                    alt="Logo"
                    width={176}
                    height={32}
                  />
                </Link>
                <div className="flex justify-center mb-4">
                  {language?.length > 0 && (
                    <Select
                      labelInValue
                      defaultValue={language.find((e) => e.label === locale)}
                      style={{ width: 120 }}
                      onChange={handleMenuClick}
                      options={language}
                    />
                  )}
                </div>
                <p className="2xl:px-20">{t("login-description")}</p>

                <span className="mt-15 inline-block">
                  <Image
                    className="dark:hidden"
                    src={"/images/login.svg"}
                    alt="Logo"
                    width={176}
                    height={32}
                  />
                </span>
              </div>
            </div>

            <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
              <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                  {t("reset-password")}
                </h2>

                <Form
                  name="login"
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      {t("reset-password-pas-input")}
                    </label>
                    <div className="relative">
                      <Form.Item<FieldType>
                        name="password"
                        rules={[
                          {
                            required: true,
                            min: 7,
                            message: t("login-passwordError"),
                          },
                        ]}
                      >
                        <Input.Password
                          size="large"
                          min={7}
                          placeholder="6+ Characters, 1 Capital letter"
                          className="w-full rounded-lg border border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      {t("reset-password-pas-2-input")}
                    </label>

                    <div className="relative">
                      <Form.Item<FieldType>
                        name="passwordTwo"
                        rules={[
                          {
                            required: true,
                            min: 7,
                            message: t("login-passwordError"),
                          },
                        ]}
                      >
                        <Input.Password
                          size="large"
                          min={7}
                          placeholder="6+ Characters, 1 Capital letter"
                          className="w-full rounded-lg border border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          htmlType="submit"
                          className="w-full cursor-pointer rounded-lg border !border-primary !bg-primary !p-7 !text-white transition hover:bg-opacity-90"
                        >
                          {t("reset-password-button")}
                        </Button>
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
