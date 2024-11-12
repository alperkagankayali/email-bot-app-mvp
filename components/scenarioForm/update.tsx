"use client";
import React from "react";
import ScenarioForm from ".";
type IProps = {
  id: string;
};

const UpdateScenarioForm: React.FC<IProps> = ({ id }) => {
  return (
    <>
      <ScenarioForm />
    </>
  );
};

export default UpdateScenarioForm;
