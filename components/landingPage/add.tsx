"use client";

import { ILandingPage } from "@/types/scenarioType";
import TemplateForm from "../templateForm";
import { createLandingPage } from "@/services/service/generalService";
import { message } from "antd";
import { useRouter } from "@/i18n/routing";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { fetchLandingPage } from "@/redux/slice/scenario";

const AddLandingPageForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSave = async (data:ILandingPage) =>{
    const res = await createLandingPage(data);
    if(res.success) {
      dispatch(fetchLandingPage())
      router.push("/dashboard/scenario/landing-page")
    } 
    else {
      message.error(res.message)
    }
  }
  return (
    <div>
      <TemplateForm handleSave={handleSave}/>
    </div>
  );
};

export default AddLandingPageForm;
