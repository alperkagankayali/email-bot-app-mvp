"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, notification, Result, Steps, theme } from "antd";
import EducationInfoForm from "./form/educationInfoForm";
// import EducationContentForm from "./form/educationContentForm";
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
import { useTranslations } from "next-intl";
import PreviewEducation from "./previewEducatio";
import ArticleTab from "./form/articleTab";
import QuizTab from "./form/quizTab";
import VideoTab from "./form/videoTab";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [form] = Form.useForm();
  const t = useTranslations("pages");
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: t("education-info"),
      content: <EducationInfoForm form={form} next={next} lang={lang} />,
    },
    // {
    //   title: t("education-content"),
    //   content: <EducationContentForm next={next} lang={lang} />,
    // },
    {
      title: t("menu-academy-article"),
      content: <ArticleTab lang={lang} />,
    },
    {
      title: t("menu-academy-video"),
      content: <VideoTab lang={lang} />,
    },
    {
      title: t("menu-academy-quiz"),
      content: <QuizTab lang={lang} />,
    },
    {
      title: t("education-content-order"),
      content: (
        <>
          <OrderForm lang={lang} />
        </>
      ),
    },
    {
      title: t("education-preview-form"),
      content: (
        <>
          <PreviewEducation next={next} lang={lang} />
        </>
      ),
    },
  ];
  const steps2 = [
    {
      title: t("education-created"),
      key: 0,
      content: (
        <Result
          status="success"
          title={t("education-created-message")}
          subTitle={t("education-created-message-2")}
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
      notification.info({ message: t(res.message) });
    } else {
      notification.error({ message: t(res.message) });
    }
  };

  const handleSubmit = () => {
    form.submit();
  };

  return (
    <>
      <div className="mb-4">
        {current !== steps.length - 1 && (
          <div className="flex w-full justify-between">
            <Button
              className="cursor-pointer rounded-lg border !border-black-2 !bg-transparent !p-7 !text-black transition hover:bg-opacity-90 mr-4"
              onClick={() => {
                if (current === 0) {
                  router.push("/dashboard/education");
                } else prev();
              }}
            >
              {current === 0 ? t("back-btn-form") : t("previous-btn")}
            </Button>

            {current > 0 ? (
              <Button
                onClick={next}
                // o
                className="cursor-pointer rounded-lg border !border-primary !bg-primary !p-7 !text-white transition hover:bg-opacity-90"
              >
                {t("save-and-continue")}
              </Button>
            ) : (
              <Button
                // onClick={handleSubmit}
                onClick={handleSubmit}
                className="cursor-pointer rounded-lg border !border-primary !bg-primary !p-7 !text-white transition hover:bg-opacity-90"
              >
                {t("save-and-continue")}
              </Button>
            )}
          </div>
        )}
        {current === steps.length - 1 && (
          <div className="flex w-full justify-between">
            <Button
              className="cursor-pointer rounded-lg border !border-black-2 !bg-transparent !p-7 !text-black transition hover:bg-opacity-90 mr-4"
              onClick={() => prev()}
            >
              {t("previous-btn")}
            </Button>
            <Button
              type="primary"
              className="cursor-pointer rounded-lg border !border-logo !bg-logo !p-7 !text-white transition hover:bg-opacity-90 mr-4"
              disabled={isSuccess}
              onClick={onFinish}
            >
              {t("done-btn")}
            </Button>
          </div>
        )}
      </div>
      <Steps
        type="default"
        className=""
        current={current}
        size="small"
        // onChange={(value) => setCurrent(value)}
        items={isSuccess ? steps2 : items}
      />
      <div style={contentStyle}>
        {isSuccess ? steps2[0]?.content : steps[current]?.content}
      </div>
      {/* <div className="mt-6 flex">
        {current === steps.length - 1 && (
          <Button type="primary" disabled={isSuccess} onClick={onFinish}>
            {t("save-btn")}
          </Button>
        )}
        {current + 1 === steps.length - 1 && (
          <Button type="primary" disabled={isSuccess} onClick={next}>
            {t("next-btn")}
          </Button>
        )}
        {!isSuccess && current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            {t("previous-btn")}
          </Button>
        )}
      </div> */}
    </>
  );
};

export default EducationAddForm;
