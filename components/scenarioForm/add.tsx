"use client";
import React from "react";
import ScenarioForm from ".";
import { notification } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "@/i18n/routing";
import { createScenario } from "@/services/service/scenarioService";

const AddScenarioForm: React.FC = () => {
  const router = useRouter();
  const newScenario = useSelector(
    (state: RootState) => state.scenario.creteScenario
  );
  const handleCreateScenario = async () => {
    const res = await createScenario(newScenario);
    if (res.success) {
      router.push("/dashboard/scenario");
    } else {
      notification.error({ message: res.message });
    }
  };

  return (
    <>
      <ScenarioForm handleCreateScenario={handleCreateScenario}/>
    </>
  );
};

export default AddScenarioForm;
