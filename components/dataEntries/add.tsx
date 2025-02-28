"use client";

import { ILandingPage } from "@/types/scenarioType";
import TemplateForm from "../templateForm";
import { createDataEntry } from "@/services/service/generalService";
import { message } from "antd";
import { useRouter } from "@/i18n/routing";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { fetchDataEntry } from "@/redux/slice/scenario";

const AddDataEntryForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSave = async (data: ILandingPage) => {
    const res = await createDataEntry(data);
    if (res.success) {
      dispatch(fetchDataEntry({ limit: 8, page: 1 }));
      router.push("/dashboard/scenario/data-entries");
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

export default AddDataEntryForm;
