"use client";

import { ILandingPage } from "@/types/scenarioType";
import {
  getLandingPage,
  updateLandingPage,
} from "@/services/service/generalService";
import { message } from "antd";
import { useRouter } from "@/i18n/routing";
import TemplateForm from "../templateForm";
import { useEffect, useState } from "react";
import Loader from "../common/Loader";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchLandingPage } from "@/redux/slice/scenario";
import { useForm } from "antd/es/form/Form";

type IProps = {
  id: string;
};
const UpdateLandingPageForm: React.FC<IProps> = ({ id }) => {
  const router = useRouter();
  const [data, setData] = useState<ILandingPage | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [form] = useForm();

  useEffect(() => {
    async function fetchLandingPage() {
      const res = await getLandingPage({ id });
      if (res.success) {
        form.setFieldsValue(res.data)
        setData(res.data);
      } else {
        message.error(res.message);
      }
    }
    fetchLandingPage();
  }, []);

  const handleSave = async (data: ILandingPage) => {
    const res = await updateLandingPage(id, data);
    if (res.success) {
      dispatch(fetchLandingPage({ limit: 8 }));
      router.push("/dashboard/scenario/landing-page");
    } else {
      message.error(res.message);
    }
  };

  if (data === null) {
    return <Loader />;
  }

  return (
    <div>
      <TemplateForm
        handleSave={handleSave}
        title={data?.title}
        form={form}
        img={data?.img}
        defaultContent={data?.content}
      />
    </div>
  );
};

export default UpdateLandingPageForm;
