"use client";

import { ICampaign } from "@/types/campaignType";
import { Form, Input } from "antd";
import { useTranslations } from "next-intl";

const CampaignInfoForm: React.FC = () => {
  const t = useTranslations("pages");

  return (
    <div className="flex p-4 justify-center flex-col items-center h-full mt-20">
      <div className="mb-4 flex flex-col items-start w-full">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Title
        </label>
        <div className="relative w-full">
          <Form.Item<ICampaign>
            name="title"
            rules={[{ required: true, message: t("campaign-form-title-message") }]}
          >
            <Input
              size="large"
              type="text"
              placeholder="Title"
              className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </Form.Item>
        </div>
      </div>
      <div className="mb-4 flex flex-col items-start w-full">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Description
        </label>
        <div className="relative w-full">
          <Form.Item<ICampaign>
            name="description"
            rules={[{ required: true, message: t("campaign-form-description-message") }]}
          >
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
    </div>
  );
};

export default CampaignInfoForm;
