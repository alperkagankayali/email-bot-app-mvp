"use client";
import type { CSSProperties } from "react";
import React, { useState } from "react";
import { CaretRightOutlined, DeleteOutlined } from "@ant-design/icons";
import type { CollapseProps } from "antd";
import { Button, Collapse, Select, theme } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import EducationAddForm from "./add";
import clsx from "clsx";
import { handleAddEducationListValue } from "@/redux/slice/education";
const { Option } = Select;

const EducationListAdd: React.FC = () => {
  const { token } = theme.useToken();
  const languages = useSelector((state: RootState) => state.language.language);
  const [selectLang, setSelectLang] = useState<string[]>([]);
  const dispatch = useDispatch();
  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: "white",
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  const handleChange = (value: string[]) => {
    dispatch(
      handleAddEducationListValue({
        value: value.map(
          (e) => e.replaceAll("(", "-").replaceAll(")", "").split("-")[1]
        ),
        field: "languages",
      })
    );
    setSelectLang(value);
  };

  const genExtra = (lang: string) => (
    <DeleteOutlined
      onClick={(event) => {
        setSelectLang(selectLang.filter((e) => e !== lang));
        event.stopPropagation();
      }}
    />
  );

  const getItems: (
    panelStyle: CSSProperties,
    selectLang: string[]
  ) => CollapseProps["items"] = (panelStyle, selectLang) => {
    return selectLang.map((e, index) => {
      return {
        key: index + 1,
        label: e + " Education - " + (index + 1),
        children: (
          <EducationAddForm
            lang={e.replaceAll("(", "-").replaceAll(")", "").split("-")[1]}
          />
        ),
        style: panelStyle,
        extra: genExtra(e),
      };
    });
  };

  return (
    <div>
      <Select
        mode="multiple"
        allowClear
        placeholder="Please select language"
        style={{ width: "100%" }}
        size="large"
        rootClassName="!mb-6"
        onChange={handleChange}
        value={selectLang}
      >
        {languages.map((e) => {
          return (
            <Option key={e.code} value={e.name + "(" + e.code + ")"}>
              {e.name}
            </Option>
          );
        })}
      </Select>
      <Collapse
        bordered={false}
        defaultActiveKey={["1"]}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        items={getItems(panelStyle, selectLang)}
      />
      <div className="flex justify-end">
        <Button
          htmlType="submit"
          disabled
          className={clsx(
            "w-64 cursor-pointer rounded-lg border  !p-7  !text-white transition hover:bg-opacity-90",
            {
              " !bg-primary !border-primary": false,
              "!border-[#7986ea] !bg-[#7986ea]": true,
            }
          )}
        >
          Kaydet
        </Button>
      </div>
    </div>
  );
};

export default EducationListAdd;