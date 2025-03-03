"use client";
import React, { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Collapse,
  CollapseProps,
  Form,
  FormListFieldData,
  Input,
  notification,
  Radio,
  Select,
  Space,
  theme,
} from "antd";
import { IQuizType } from "@/types/quizType";
import {
  createQuiz,
  getQuiz,
  updateQuiz,
} from "@/services/service/educationService";
import { useRouter } from "@/i18n/routing";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchQuiz } from "@/redux/slice/education";
import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";

type IProps = {
  redirect?: boolean;
  quizId?: string;
};

const QuizForm: React.FC<IProps> = ({ redirect = false, quizId }) => {
  const [fieldsState, setFields] = useState<IQuizType>();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const languages = useSelector((state: RootState) => state.language.language);
  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: "white",
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  const onFinish = async (values: IQuizType) => {
    let res = null;
    if (!!quizId) {
      res = await updateQuiz(quizId, values);
    } else {
      res = await createQuiz(values);
    }
    if (res.success) {
      notification.info({ message: "Başarıyla kaydedildi" });
      if (redirect) {
        dispatch(fetchQuiz(10));
        router.push("/dashboard/academy/quiz");
      }
    } else {
      notification.error({ message: res.message });
    }
  };

  useEffect(() => {
    if (!!quizId) {
      const fetchArticleById = async () => {
        const res = await getQuiz({ id: quizId });
        form.setFieldsValue({
          title: res.data.title,
          description: res.data.description,
          question: res.data.question,
        });
      };
      fetchArticleById();
    }
  }, [quizId]);

  const getItems: (
    panelStyle: CSSProperties,
    fields: FormListFieldData[],
    remove: (index: number | number[]) => void
  ) => CollapseProps["items"] = (panelStyle, fields, remove) => {
    return fields.map((field, index) => {
      return {
        key: index + 1,
        label: t("question") + (field.name + 1),
        children: (
          <div key={field.key}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: t("necessary-title"),
                },
              ]}
              label={t("question")}
              name={[field.name, "title"]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t("type")}
              name={[field.name, "type"]}
              rules={[
                {
                  required: true,
                  message: t("necessary-title-2"),
                },
              ]}
            >
              <Radio.Group>
                <Radio value="single">{t("single-choose")}</Radio>
                <Radio
                  value="multiple"
                  disabled={
                    fieldsState?.question[field.name]?.options === undefined ||
                    fieldsState?.question[field.name]?.options?.length === 0 ||
                    fieldsState?.question[field.name]?.options?.length === 1
                  }
                >
                  {t("multiple-choose")}
                </Radio>
              </Radio.Group>
            </Form.Item>
            {!!fieldsState &&
              fieldsState?.question[field.name]?.type === "single" && (
                <Form.Item label={t("answer")} name={[field.name, "answer"]}>
                  <Radio.Group>
                    {!!fieldsState &&
                      fieldsState?.question[field.name]?.options?.map(
                        (e, index) => {
                          return (
                            <Radio value={e} key={index + e}>
                              {e}
                            </Radio>
                          );
                        }
                      )}
                  </Radio.Group>
                </Form.Item>
              )}
            {!!fieldsState &&
              fieldsState?.question[field.name]?.type === "multiple" && (
                <Form.Item label={t("answer")} name={[field.name, "answer"]}>
                  <Checkbox.Group>
                    {!!fieldsState &&
                      fieldsState?.question[field.name]?.options?.map(
                        (e, index) => {
                          return (
                            <Checkbox
                              value={e}
                              key={index + e}
                              className="leading-6"
                            >
                              {e}
                            </Checkbox>
                          );
                        }
                      )}
                  </Checkbox.Group>
                </Form.Item>
              )}
            {/* Nest Form.List */}
            <Form.Item label={t("options")}>
              <Form.List name={[field.name, "options"]}>
                {(subFields, subOpt) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      rowGap: 24,
                    }}
                  >
                    {subFields.map((subField) => (
                      <Space key={subField.key}>
                        <Form.Item noStyle name={subField.name}>
                          <Input placeholder={t("options")} />
                        </Form.Item>

                        <CloseOutlined
                          onClick={() => {
                            subOpt.remove(subField.name);
                          }}
                        />
                      </Space>
                    ))}

                    <Button type="dashed" onClick={() => subOpt.add()} block>
                      + {t("add-a-option")}
                    </Button>
                  </div>
                )}
              </Form.List>
            </Form.Item>
          </div>
        ),
        extra: (
          <CloseOutlined
            onClick={() => {
              remove(field.name);
            }}
          />
        ),
        style: panelStyle,
      };
    });
  };

  const t = useTranslations("pages");

  return (
    <div className=" flex justify-center w-full">
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        form={form}
        name="dynamic_form_complex"
        className="w-full"
        style={{ maxWidth: 600 }}
        autoComplete="off"
        initialValues={{ items: [{}] }}
        onFinish={onFinish}
        onValuesChange={(_, allFields) => {
          setFields(allFields);
        }}
        onFinishFailed={() => {
          notification.error({ message: t("form-require-error") });
        }}
      >
        <Form.Item
          layout="vertical"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          label={t("label")}
          name="title"
          rules={[{ required: true }]}
          className="!mb-10 h-12"
        >
          <Input />
        </Form.Item>
        <Form.Item
          layout="vertical"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          name="description"
          label={t("description")}
          className="!mb-10"
        >
          <Input.TextArea rows={1} />
        </Form.Item>
        <Form.Item
          layout="vertical"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          label={t("resources-language")}
          name="language"
          rules={[{ required: true }]}
          className="!mb-10 h-12"
        >
          <Select
            size="large"
            className="w-full"
            placeholder={t("resources-language")}
            options={languages?.map((type) => {
              return { value: type._id, label: type.name };
            })}
          />
        </Form.Item>
        <Form.List name="question">
          {(fields, { add, remove }) => {
            return (
              <div
                style={{
                  display: "flex",
                  rowGap: 16,
                  flexDirection: "column",
                }}
              >
                <Collapse
                  bordered={false}
                  defaultActiveKey={["1"]}
                  // expandIcon={({ isActive }) => (
                  //   <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  // )}
                  items={getItems(panelStyle, fields, remove)}
                />
                <Button type="dashed" onClick={() => add()} block>
                  + {t("add-a-question")}
                </Button>
              </div>
            );
          }}
        </Form.List>
        <Button type="primary" htmlType="submit" className="mt-4 w-full mb-10">
          {t("save-btn")}
        </Button>
        {/* <Form.Item noStyle shouldUpdate>
          {() => (
            <Typography>
              <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
            </Typography>
          )}
        </Form.Item> */}
      </Form>
    </div>
  );
};

export default QuizForm;
