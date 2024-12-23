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
import {
  getArticle,
  getQuiz,
  getVideo,
} from "@/services/service/educationService";

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

  const dataCreate = async () => {
    debugger
    let data: DataType[] = [];
    if (Array.isArray(forms[lang]["selectVideo"])) {
      const res = forms[lang]["selectVideo"].map(async (e) => {
        const findVideo = await getVideo(10, 1, e);
        if (findVideo.success) {
          return {
            type: "video",
            refId: findVideo.data?._id,
            order: 0,
            title: findVideo.data?.title,
            description: findVideo.data?.description,
          };
        }
      });
      await Promise.all(res).then((e: any) => {
        data.push(...e);
      });
    }
    if (Array.isArray(forms[lang]["selectArticle"])) {
      const res = forms[lang]["selectArticle"].map(async (e) => {
        const findData = await getArticle(10, 1, e);
        if (findData.success) {
          return {
            type: "article",
            refId: findData.data?._id,
            order: 0,
            title: findData.data?.title,
            description: findData.data?.description,
          };
        }
      });
      await Promise.all(res).then((e: any) => {
        data.push(...e);
      });
    }
    if (Array.isArray(forms[lang]["selectQuiz"])) {
      const res = forms[lang]["selectQuiz"].map(async (e) => {
        const findData = await getQuiz(10, 1, e);
        if (findData.success) {
          return {
            type: "quiz",
            refId: findData.data?._id,
            order: 0,
            title: findData.data?.title,
            description: findData.data?.description,
          };
        }
      });
      await Promise.all(res).then((e: any) => {
        data.push(...e);
      });
    }
    return data;
  };

  useEffect(() => {
    if (dataSource.length === 0) {
      const fetchData = async () => {
        const data = await dataCreate();
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
      };
      fetchData();
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
