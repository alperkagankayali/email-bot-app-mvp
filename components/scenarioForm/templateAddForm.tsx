"use client";

import { ILandingPage } from "@/types/scenarioType";
import TemplateForm from "../templateForm";
import {
  createDataEntry,
  createEmailTemplate,
  createLandingPage,
} from "@/services/service/generalService";
import { Form, message } from "antd";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDataEntry,
  fetchEmailTemplate,
  fetchLandingPage,
  handleChangeScenarioData,
} from "@/redux/slice/scenario";
import { useEffect } from "react";
type IProps = {
  changeTab: (x: string) => void;
  type: "emailTemplate" | "landingPage" | "dataEntry";
};

const TemplateAddForm: React.FC<IProps> = ({ changeTab, type }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const scenarioData = useSelector(
    (state: RootState) => state.scenario.creteScenario
  );
  const handleSave = async (data: ILandingPage) => {
    if (type === "emailTemplate") {
      const res = await createEmailTemplate(data);
      if (res.success) {
        dispatch(
          handleChangeScenarioData({
            ...scenarioData,
            emailTemplate: res.data._id,
          })
        );
        dispatch(fetchEmailTemplate(6));
        changeTab("2");
      } else {
        message.error(res.message);
      }
    } else if (type === "landingPage") {
      const res = await createLandingPage(data);
      if (res.success) {
        dispatch(
          handleChangeScenarioData({
            ...scenarioData,
            landingPage: res.data._id,
          })
        );
        dispatch(fetchLandingPage(6));
      } else {
        message.error(res.message);
      }
    } else if (type === "dataEntry") {
      const res = await createDataEntry(data);
      if (res.success) {
        dispatch(
          handleChangeScenarioData({
            ...scenarioData,
            dataEntry: res.data._id,
          })
        );
        dispatch(fetchDataEntry(6));
      } else {
        message.error(res.message);
      }
    }
  };
  const onReset = () => {
    form.resetFields();
  };
  useEffect(() => {
    onReset();
  }, [type]);
  return (
    <div>
      <TemplateForm
        handleSave={handleSave}
        istType={true}
        form={form}
        handleResetForm={onReset}
      />
    </div>
  );
};

export default TemplateAddForm;
