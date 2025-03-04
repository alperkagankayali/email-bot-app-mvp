"use client";
import { useRouter } from "@/i18n/routing";
import {  RootState } from "@/redux/store";
import {
  createUser,
  getAllUsers,
  updateUser,
} from "@/services/service/generalService";
import { IUser } from "@/types/userType";
import { Button, Form, Input,  notification, Select } from "antd";
import type { FormProps } from "antd";
import { useEffect } from "react";
import {  useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { sendVerificationEmail } from "@/services/service/emailService";
import { useTranslations } from "next-intl";
import { useForm } from "antd/es/form/Form";

const { Option } = Select;
type IProps = {
  id?: string;
};
const AddUser: React.FC<IProps> = ({ id }) => {
  const router = useRouter();
  const t = useTranslations("pages");
  const languages = useSelector((state: RootState) => state.language.language);
  const user = useSelector((state: RootState) => state.user.user);
  const searchParams = useSearchParams();
  const company = searchParams.get("companyId");
  const role = searchParams.get("role");
  const [form] = useForm();

  const onFinish: FormProps<IUser>["onFinish"] = async (values) => {
    if (!!id) {
      const res = await updateUser(id, values);
      if (res.success) {
        notification.info({ message: t(res.message) });
        router.back();
      } else notification.error({ message: res.message });
    } else {
      (values.company as any) =
        user?.role === "superadmin" ? (company as string) : user?.companyId;
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
        notification.info({ message: t(res.message) });
        router.push("/dashboard/users/" + res.data.company);
      } else {
        notification.error({ message: t(res.message) });
      }
    }
  };

  useEffect(() => {
    if (!!id) {
      const fetchUserById = async () => {
        const res = await getAllUsers(id ?? "");
        if (res.success) {
          form.setFieldsValue(res.data);
        }
      };
      fetchUserById();
    }
  }, [id]);

  return (
    <Form
      name="resource"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      form={form}
      autoComplete="off"
    >
      <div className="mb-4">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          {t("user-table-name-surname")}
        </label>
        <div className="relative">
          <Form.Item<IUser> name="nameSurname">
            <Input
              size="large"
              type="text"
              placeholder={t("user-table-name-surname")}
              className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </Form.Item>
        </div>
      </div>

      <div className="mb-6">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          {t("user-table-email")}
        </label>

        <div className="relative">
          <Form.Item<IUser> name="email">
            <Input
              size="large"
              type="text"
              placeholder={t("user-table-email")}
              className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </Form.Item>
        </div>
      </div>
      <div className="mb-4">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          {t("user-table-department")}
        </label>
        <div className="relative">
          <Form.Item<IUser> name="department">
            <Input
              size="large"
              type="text"
              placeholder={t("user-table-department")}
              className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </Form.Item>
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          {t("user-table-role")}
        </label>
        <div className="relative">
          <Form.Item<IUser> name="role">
            <Select size="large" defaultValue={role}>
              <Option value="user">{t("user-table-user-option")}</Option>
              <Option value="admin">{t("user-table-admin-option")}</Option>
            </Select>
          </Form.Item>
        </div>
      </div>
      <div className="mb-4">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          {t("user-table-language")}
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
              {t("save-btn")}
            </Button>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default AddUser;
