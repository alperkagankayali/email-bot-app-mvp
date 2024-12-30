"use client";

import { Link } from "@/i18n/routing";
import { BankOutlined, BookOutlined, MailOutlined } from "@ant-design/icons";
import { Segmented } from "antd";
import { useTranslations } from "next-intl";

const CampaignForm: React.FC = () => {
  const t = useTranslations("pages");

  return (
    <div className="flex justify-center flex-col items-center h-full mt-20">
      <Link href={"/dashboard/campaign/add/phishing"}>
        <div className="flex items-center border-2 p-5 justify-center mb-4 border-gray-600 w-203">
          <MailOutlined className="text-3xl text-black-2" />
          <p className="text-black-2 pl-2"> {t("create-phishing-campaign")}</p>
        </div>
      </Link>

      <Link href={"/dashboard/campaign/add/education"}>
        <div className="flex items-center border-2 p-5 justify-center mb-4 border-gray-600 w-203">
          <BankOutlined className="text-3xl text-black-2" />
          <p className="text-black-2 pl-2"> {t("create-education-campaign")}</p>
        </div>
      </Link>
      <Link href={"/dashboard/campaign/add/news"}>
        <div className="flex items-center border-2 p-5 justify-center mb-4 border-gray-600 w-203">
          <BookOutlined className="text-3xl text-black-2" />
          <p className="text-black-2 pl-2"> {t("create-news-campaign")}</p>
        </div>
      </Link>
    </div>
  );
};

export default CampaignForm;
