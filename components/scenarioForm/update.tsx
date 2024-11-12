"use client";
import React, { useEffect } from "react";
import ScenarioForm from ".";
import { getScenario, updateScenario } from "@/services/service/generalService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { handleChangeScenarioData } from "@/redux/slice/scenario";
import Loader from "../common/Loader";
import { useRouter } from "@/i18n/routing";
import { notification } from "antd";
type IProps = {
  id: string;
};

const UpdateScenarioForm: React.FC<IProps> = ({ id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const scenarioData = useSelector(
    (state: RootState) => state.scenario.creteScenario
  );
  const router = useRouter();

  const handleUpdateScenario = async () => {
    const res = await updateScenario(id, scenarioData);
    if (res.success) {
      router.push("/dashboard/scenario");
    } else {
      notification.error({ message: res.message });
    }
  };

  useEffect(() => {
    async function fetchtScenarioById() {
      const res = await getScenario({ id });
      if (res.status) {
        dispatch(
          handleChangeScenarioData({
            scenarioType: res.data.scenarioType?._id,
            language: res.data.language?._id,
            img: res.data.img,
            emailTemplate: res.data.emailTemplate?._id,
            landingPage: res.data?.landingPage?._id,
            dataEntry: res.data?.dataEntry?._id,
            title: res.data.title,
          })
        );
      }
    }
    fetchtScenarioById();
    return () => {
      dispatch(handleChangeScenarioData(null));
    };
  }, []);


  if (!!scenarioData) {
    return (
      <>
        <ScenarioForm handleCreateScenario={handleUpdateScenario} />
      </>
    );
  } else {
    return <Loader />;
  }
};

export default UpdateScenarioForm;
