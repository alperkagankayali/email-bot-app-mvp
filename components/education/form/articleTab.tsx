"use client";

import { AppDispatch, RootState } from "@/redux/store";
import ArticleForm from "./articleForm";
import { Card, Radio } from "antd";
import type { RadioChangeEvent } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchArticle,
  handleEducationDataChange,
} from "@/redux/slice/education";
import clsx from "clsx";
import { Checkbox } from "antd";
import type { CheckboxProps } from "antd";

const CheckboxGroup = Checkbox.Group;
const { Meta } = Card;

type IProps = {};
const optionsWithDisabled = [
  { label: "Select", value: "select" },
  { label: "Add", value: "add" },
];

const ArticleTab = ({}: IProps) => {
  const [value, setValue] = useState("select");
  const [selected, setSelected] = useState([]);
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector(
    (state: RootState) => state.education.articleStatus
  );
  const data = useSelector((state: RootState) => state.education.article);
  const createEducation = useSelector(
    (state: RootState) => state.education.createEducation
  );
  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    setValue(value);
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchArticle());
    }
  }, [status, dispatch]);
  return (
    <>
      <Radio.Group
        block
        options={optionsWithDisabled}
        defaultValue="select"
        optionType="button"
        onChange={onChange}
        buttonStyle="solid"
      />
      <div className="mt-5">
        {value === "add" && <ArticleForm />}

        {value === "select" && (
          <CheckboxGroup
            onChange={(e) => {
              if (!!createEducation) {
                dispatch(
                  handleEducationDataChange({
                    ...createEducation,
                    contents: e.map((element:any) => {
                      return { type: "article", order: 1, refId: element};
                    }),
                  })
                );
              }

              setSelected(e);
            }}
            className={"card-checkbox"}
            value={selected}
          >
            {data.map((article) => {
              const selectedArticle = selected.some((e) => e === article._id);
              return (
                <Checkbox value={article._id} key={article._id}>
                  <Card
                    className={clsx("!h-60", {
                      "!border !border-blue-700": selectedArticle,
                    })}
                    key={article._id}
                    hoverable
                    loading={status === "loading"}
                    style={{
                      width: 240,
                      boxShadow: selectedArticle
                        ? "0 1px 2px -2px rgba(0, 0, 0, 0.16),0 3px 6px 0 rgba(0, 0, 0, 0.12),0 5px 12px 4px rgba(0, 0, 0, 0.09)"
                        : "inherit",
                    }}
                  >
                    <Meta
                      title={article.title}
                      className="!line-clamp-3"
                      description={article?.description}
                    />
                  </Card>
                </Checkbox>
              );
            })}
          </CheckboxGroup>
        )}
      </div>
    </>
  );
};

export default ArticleTab;
