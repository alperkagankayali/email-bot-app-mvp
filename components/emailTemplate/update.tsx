"use client";

import { IEmailTemplate, ILandingPage } from "@/types/scenarioType";
import {
  getEmailTemplate,
  updateEmailTemplate,
} from "@/services/service/generalService";
import { message } from "antd";
import { useRouter } from "@/i18n/routing";
import TemplateForm from "../templateForm";
import { useEffect, useState } from "react";
import Loader from "../common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchEmailTemplate, fetchScenarioType } from "@/redux/slice/scenario";

type IProps = {
  id: string;
};
const UpdateEmailTemplateForm: React.FC<IProps> = ({ id }) => {
  const router = useRouter();
  const [data, setData] = useState<IEmailTemplate | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(
    (state: RootState) => state.scenario.scenarioTypeStatus
  );
  useEffect(() => {
    async function fetchEmailTemplate() {
      const res = await getEmailTemplate(id);
      if (res.status) {
        setData(res.data);
      } else {
        message.error(res.message);
      }
    }
    fetchEmailTemplate();
  }, []);

  const handleSave = async (data: ILandingPage) => {
    const res = await updateEmailTemplate(id, data);
    if (res.success) {
      dispatch(fetchEmailTemplate());
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
  if (data === null) {
    return <Loader />;
  }

  return (
    <div>
      <TemplateForm
        handleSave={handleSave}
        title={data?.title}
        img={data?.img}
        defaultContent={data?.content}
        istType={true}
      />
    </div>
  );
};

export default UpdateEmailTemplateForm;
