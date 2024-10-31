"use client";

import { ILandingPage } from "@/types/scenarioType";
import {
  getDataEntries,
  updateDataEntry,
} from "@/services/service/generalService";
import { message } from "antd";
import { useRouter } from "@/i18n/routing";
import TemplateForm from "../templateForm";
import { useEffect, useState } from "react";
import Loader from "../common/Loader";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchDataEntry } from "@/redux/slice/scenario";

type IProps = {
  id: string;
};
const UpdateDataEntryForm: React.FC<IProps> = ({ id }) => {
  const router = useRouter();
  const [data, setData] = useState<ILandingPage | null>(null);
  const dispatch= useDispatch<AppDispatch>()

  useEffect(() => {
    async function fetchDataEntry() {
      const res = await getDataEntries(id);
      if (res.status) {
        setData(res.data);
      } else {
        message.error(res.message);
      }
    }
    fetchDataEntry();
  }, []);

  const handleSave = async (data: ILandingPage) => {
    const res = await updateDataEntry(id, data);
    if (res.success) {
      dispatch(fetchDataEntry())
      router.push("/dashboard/scenario/data-entries");
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
        img={data?.img}
        defaultContent={data?.content}
      />
    </div>
  );
};

export default UpdateDataEntryForm;
