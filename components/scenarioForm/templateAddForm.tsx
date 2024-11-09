"use client";

import { ILandingPage } from "@/types/scenarioType";
import TemplateForm from "../templateForm";
import {
  createDataEntry,
  createEmailTemplate,
  createLandingPage,
} from "@/services/service/generalService";
import { message } from "antd";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDataEntry,
  fetchEmailTemplate,
  fetchLandingPage,
  handleChangeScenarioData,
} from "@/redux/slice/scenario";
type IProps = {
  changeTab: (x: string) => void;
  type: "emailTemplate" | "landingPage" | "dataEntry";
};

const TemplateAddForm: React.FC<IProps> = ({ changeTab, type }) => {
  const dispatch = useDispatch<AppDispatch>();
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
        dispatch(fetchEmailTemplate());
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
        dispatch(fetchLandingPage());
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
        dispatch(fetchDataEntry());
      } else {
        message.error(res.message);
      }
    }
  };

  return (
    <div>
      <TemplateForm handleSave={handleSave} istType={true} />
    </div>
  );
};

export default TemplateAddForm;
