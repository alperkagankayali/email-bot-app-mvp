"use client";
import React, { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  notification,
  Radio,
  Space,
} from "antd";
import { IQuizType } from "@/types/quizType";
import { createQuiz } from "@/services/service/educationService";
import { useRouter } from "@/i18n/routing";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchQuiz } from "@/redux/slice/education";

type IProps = {
  redirect?: boolean;
};
const QuizForm: React.FC<IProps> = ({ redirect = false }) => {
  const [form] = Form.useForm();
  const [fieldsState, setFields] = useState<IQuizType>();
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter();
  const onFinish = async (values: IQuizType) => {
    const res = await createQuiz(values);
    if (res.success) {
      notification.info({ message: "Başarıyla kaydedildi" });
      if (redirect) {
        dispatch(fetchQuiz(10))
        router.push("/dashboard/academy/quiz");
      }
    } else {
      notification.error({ message: res.message });
    }
  };

  return (
    <div className="">
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        form={form}
        name="dynamic_form_complex"
        style={{ maxWidth: 600 }}
        autoComplete="off"
        initialValues={{ items: [{}] }}
        onFinish={onFinish}
        onValuesChange={(_, allFields) => {
          setFields(allFields);
        }}
      >
        <Form.Item
          layout="vertical"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          label="Title"
          name="title"
          rules={[{ required: true }]}
          className="!mb-10"
        >
          <Input />
        </Form.Item>
        <Form.Item
          layout="vertical"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          name="description"
          label="Description"
          className="!mb-10"
        >
          <Input.TextArea rows={1} />
        </Form.Item>
        <Form.List name="question">
          {(fields, { add, remove }) => {
            return (
              <div
                style={{ display: "flex", rowGap: 16, flexDirection: "column" }}
              >
                {fields.map((field) => (
                  <Card
                    size="small"
                    title={`Question ${field.name + 1}`}
                    key={field.key}
                    extra={
                      <CloseOutlined
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    }
                  >
                    <Form.Item
                      rules={[
                        {
                          required: true,
                          message: "Sorunun başlığı zorunludur.",
                        },
                      ]}
                      label="Title"
                      name={[field.name, "title"]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Type"
                      name={[field.name, "type"]}
                      rules={[
                        {
                          required: true,
                          message: "Soru tipi zorunludur.",
                        },
                      ]}
                    >
                      <Radio.Group>
                        <Radio value="single">Single Answer</Radio>
                        <Radio value="multiple">Multiple Answer</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {!!fieldsState &&
                      fieldsState?.question[field.name]?.type === "single" && (
                        <Form.Item label="answer" name={[field.name, "answer"]}>
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
                      fieldsState?.question[field.name]?.type ===
                        "multiple" && (
                        <Form.Item label="answer" name={[field.name, "answer"]}>
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
                    <Form.Item label="Options">
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
                                  <Input placeholder="option" />
                                </Form.Item>

                                <CloseOutlined
                                  onClick={() => {
                                    subOpt.remove(subField.name);
                                  }}
                                />
                              </Space>
                            ))}

                            <Button
                              type="dashed"
                              onClick={() => subOpt.add()}
                              block
                            >
                              + Add a option
                            </Button>
                          </div>
                        )}
                      </Form.List>
                    </Form.Item>
                  </Card>
                ))}

                <Button type="dashed" onClick={() => add()} block>
                  + Add a question
                </Button>
              </div>
            );
          }}
        </Form.List>
        <Button type="primary" htmlType="submit" className="mt-4 w-full mb-10">
          Kaydet
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
