"use client";
import type { CSSProperties } from "react";
import React, { useEffect, useState } from "react";
import { CaretRightOutlined, DeleteOutlined } from "@ant-design/icons";
import type { CollapseProps } from "antd";
import { Button, Collapse, Select, theme } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import EducationAddForm from "./add";
import clsx from "clsx";
import {
  handleAddEducationForm,
  handleAddEducationFormValue,
  handleAddEducationListValue,
} from "@/redux/slice/education";
import {
  createEducationList,
  getEducationListContent,
  updateEducationList,
} from "@/services/service/educationService";
import { useRouter } from "@/i18n/routing";
import { IContent, ICourse } from "@/types/courseType";
import { useTranslations } from "next-intl";
const { Option } = Select;
type IProps = {
  id?: string;
};
const EducationListAdd: React.FC<IProps> = ({ id }) => {
  const { token } = theme.useToken();
  const languages = useSelector((state: RootState) => state.language.language);
  const forms = useSelector((state: RootState) => state.education.forms);
  const [selectLang, setSelectLang] = useState<string[]>([]);
  const dispatch = useDispatch();
  const t = useTranslations("pages");

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: "white",
    borderRadius: token.borderRadiusLG,
    border: "none",
  };
  const router = useRouter();

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
            id={id}
            lang={e.replaceAll("(", "-").replaceAll(")", "").split("-")[1]}
          />
        ),
        style: panelStyle,
        extra: genExtra(e),
      };
    });
  };

  const handleCreateEducationList = async () => {
    let res = null;
    debugger
    if (!!id) {
      res = await updateEducationList(id, forms);
    } else {
      res = await createEducationList(forms);
    }
    if (res.success) {
      router.push("/dashboard/education");
    }
  };

  useEffect(() => {
    if (!!id && languages?.length > 0) {
      const getDetail = async () => {
        const response = await getEducationListContent(10, 1, { id });
        let newArr: any[] = [];
        response.data?.educations?.forEach((e: any) => {
          let prevValue: Array<any> = [];
          e?.contents?.forEach((content: IContent) => {
            const type: string =
              content.type === "quiz"
                ? "selectQuiz"
                : content.type === "article"
                  ? "selectArticle"
                  : "selectVideo";

            if (!!e[type] && Array.isArray(e[type])) {
              prevValue = e[type];
              e[type] = [...prevValue, content.refId];
            } else {
              e[type] = [content.refId];
            }
          });
          newArr.push({ language: e.language, values: e });
        });
        newArr.forEach((e) =>
          dispatch(
            handleAddEducationForm({ language: e.language, values: e.values })
          )
        );
        setSelectLang(
          response.data.languages?.map((element: string) => {
            const findLang = languages.find((e) => e.code === element);
            return findLang?.name + "(" + findLang?.code + ")";
          })
        );
      };
      getDetail();
    }
  }, [id]);

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
          onClick={handleCreateEducationList}
          disabled={
            !(
              !!forms.educations &&
              Array.isArray(forms.educations) &&
              forms?.educations?.length > 0
            )
          }
          className={clsx(
            "w-64 cursor-pointer rounded-lg border  !p-7  !text-white transition hover:bg-opacity-90",
            {
              " !bg-primary !border-primary":
                !!forms.educations &&
                Array.isArray(forms.educations) &&
                forms?.educations?.length > 0,
              "!border-[#7986ea] !bg-[#7986ea]": !(
                !!forms.educations &&
                Array.isArray(forms.educations) &&
                forms?.educations?.length > 0
              ),
            }
          )}
        >
          {t("save-btn")}
        </Button>
      </div>
    </div>
  );
};

export default EducationListAdd;
