"use client";
import React, { useEffect, useState } from "react";
import { AreaChartOutlined, DownOutlined } from "@ant-design/icons";
import type { FormProps } from "antd";
import { Form, Input, Select } from "antd";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "antd";
import { useRouter } from "@/i18n/routing";
type FieldType = {
  username?: string;
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

export default function Login({ locale }: IProps) {

  const [language, setLanguage] = useState<any[]>([]);
  const t = useTranslations("pages");
  const router = useRouter();

  const handleMenuClick = (e: ISelect) => {
    router.push("/", { locale: e.label });
  };
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };
  useEffect(() => {
    async function fetchPosts() {
      let res = await fetch("http://localhost:3000/api/language/get");
      let data = await res.json();
      const newList = data.languages.map((e: any) => {
        const newObj: any = {};
        newObj.label = e.code;
        newObj.value = e.name;
        newObj.id = e._id;
        return newObj;
      });
      setLanguage(newList);
    }
    fetchPosts();
  }, []);

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  if (!language) return <div>Loading...</div>;

  return (
    <div className="flex items-center h-screen justify-center">
      <div className="w-[500px] m-auto flex justify-center flex-col">
        <AreaChartOutlined className="text-[80px] m-auto mb-5" />
        <div
          className="p-5 w-full rounded-lg"
          style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600, minWidth: 300 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label={t("Username")}
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label={t("password")}
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          <div className="flex justify-between">
            <div>
              <Link href={"/reset-password"}>Şifremi Unuttum</Link> {" | "}
              <Link href={"/sginup"}>Kayıt Ol</Link>
            </div>
            {language?.length > 0 && (
              <Select
                labelInValue
                defaultValue={language.find((e: any) => e.label === locale)}
                style={{ width: 120 }}
                onChange={handleMenuClick}
                options={language}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
