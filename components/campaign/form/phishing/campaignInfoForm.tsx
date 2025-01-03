"use client";
import React, { useEffect } from "react";
import { ICampaign } from "@/types/campaignType";
import { DatePicker, Form, Input, Radio, Select } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchScenarioType } from "@/redux/slice/scenario";
const { Option } = Select;

type IPorps = {
  isEducation: boolean;
  setIsEducation: (x: boolean) => void;
};
const CampaignInfoForm: React.FC<IPorps> = ({
  isEducation,
  setIsEducation,
}) => {
  const t = useTranslations("pages");
  const scenarioTypes = useSelector(
    (state: RootState) => state.scenario.scenarioType
  );
  const scenarioTypeStatus = useSelector(
    (state: RootState) => state.scenario.scenarioTypeStatus
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (scenarioTypeStatus === "idle") {
      dispatch(fetchScenarioType());
    }
  }, [dispatch, scenarioTypeStatus]);

  return (
    <div className="flex p-4 justify-center flex-col items-center h-full mt-20">
      <div className="mb-4 flex flex-col items-start w-full">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Title
        </label>
        <div className="relative w-full">
          <Form.Item<ICampaign>
            name="title"
            rules={[
              { required: true, message: t("campaign-form-title-message") },
            ]}
          >
            <Input
              size="large"
              type="text"
              placeholder="Title"
              className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </Form.Item>
        </div>
      </div>
      <div className="mb-4 flex flex-col items-start w-full">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Description
        </label>
        <div className="relative w-full">
          <Form.Item<ICampaign>
            name="description"
            rules={[
              {
                required: true,
                message: t("campaign-form-description-message"),
              },
            ]}
          >
            <Input
              size="large"
              type="text"
              required
              placeholder="Description"
              className="w-full rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </Form.Item>
        </div>
      </div>
      {!!scenarioTypes && scenarioTypes?.length > 0 && (
        <div className="mb-4 w-full">
          <label className="mb-2.5 block w-full text-left font-medium text-black dark:text-white">
            {t("scenario-type")}
          </label>
          <div className="relative">
            <Form.Item<ICampaign>
              name="scenarioType"
              rules={[
                {
                  required: true,
                  message: "Please input your scenario type!",
                },
              ]}
            >
              <Select
                size="large"
                placeholder={t("scenario-type")}
                className="w-full text-left"
              >
                {scenarioTypes?.map((scenario) => {
                  return (
                    <Option
                      key={scenario._id + scenario.title}
                      value={scenario._id}
                      required
                    >
                      {scenario.title}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </div>
        </div>
      )}
      <div className="mb-4 flex flex-col justify-start items-start w-full">
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          Add education after scenario ?
        </label>
        <div className="relative w-full">
          <Form.Item<ICampaign>
            name="isEducation"
            rules={[
              {
                required: true,
                message: t("campaign-form-description-message"),
              },
            ]}
          >
            <Radio.Group
              className="float-start"
              onChange={(e) => setIsEducation(e.target.value === "1")}
              defaultValue={isEducation ? "1" : "0"}
            >
              <Radio value="1"> Yes </Radio>
              <Radio value="0"> No </Radio>
            </Radio.Group>
          </Form.Item>
        </div>
      </div>
      {isEducation && (
        <div className="mb-4 flex flex-col justify-start items-start w-full">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            How long will the training be available ?
          </label>
          <div className="relative w-full">
            <Form.Item<ICampaign>
              name="created_at"
              rules={[
                {
                  required: true,
                  message: t("campaign-form-education-time-message"),
                },
              ]}
            >
              <DatePicker
                format={"DD/MM/YYYY"}
                placeholder="Education Avilable Date"
                className="w-4/12 float-start"
              />
            </Form.Item>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignInfoForm;
