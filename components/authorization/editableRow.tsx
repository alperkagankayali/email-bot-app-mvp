"use client";
import React, { useEffect, useState } from "react";
import type { TableProps } from "antd";
import {
  Form,
  Table,
  Tag,
} from "antd";
import {
  getAuthorization,
} from "@/services/service/generalService";

export interface DataType {
  key: string;
  page: {
    pageName: string;
    url: string;
  };
  isAuthorization: boolean
}

const AuthorizationTable: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<DataType[]>([]);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record: DataType) => record.key === editingKey;

  const cancel = () => {
    setEditingKey("");
  };

  useEffect(() => {
    async function fetchAuthorization() {
      const res = await getAuthorization(10, 1);
      setData(res.data);
      // setPagination(res.);
    }
    fetchAuthorization();
  }, []);

  const columns = [
    {
      title: "pageName",
      dataIndex: "pageName",
      render: (_: any, record: DataType) => {
        return <>{record?.page?.pageName}</>;
      },
    },
    {
      title: "url",
      dataIndex: "url",
      render: (_: any, record: DataType) => {
        return <>{record?.page?.url}</>;
      },
    },
    {
      title: "role",
      dataIndex: "role",
      editable: true,
    },
    {
      title: "Yetki Durumu",
      dataIndex: "isAuthorization",
      render: (_: any, record: DataType) => {
        return <Tag color={record?.isAuthorization ? "blue-inverse" : "red-inverse"}>{record?.isAuthorization ? "yetkili":"yetkisiz"}</Tag>;
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

  const onChange: TableProps<DataType>["onChange"] = async (
    pagination
    // filters,
    // sorter,
    // extra
  ) => {
    
  };

  return (
    <div>
      <Form form={form} component={false}>
        <Table<DataType>
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          onChange={onChange}
          pagination={{
            defaultPageSize: 10,
            pageSizeOptions: ["10", "20", "30"],
            onChange: cancel,
          }}
        />
      </Form>
    </div>
  );
};

export default AuthorizationTable;
