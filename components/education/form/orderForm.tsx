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
import Loader from "@/components/common/Loader";

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

  useEffect(() => {
    if (
      !!forms[lang] &&
      forms[lang].contents === undefined &&
      Array.isArray(forms[lang].selectVideo) &&
      Array.isArray(forms[lang].selectArticle) &&
      Array.isArray(forms[lang].selectQuiz)
    ) {
      debugger;
      const orderData = [
        ...(forms[lang].selectVideo as DataType[]),
        ...(forms[lang].selectArticle as DataType[]),
        ...(forms[lang].selectQuiz as DataType[]),
      ];
      dispatch(
        handleAddEducationFormValue({
          language: lang,
          field: "contents",
          value: orderData,
        })
      );
      setDataSource(orderData);
    }
  }, [lang, forms]);

  const [dataSource, setDataSource] = useState<DataType[]>(
    !!forms[lang] ? (forms[lang].contents as DataType[]) : []
  );
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
            return { ...data, order: index };
          }),
        })
      );
    }
  };

  if (Array.isArray(dataSource)) {
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
  } else return <Loader />;
};

export default OrderForm;
