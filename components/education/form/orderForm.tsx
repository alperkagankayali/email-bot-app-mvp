"use client"
import React, { useState } from "react";
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
import { List, Table } from "antd";
import type { TableColumnsType } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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
  const createEducation = useSelector((state:RootState) => state.education.createEducation)
  const [dataSource, setDataSource] = useState(createEducation?.contents ?? []);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    })
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    debugger;
    if (active.id !== over?.id) {
      setDataSource((prev) => {
        const newData = [...prev]
        const activeIndex = prev.findIndex((i) => i.refId === active.id);
        const overIndex = prev.findIndex((i) => i.refId === over?.id);
        return arrayMove(newData, activeIndex, overIndex);
      });
    }
  };
  console.log(dataSource);
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
        <List bordered>
          {dataSource.map((e) => {
            return (
              <Row data-row-key={e.refId} key={e.refId}>
                {e.type}
              </Row>
            );
          })}
        </List>
      </SortableContext>
    </DndContext>
  );
};

export default OrderForm;
