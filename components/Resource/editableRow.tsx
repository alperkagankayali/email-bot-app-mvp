"use client";
import React, { useEffect, useState } from "react";
import type { TableProps } from "antd";
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from "antd";
import { PaginationType } from "@/types/paginationType";
import {
  getResource,
  getResourceAll,
  updateResource,
} from "@/services/service/generalService";

interface DataType {
  key: string;
  langKey: string;
  value: string;
  code: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: DataType;
  index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const ResourceTable: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<DataType[]>([]);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record: DataType) => record.key === editingKey;

  const edit = (record: Partial<DataType> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", age: "", address: "", ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const [pagination, setPagination] = useState<PaginationType>();

  useEffect(() => {
    async function fetchLanguage() {
      let res = await getResourceAll(10, 1, "");
      const data: any = [];
      const responseData = res.data.reduce((acc: any, item: any) => {
        Object.entries(item).forEach(([key, value]) => {
          if (!["_id", "__v", "code"].includes(key)) {
            // Sabit alanları hariç tut
            acc.langKey = key;
            acc.value = value; // Anahtar-değer çiftlerini birleştir
            data.push({ langKey: key, value, key: item._id, code: item.code });
          }
        });
        return acc;
      }, {});
      console.log("responseData", responseData);
      setData(data);
      setPagination(res.pagination);
    }
    fetchLanguage();
  }, []);

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as DataType;
      const updateRes = await updateResource(
        key as any,
        row.langKey,
        row.value
      );
      console.log("key", key);
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "Key",
      dataIndex: "langKey",
      editable: true,
    },
    {
      title: "value",
      dataIndex: "value",
      editable: true,
    },
    {
      title: "language",
      dataIndex: "code",
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_: any, record: DataType) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginInlineEnd: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns: TableProps<DataType>["columns"] = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table<DataType>
        components={{
          body: { cell: EditableCell },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{ onChange: cancel }}
      />
    </Form>
  );
};

export default ResourceTable;
