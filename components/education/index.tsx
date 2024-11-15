"use client";

import { Link } from "@/i18n/routing";
import { Button } from "antd";
import { useTranslations } from "next-intl";

const EducationList: React.FC = () => {
  const t = useTranslations("pages");
  return (
    <div>
      <div className="flex justify-end">
        <Link href="/dashboard/education/add">
          <Button type="primary"> {t("menu-education-add")}</Button>
        </Link>
      </div>
    </div>
  );
};

export default EducationList;
