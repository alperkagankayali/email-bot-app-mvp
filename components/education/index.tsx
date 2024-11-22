"use client";

import { noImage } from "@/constants";
import { Link } from "@/i18n/routing";
import { fetchContent } from "@/redux/slice/education";
import { AppDispatch, RootState } from "@/redux/store";
import { Avatar, Button, List } from "antd";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const EducationList: React.FC = () => {
  const t = useTranslations("pages");
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(
    (state: RootState) => state.education.educationStatus
  );
  const data = useSelector(
    (state: RootState) => state.education.educationContent
  );
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchContent());
    }
  }, [status, dispatch]);

  return (
    <div>
      <div className="flex justify-end ">
        <Link href="/dashboard/education/add">
          <Button type="primary"> {t("menu-education-add")}</Button>
        </Link>
      </div>
      <div>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
              
                avatar={
                  <Image  src={item.img ?? noImage}  width={64} height={64} alt="content img"  />
                }
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default EducationList;
