"use client";

import { ILandingPage } from "@/types/scenarioType";
import TemplateForm from "../templateForm";
import { createEmailTemplate } from "@/services/service/generalService";
import { message } from "antd";
import { useRouter } from "@/i18n/routing";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { fetchEmailTemplate } from "@/redux/slice/scenario";

const AddEmailTemplateForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSave = async (data: ILandingPage) => {
    const res = await createEmailTemplate(data);
    if (res.success) {
      dispatch(fetchEmailTemplate());
      router.push("/dashboard/scenario/email-templates");
    } else {
      message.error(res.message);
    }
  };
  return (
    <div>
      <TemplateForm handleSave={handleSave} />
    </div>
  );
};

export default AddEmailTemplateForm;
