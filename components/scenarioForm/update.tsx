"use client";
import React, { useEffect } from "react";
import ScenarioForm from ".";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchScenario,
  handleChangeScenarioData,
} from "@/redux/slice/scenario";
import Loader from "../common/Loader";
import { useRouter } from "@/i18n/routing";
import { notification } from "antd";
import {
  getScenario,
  updateScenario,
} from "@/services/service/scenarioService";
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
      dispatch(fetchScenario({ limit: 8, page: 1 }));
      router.push("/dashboard/scenario");
    } else {
      notification.error({ message: res.message });
    }
  };

  useEffect(() => {
    async function fetchtScenarioById() {
      const res = await getScenario({ id });
      if (res.success) {
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
