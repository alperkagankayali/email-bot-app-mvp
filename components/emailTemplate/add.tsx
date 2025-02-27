"use client";

import { IEmailTemplate, ILandingPage } from "@/types/scenarioType";
import TemplateForm from "../templateForm";
import { createEmailTemplate } from "@/services/service/generalService";
import { message, notification } from "antd";
import { useRouter } from "@/i18n/routing";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmailTemplate, fetchScenarioType } from "@/redux/slice/scenario";
import { useEffect } from "react";
import Loader from "../common/Loader";
import { useTranslations } from "next-intl";

const AddEmailTemplateForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslations("pages");
  const status = useSelector(
    (state: RootState) => state.scenario.scenarioTypeStatus
  );
  const handleSave = async (data: IEmailTemplate) => {
    const res = await createEmailTemplate(data);
    if (res.success) {
      notification.success({ message: t(res.message) });
      dispatch(fetchEmailTemplate({ limt: 8, page: 1 }));
      router.push("/dashboard/scenario/email-templates");
    } else {
      message.error(res.message);
    }
  };
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchScenarioType());
    }
  }, [status, dispatch]);

  if (status !== "succeeded") {
    return <Loader />;
  }
  return (
    <div>
      <TemplateForm handleSave={handleSave} istType={true} isLanguage={true}/>
    </div>
  );
};

export default AddEmailTemplateForm;
