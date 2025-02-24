import { RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../common/Loader";
import { noImage } from "@/constants";
import { Card } from "antd";
import Image from "next/image";
import { useTranslations } from "next-intl";
import TemplateList from "./templateList";
import { handleChangeScenarioData } from "@/redux/slice/scenario";
const { Meta } = Card;
type IDataEntryTab = {
  isDataEntry: boolean;
  next: () => void;
  prev: () => void;
  current: number;
};

const DataEntryTab: React.FC<IDataEntryTab> = ({
  isDataEntry,
  next,
  prev,
  current,
}) => {
  const t = useTranslations("pages");
  const dispatch = useDispatch();
  const createScenario = useSelector(
    (state: RootState) => state.scenario.creteScenario
  );

  useEffect(() => {
    if (!isDataEntry) {
      dispatch(
        handleChangeScenarioData({ ...createScenario, dataEntry: null })
      );
    }
  }, [isDataEntry]);

  if (!!isDataEntry)
    return (
      <div>
        <TemplateList
          current={current}
          prev={prev}
          next={next}
          type="dataEntry"
        />
      </div>
    );
  else {
    return <p>{t("data-entry-check-message")}</p>;
  }
};

export default DataEntryTab;
