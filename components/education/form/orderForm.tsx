"use client";
import React, { useEffect, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, List } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  AccountBookTwoTone,
  BookTwoTone,
  VideoCameraTwoTone,
} from "@ant-design/icons";
import { handleAddEducationFormValue } from "@/redux/slice/education";

interface DataType {
  type: "video" | "article" | "quiz";
  refId: string;
  order: number;
  title: string;
  description: string;
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

const Row: React.FC<Readonly<RowProps>> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: "move",
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };

  return (
    <List.Item
      {...props}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    />
  );
};

type IProps = {
  lang: string;
};
const OrderForm: React.FC<IProps> = ({ lang }) => {
  const forms = useSelector((state: RootState) => state.education.forms);
  const video = useSelector((state: RootState) => state.education.videos);
  const article = useSelector((state: RootState) => state.education.article);
  const quiz = useSelector((state: RootState) => state.education.quiz);

  useEffect(() => {
    if (dataSource.length === 0) {
      let data: DataType[] = [];
      if (Object.keys(forms).length > 0) {
        const selectData = [
          ...(Array.isArray(forms[lang]["selectVideo"])
            ? (forms[lang]["selectVideo"] as Array<any>)
            : []),
          ...(Array.isArray(forms[lang]["selectArticle"])
            ? (forms[lang]["selectArticle"] as Array<any>)
            : []),
          ...(Array.isArray(forms[lang]["selectQuiz"])
            ? (forms[lang]["selectQuiz"] as Array<any>)
            : []),
        ];

        data = selectData.map((e) => {
          const findArticle = article.some((element) => element._id === e);
          const findVideo = video.some((element) => element._id === e);
          const findQuiz = quiz.some((element) => element._id === e);
          let findData: any = {};
          if (findArticle) {
            findData = article.find((element) => element._id === e);
          } else if (findQuiz) {
            findData = quiz.find((element) => element._id === e);
          } else if (findVideo) {
            findData = video.find((element) => element._id === e);
          }
          return {
            type: findVideo ? "video" : findArticle ? "article" : "quiz",
            refId: e,
            order: 0,
            title: findData?.title,
            description: findData?.description,
          };
        });
      }
      dispatch(
        handleAddEducationFormValue({
          language: lang,
          field: "contents",
          value: data.map((data, index) => {
            return { type: data.type, refId: data.refId, order: index };
          }),
        })
      );
      setDataSource(data);
    }
  }, [lang, forms]);

  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const dispatch = useDispatch();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    })
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const newData = [...dataSource];
      const activeIndex = dataSource.findIndex((i) => i.refId === active.id);
      const overIndex = dataSource.findIndex((i) => i.refId === over?.id);
      const arr = arrayMove(newData, activeIndex, overIndex);
      setDataSource(arr);
      dispatch(
        handleAddEducationFormValue({
          language: lang,
          field: "contents",
          value: arr.map((data, index) => {
            return { type: data.type, refId: data.refId, order: index };
          }),
        })
      );
    }
  };

  // useEffect(() => {
  //   dispatch(
  //     handleAddEducationFormValue({
  //       language: lang,
  //       field: "contents",
  //       value: dataSource.map((data, index) => {
  //         return { type: data.type, refId: data.refId, order: index };
  //       }),
  //     })
  //   );
  // }, [dataSource]);

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={dataSource.map((i) => i.refId) ?? []}
        strategy={verticalListSortingStrategy}
      >
        <List
          itemLayout="horizontal"
          dataSource={dataSource}
          renderItem={(item, index) => (
            <Row data-row-key={item.refId} key={item.refId}>
              <List.Item className="w-full">
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size={{
                        xs: 14,
                        sm: 22,
                        md: 30,
                        lg: 44,
                        xl: 60,
                        xxl: 60,
                      }}
                      icon={
                        item.type === "video" ? (
                          <VideoCameraTwoTone />
                        ) : item.type === "article" ? (
                          <BookTwoTone />
                        ) : (
                          <AccountBookTwoTone />
                        )
                      }
                    />
                  }
                  title={<p>{item.title}</p>}
                  description={item.description}
                />
              </List.Item>
            </Row>
          )}
        />
      </SortableContext>
    </DndContext>
  );
};

export default OrderForm;
