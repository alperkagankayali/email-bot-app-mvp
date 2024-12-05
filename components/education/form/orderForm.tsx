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
import { Avatar, List, Table } from "antd";
import type { TableColumnsType } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { handleEducationDataChange } from "@/redux/slice/education";
import {
  AccountBookTwoTone,
  BookTwoTone,
  VideoCameraTwoTone,
} from "@ant-design/icons";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];

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

const OrderForm: React.FC = () => {
  const selectedVideo = useSelector(
    (state: RootState) => state.education.selectVideo
  );
  const selectedArticle = useSelector(
    (state: RootState) => state.education.selectArticle
  );
  const selectedQuiz = useSelector(
    (state: RootState) => state.education.selectQuiz
  );
  const createEducation = useSelector(
    (state: RootState) => state.education.createEducation
  );
  const educationDetail = useSelector(
    (state: RootState) => state.education.educationDetail
  );

  const newDataSource = [
    ...selectedVideo.map((e) => {
      const findData = educationDetail?.contents.find(
        (education) => education.type === "video" && education.refId?._id === e
      );
      return {
        type: "video",
        refId: e,
        order: findData?.order,
        title: findData?.refId.title,
        description: findData?.refId?.description,
      };
    }),
    ...selectedArticle.map((e) => {
      const findData = educationDetail?.contents.find(
        (education) =>
          education.type === "article" && education.refId?._id === e
      );
      return {
        type: "article",
        refId: e,
        order: findData?.order,
        title: findData?.refId.title,
        description: findData?.refId?.description,
      };
    }),
    ...selectedQuiz.map((e) => {
      const findData = educationDetail?.contents.find(
        (education) => education.type === "quiz" && education.refId?._id === e
      );
      return {
        type: "quiz",
        refId: e,
        order: findData?.order,
        title: findData?.refId.title,
        description: findData?.refId?.description,
      };
    }),
  ];

  const [dataSource, setDataSource] = useState(newDataSource);
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
      setDataSource((prev) => {
        const newData = [...prev];
        const activeIndex = prev.findIndex((i) => i.refId === active.id);
        const overIndex = prev.findIndex((i) => i.refId === over?.id);
        return arrayMove(newData, activeIndex, overIndex);
      });
    }
  };

  useEffect(() => {
    dispatch(
      handleEducationDataChange({
        ...createEducation,
        contents: dataSource.map((data, index) => {
          return { ...data, order: index };
        }),
      })
    );
  }, [dataSource]);

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
