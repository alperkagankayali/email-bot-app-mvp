"use client";

import { Link } from "@/i18n/routing";
import { BankOutlined, BookOutlined, MailOutlined } from "@ant-design/icons";
import { Segmented } from "antd";
import { useTranslations } from "next-intl";

const CampaignForm: React.FC = () => {
  const t = useTranslations("pages");

  return (
    <div className="flex">
      <div className="w-full ">
        <Link href={"/dashboard/campaign/add/phishing"}>
          <div
            className="flex items-center flex-col border-2 p-5 justify-center mb-4 bg-[#3d50e0] text-white border-[#3d50e0] rounded-xl w-full "
            style={{
              height: "calc(100vh - 350px)",
            }}
          >
            <MailOutlined className="text-[60px] " />
            <p className="mt-4 text-2xl pl-2"> {t("create-phishing-campaign")}</p>
          </div>
        </Link>
      </div>
      <div
        className="flex justify-center flex-col items-center  w-full ml-4"
        style={{
          height: "calc(100vh - 350px)",
        }}
      >
        <Link href={"/dashboard/campaign/add/education"} className="w-full">
          <div
            className="flex items-center flex-col border-2 p-5 justify-center mb-4  border-[#b328df] text-white w-full rounded-xl"
            style={{
              height: "calc(50vh - 195px)",
              background:
                "linear-gradient(90deg, rgba(181, 39, 223, 1) 0%, rgb(169 44 223) 35%, rgb(123 135 221) 100%)",
            }}
          >
            <BankOutlined className="text-[60px] " />
            <p className="mt-4 text-2xl pl-2"> {t("create-education-campaign")}</p>
          </div>
        </Link>
        <Link href={"/dashboard/campaign/add/news"} className="w-full">
          <div
            className="flex items-center flex-col border-2 p-5 justify-center mb-4 text-white border-[#ce192a] w-full rounded-xl"
            style={{
              height: "calc(50vh - 195px)",
              background:
                "linear-gradient(90deg, rgb(207, 22, 28) 0%, rgb(198 35 90) 35%, rgb(202 79 148) 100%)",
            }}
          >
            <BookOutlined className="text-[60px] " />
            <p className="mt-4 text-2xl pl-2"> {t("create-news-campaign")}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CampaignForm;
