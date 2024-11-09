"use client";

import { ILandingPage } from "@/types/scenarioType";
import TemplateForm from "../templateForm";
import { createEmailTemplate } from "@/services/service/generalService";
import { message } from "antd";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmailTemplate,
  fetchScenarioType,
  handleChangeScenarioData,
} from "@/redux/slice/scenario";
import { useEffect } from "react";
import Loader from "../common/Loader";
import useLocalStorage from "@/hooks/useLocalStorage";
type IProps = {
  changeTab: (x: string) => void;
};
const AddEmailTemplateForm: React.FC<IProps> = ({ changeTab }) => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(
    (state: RootState) => state.scenario.scenarioTypeStatus
  );
  const scenarioData = useSelector(
    (state: RootState) => state.scenario.creteScenario
  );
  const handleSave = async (data: ILandingPage) => {
    const res = await createEmailTemplate(data);
    if (res.success) {
      dispatch(
        handleChangeScenarioData({
          ...scenarioData,
          emailTemplate: res.data._id,
        })
      );
      dispatch(fetchEmailTemplate());
      changeTab("2");
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
      <TemplateForm handleSave={handleSave} istType={true} />
    </div>
  );
};

export default AddEmailTemplateForm;
