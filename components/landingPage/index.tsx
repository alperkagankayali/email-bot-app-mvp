"use client";
import React, { useEffect } from "react";
import { Card } from "antd";
import { noImage } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchLandingPage } from "@/redux/slice/scenario";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const { Meta } = Card;

const LandingPageList: React.FC = () => {
  const status = useSelector(
    (state: RootState) => state.scenario.landingPageStatus
  );
  const data = useSelector((state: RootState) => state.scenario.landingPage);
  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslations("pages");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLandingPage());
    }
  }, [status, dispatch]);

  return (
    <div>
      <Link
        href={"/dashboard/scenario/landing-page/add"}
        className="bg-[#1677ff] text-white px-4 py-2 rounded-md"
      >
        {t("landing-page-add")}
      </Link>

      <div className="grid grid-cols-4 gap-2">
        {data?.map((landingpage) => {
          return (
            <Card
              key={landingpage._id}
              hoverable
              loading={status === "loading"}
              style={{ width: 240 }}
              cover={
                <img
                  alt={landingpage.title}
                  height={150}
                  src={status === "loading" ? noImage : landingpage.img}
                />
              }
            >
              <Meta title={landingpage.title} />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LandingPageList;
