"use client";

import { Link } from "@/i18n/routing";
import { BankOutlined, BookOutlined, MailOutlined } from "@ant-design/icons";
import { Segmented } from "antd";
import { useTranslations } from "next-intl";

const CampaignForm: React.FC = () => {
  const t = useTranslations("pages");

  return (
    <div className="flex">
      <div className="w-full border-2 p-5  bg-[#3d50e0] text-white border-[#3d50e0] rounded-xl">
        <Link href={"/dashboard/campaign/add/phishing"}>
          <div
            className="flex items-center flex-col justify-center  w-full "
            style={{
              height: "calc(100vh - 350px)",
            }}
          >
            <MailOutlined className="text-[60px] " />
            <p className="mt-4 text-2xl pl-2">
              {" "}
              {t("create-phishing-campaign")}
            </p>
          </div>
        </Link>
      </div>
      <div className="flex justify-center flex-col items-center gap-4  w-full ml-4">
        <Link
          href={"/dashboard/campaign/add/education"}
          className="w-full h-full border-2 border-[#b328df] rounded-xl"
          style={{
            background:
              "linear-gradient(90deg, rgba(181, 39, 223, 1) 0%, rgb(169 44 223) 35%, rgb(123 135 221) 100%)",
          }}
        >
          <div className="flex items-center flex-col p-5 justify-center mb-4  h-full  text-white w-full rounded-xl">
            <BankOutlined className="text-[60px] " />
            <p className="mt-4 text-2xl pl-2">
              {" "}
              {t("create-education-campaign")}
            </p>
          </div>
        </Link>
        <Link
          href={"/dashboard/campaign/add/news"}
          className="w-full h-full border-2 rounded-xl"
          style={{
            background:
              "linear-gradient(90deg, rgb(207, 22, 28) 0%, rgb(198 35 90) 35%, rgb(202 79 148) 100%)",
          }}
        >
          <div className="flex items-center flex-col p-5 justify-center h-full mb-4  text-white w-full rounded-xl">
            <BookOutlined className="text-[60px] " />
            <p className="mt-4 text-2xl pl-2"> {t("create-news-campaign")}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CampaignForm;
