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
  getUserById,
  handleOtherLogin,
} from "@/services/service/generalService";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { DownloadOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AddUserExel from "./addUserExel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { userInfo } from "@/redux/slice/user";
import useLocalStorage from "@/hooks/useLocalStorage";
import { IUserJWT } from "@/app/api/user/login/route";

export interface DataType {
  name: string;
  lastName: string;
  email: string;
  language: string;
  role: string;
  department: string;
  company: any;
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
type IProps = {
  id?: string;
};
const UserTable = ({ id }: IProps) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useLocalStorage<any>("users", "[]");
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingKey, setEditingKey] = useState("");
  const user = useSelector((state: RootState) => state.user.user);
  const router = useRouter();
  const isEditing = (record: DataType) => record._id === editingKey;
  const dispatch = useDispatch<AppDispatch>();
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
    async function fetchUsers() {
      if (!!id) {
        const res: any = await getUserById(id ?? "");
        const newData = res?.data?.map((e: any) => {
          return {
            ...e,
            langKey: e.key,
            key: e._id,
          };
        });
        setLoading(false);
        setData(newData);
        setPagination(res?.pagination);
      } else {
        const res: any = await getAllUsers();
        const newData = res?.data?.map((e: any) => {
          return {
            ...e,
            langKey: e.key,
            key: e._id,
          };
        });
        setLoading(false);
        setData(newData);
        setPagination(res?.pagination);
      }
    }
    fetchUsers();
  }, []);
  const handleLogin = async (id: string) => {
    const res = await handleOtherLogin(id);
    debugger
    if (res.success) {
      localStorage.setItem("token", JSON.stringify(res?.data?.token));
      localStorage.setItem("user", JSON.stringify(res?.data));
      const arrUser: any[] = users
      const findUser = arrUser?.some((e) => e.user.id === id);
      if (!findUser) {
        setUsers([...arrUser, res.data]);
        dispatch(userInfo(res?.data?.user));
        router.push("/dashboard");
      }
      dispatch(userInfo(res?.data?.user));
      router.push("/dashboard");
    }
  };
  const columns = [
    {
      title: "Adı Soyadı",
      dataIndex: "nameSurname",
      editable: true,
    },
    {
      title: "department",
      dataIndex: "department",
    },
    {
      title: "company",
      dataIndex: "company",
      render: (_: any, record: DataType) => {
        return <>{record?.company?.companyName}</>;
      },
    },
    {
      title: "role",
      dataIndex: "role",
      render: (_: any, record: DataType) => {
        return (
          <Tag
            icon={<UserOutlined />}
            color={
              record.role === "user"
                ? "#3b5999"
                : record.role === "admin"
                  ? "#55acee"
                  : "blue"
            }
          >
            {record.role}
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
        return (
          <Tag color="green">
            {dayjs(record?.company?.lisanceStartDate).format("DD-MM-YYYY")}
          </Tag>
        );
      },
    },
    {
      title: "lisanceEndDate",
      dataIndex: "lisanceEndDate",
      render: (_: any, record: DataType) => {
        return (
          <Tag color="red">
            {dayjs(record?.company?.lisanceEndDate).format("DD-MM-YYYY")}
          </Tag>
        );
      },
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_: any, record: DataType) => {
        const editable = isEditing(record);
        return (
          <>
            {editable ? (
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
            )}
            {user?.role === "superadmin" && (
              <Button
                color="primary"
                variant="text"
                className="ml-3"
                onClick={() => handleLogin(record._id)}
              >
                Login
              </Button>
            )}
          </>
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

  const [isAddUserModal, setIsAddUserModal] = useState(false);

  return (
    <div>
      <div className="flex mb-2 items-center justify-between">
        <Link
          href={"/dashboard/users/add"}
          className="bg-[#1677ff] text-white px-4 py-2 rounded-md"
        >
          {t("menu-add-user")}
        </Link>
        <div>
          <Button
            onClick={() => setIsAddUserModal(true)}
            type="primary"
            size="middle"
            className="ml-2 "
            style={{ marginBottom: 16 }}
          >
            Kullanıcı Yükle
          </Button>
        </div>
      </div>
      <Form form={form} component={false}>
        <Table<DataType>
          loading={loading}
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
      <AddUserExel
        id={!!id ? id : !!user?.companyId ? user.companyId : ""}
        isAddUserModal={isAddUserModal}
        setIsAddUserModal={setIsAddUserModal}
      />
    </div>
  );
};

export default UserTable;
