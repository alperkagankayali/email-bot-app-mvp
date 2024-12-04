"use client";
import React, { useEffect, useState } from "react";
import { Button, notification, Steps, theme } from "antd";
import EducationInfoForm from "./form/educationInfoForm";
import EducationContentForm from "./form/educationContentForm";
import OrderForm from "./form/orderForm";
import { createEducation } from "@/services/service/educationService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "@/i18n/routing";
import { fetchContent, fetchEducationById } from "@/redux/slice/education";

type IProps = {
  id?: string;
};
const EducationAddForm: React.FC<IProps> = ({ id }) => {
  const educationContent = useSelector(
    (state: RootState) => state.education.createEducation
  );
  const detailStatus = useSelector(
    (state: RootState) => state.education.educationDetailStatus
  );
  const educationDetail = useSelector(
    (state: RootState) => state.education.educationDetail
  );
  const dispatch = useDispatch<AppDispatch>();
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: "Education Info",
      content: <EducationInfoForm next={next} />,
    },
    {
      title: "Education Content",
      content: <EducationContentForm next={next} />,
    },
    {
      title: "Education Content Order ",
      content: (
        <>
          <OrderForm />
        </>
      ),
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    color: token.colorTextTertiary,
    borderRadius: token.borderRadiusLG,
    marginTop: 16,
  };
  const router = useRouter();

  useEffect(() => {
    if (!!id && educationDetail?._id !== id && detailStatus !== 'loading') {
      dispatch(fetchEducationById(id));
    }
  }, [detailStatus, dispatch, id]);

  const onFinish = async () => {
    const res = await createEducation(educationContent);
    if (res.status) {
      notification.info({ message: "Başarıyla kaydedildi" });
      dispatch(fetchContent(6));
      router.push("/dashboard/education");
    } else {
      notification.error({ message: res.message });
    }
  };

  return (
    <>
      <Steps current={current} items={items} />
      <div style={contentStyle}>{steps[current]?.content}</div>
      <div className="mt-6 flex">
        {current === steps.length - 1 && (
          <Button type="primary" onClick={onFinish}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </>
  );
};

export default EducationAddForm;
