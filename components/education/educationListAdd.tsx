"use client";
import type { CSSProperties } from "react";
import React, { useEffect, useState } from "react";
import { CaretRightOutlined, DeleteOutlined } from "@ant-design/icons";
import type { CollapseProps } from "antd";
import { Button, Collapse, notification, Select, theme } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import EducationAddForm from "./add";
import clsx from "clsx";
import {
  handleAddEducationForm,
  handleAddEducationListValue,
} from "@/redux/slice/education";
import {
  createEducationList,
  getEducationListContent,
  updateEducationList,
} from "@/services/service/educationService";
import { useRouter } from "@/i18n/routing";
import { IContent } from "@/types/courseType";
import { useTranslations } from "next-intl";
import Loader from "../common/Loader";
const { Option } = Select;
type IProps = {
  id?: string;
};
const EducationListAdd: React.FC<IProps> = ({ id }) => {
  const { token } = theme.useToken();
  const languages = useSelector((state: RootState) => state.language.language);
  const forms = useSelector((state: RootState) => state.education.forms);
  const [selectLang, setSelectLang] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(!!id);
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
        value: value,
        field: "languages",
      })
    );
    setSelectLang(value);
  };

  const genExtra = (lang: string) => (
    <DeleteOutlined
      onClick={(event) => {
        handleChange(selectLang.filter((e) => e !== lang));
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
        children: <EducationAddForm id={id} lang={e} />,
        style: panelStyle,
        extra: genExtra(e),
      };
    });
  };

  const handleCreateEducationList = async () => {
    let res = null;
    if (selectLang.every((e: string) => !!forms[e])) {
      if (!!id) {
        res = await updateEducationList(id, forms);
      } else {
        res = await createEducationList(forms);
      }
      if (res.success) {
        router.push("/dashboard/education");
      }
    } else {
      notification.error({
        message:
          "Lütfen seçtiğiniz tüm dilleri doldurunuz yada dil seçimini düzenleyin.",
      });
    }
  };

  useEffect(() => {
    if (!!id && languages?.length > 0) {
      const getDetail = async () => {
        const response = await getEducationListContent(10, 1, { id });
        let newArr: any[] = [];
        setLoading(false)
        response.data?.educations?.forEach((e: any) => {
          debugger
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
        dispatch(
          handleAddEducationListValue({
            field: "educations",
            value: newArr.map((e) => e.values?._id),
          })
        );
        dispatch(
          handleAddEducationListValue({
            field: "languages",
            value: newArr.map((e) => e.language),
          })
        );
        setSelectLang(newArr.map((e) => e.language));
      };
      getDetail();
    }
  }, [id]);

  if (loading) {
    return <Loader />;
  }

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
            <Option key={e.code} value={e.code}>
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
