"use client";
import React, { useEffect, useState } from "react";
import type { TableProps } from "antd";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Tag,
  Typography,
} from "antd";
import { PaginationType } from "@/types/paginationType";
import {
  getAllUsers,
  getResourceAll,
  updateResource,
} from "@/services/service/generalService";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { UserOutlined } from "@ant-design/icons";

export interface DataType {
  name: string;
  lastName: string;
  email: string;
  language: string;
  userType: string;
  department: string;
  company: string;
  lisanceStartDate: string;
  lisanceEndDate: string;
  _id: string;
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
  // record,
  // index,
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

const UserTable: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<DataType[]>([]);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record: DataType) => record._id === editingKey;

  const edit = (record: Partial<DataType> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", age: "", address: "", ...record });
    setEditingKey(record?._id || "");
  };

  const cancel = () => {
    setEditingKey("");
  };

  const [pagination, setPagination] = useState<PaginationType>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const t = useTranslations("pages");

  useEffect(() => {
    async function fetchLanguage() {
      const res: any = await getAllUsers();
      const newData = res?.data?.map((e: any) => {
        return {
          ...e,
          langKey: e.key,
          key: e._id,
        };
      });
      setData(newData);
      setPagination(res.pagination);
    }
    fetchLanguage();
  }, []);

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as DataType;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item._id);
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
      title: "name",
      dataIndex: "name",
      editable: true,
    },
    {
      title: "lastName",
      dataIndex: "lastName",
      editable: true,
    },
    {
      title: "department",
      dataIndex: "department",
    },
    {
      title: "company",
      dataIndex: "company",
    },
    {
      title: "role",
      dataIndex: "userType",
      render: (_: any, record: DataType) => {
        return (
          <Tag
            icon={<UserOutlined />}
            color={
              record.userType === "superadmin"
                ? "#3b5999"
                : record.userType === "admin"
                  ? "#55acee"
                  : "blue"
            }
          >
            {record.userType}
          </Tag>
        );
      },
    },
    {
      title: "email",
      dataIndex: "email",
    },
    {
      title: "language",
      dataIndex: "language",
    },
    {
      title: "lisanceStartDate",
      dataIndex: "lisanceStartDate",
      render: (_: any, record: DataType) => {
        return <Tag color="green">{record.lisanceStartDate}</Tag>;
      },
    },
    {
      title: "lisanceEndDate",
      dataIndex: "lisanceEndDate",
      render: (_: any, record: DataType) => {
        return <Tag color="red">{record.lisanceEndDate}</Tag>;
      },
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_: any, record: DataType) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              // onClick={() => save(record.key)}
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
            // onClick={() => edit(record._id)}
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
  const handleAdd = (newData: DataType) => {
    setIsModalOpen(!isModalOpen);
    console.log("newdata", [...data, newData]);
    setData([...data, newData]);
  };
  const onChange: TableProps<DataType>["onChange"] = async (
    pagination
    // filters,
    // sorter,
    // extra
  ) => {
    const res: any = await getResourceAll(
      pagination.pageSize,
      pagination.current
    );
    if (!!res?.data) {
      const newData = res?.data?.map((e: any) => {
        return {
          ...e,
          langKey: e.key,
          key: e._id,
        };
      });
      setData(newData);
    }
  };

  return (
    <div>
      <div className="flex mb-2">
        <Link
          href={"/dashboard/user/add"}
          className="bg-[#1677ff] text-white px-4 py-2 rounded-md"
        >
          {t("menu-add-user")}
        </Link>
      </div>
      <Form form={form} component={false}>
        <Table<DataType>
          components={{
            body: { cell: EditableCell },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          onChange={onChange}
          pagination={{
            defaultPageSize: 10,
            pageSizeOptions: ["10", "20", "30"],
            total: pagination?.totalItems,
            onChange: cancel,
          }}
        />
      </Form>
    </div>
  );
};

export default UserTable;
