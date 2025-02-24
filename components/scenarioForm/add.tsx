"use client";
import React, { useEffect } from "react";
import ScenarioForm from ".";
import { notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "@/i18n/routing";
import { createScenario } from "@/services/service/scenarioService";
import { changeScenarioStatus, handleChangeScenarioData } from "@/redux/slice/scenario";

const AddScenarioForm: React.FC = () => {
  const router = useRouter();
  const newScenario = useSelector(
    (state: RootState) => state.scenario.creteScenario
  );
  const dispatch = useDispatch();
  const handleCreateScenario = async () => {
    const res = await createScenario(newScenario);
    if (res.success) {
      dispatch(handleChangeScenarioData(null));
      dispatch(changeScenarioStatus("idle"))
      router.push("/dashboard/scenario");
    } else {
      notification.error({ message: res.message });
    }
  };

  useEffect(() => {
    return () => {
      dispatch(handleChangeScenarioData(null));
    };
  }, []);

  return (
    <>
      <ScenarioForm handleCreateScenario={handleCreateScenario} />
    </>
  );
};

export default AddScenarioForm;
