"use client";
import React from "react";
import { AreaChartOutlined } from "@ant-design/icons";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
type FieldType = {
  username?: string;
  password?: string;
};

export default function Login() {
  const t = useTranslations('pages');

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
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
          <Link href={"/reset-password"}>Şifremi Unuttum</Link> |
          <Link href={"/sginup"}>Kayıt Ol</Link>
        </div>
      </div>
    </div>
  );
}
