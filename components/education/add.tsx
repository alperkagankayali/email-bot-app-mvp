"use client";
import React, { useEffect, useState } from "react";
import { Button, notification, Result, Steps, theme } from "antd";
import EducationInfoForm from "./form/educationInfoForm";
import EducationContentForm from "./form/educationContentForm";
import OrderForm from "./form/orderForm";
import {
  createEducation,
  updateEducation,
} from "@/services/service/educationService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  handleAddEducationFormValue,
  handleAddEducationListValue,
} from "@/redux/slice/education";

type IProps = {
  id?: string;
  lang: string;
};

const EducationAddForm: React.FC<IProps> = ({ id, lang }) => {
  const forms = useSelector((state: RootState) => state.education.forms);
  const dispatch = useDispatch<AppDispatch>();
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const steps = [
    {
      title: "Education Info",
      content: <EducationInfoForm next={next} lang={lang} />,
    },
    {
      title: "Education Content",
      content: <EducationContentForm next={next} lang={lang} />,
    },
    {
      title: "Education Content Order ",
      content: (
        <>
          <OrderForm lang={lang} />
        </>
      ),
    },
  ];
  const steps2 = [
    {
      title: "Education Created",
      key: 0,
      content: (
        <Result
          status="success"
          title="Successfully education created!"
          subTitle="Lütfen seçmiş olduğunuz tüm dilleri de eklereyerek kaydetme işlemini tamamlayınız."
        />
      ),
    },
  ];

  useEffect(() => {
    if (!!forms[lang]?.id) {
      setIsSuccess(true);
    }
  }, [forms, lang]);

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const contentStyle: React.CSSProperties = {
    color: token.colorTextTertiary,
    borderRadius: token.borderRadiusLG,
    marginTop: 16,
  };

 
  const onFinish = async () => {
    let res = null;
    debugger
    if (!!id) {
      res = await updateEducation(id, forms[lang]);
    } else {
      res = await await createEducation(forms[lang]);
    }
    if (res.success) {
      let defaultValue = [];
      dispatch(
        handleAddEducationFormValue({
          field: "id",
          language: lang,
          value: res.data?._id,
        })
      );
      if (!!forms.educations && Array.isArray(forms.educations)) {
        const someEducation = forms.educations?.some(
          (e) => e === res.data?._id
        );
        defaultValue = [...forms.educations];
        if (!someEducation) {
          dispatch(
            handleAddEducationListValue({
              field: "educations",
              value: [...defaultValue, res.data?._id],
            })
          );
        }
      } else {
        dispatch(
          handleAddEducationListValue({
            field: "educations",
            value: [res.data?._id],
          })
        );
      }
      notification.info({ message: "Başarıyla kaydedildi" });
    } else {
      notification.error({ message: res.message });
    }
  };

  return (
    <>
      <Steps current={current} items={isSuccess ? steps2 : items} />
      <div style={contentStyle}>
        {isSuccess ? steps2[0]?.content : steps[current]?.content}
      </div>
      <div className="mt-6 flex">
        {current === steps.length - 1 && (
          <Button type="primary" disabled={isSuccess} onClick={onFinish}>
            Education Save
          </Button>
        )}
        {!isSuccess && current > 0 &&   (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </>
  );
};

export default EducationAddForm;
