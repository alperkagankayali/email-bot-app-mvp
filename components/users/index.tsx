"use client";
import React, { useEffect, useState } from "react";
import type { TableProps } from "antd";
import { Button, notification, Popconfirm, Table, Tag, Typography } from "antd";
import { PaginationType } from "@/types/paginationType";
import {
  deleteUser,
  getAllUsers,
  getResourceAll,
  getUserById,
  handleOtherLogin,
} from "@/services/service/generalService";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AddUserExel from "./addUserExel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { userInfo } from "@/redux/slice/user";
import useLocalStorage from "@/hooks/useLocalStorage";

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

type IProps = {
  id?: string;
};
const UserTable = ({ id }: IProps) => {
  const [users, setUsers] = useLocalStorage<any>("users", "[]");
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingKey, setEditingKey] = useState("");
  const user = useSelector((state: RootState) => state.user.user);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const cancel = () => {
    setEditingKey("");
  };

  const [pagination, setPagination] = useState<PaginationType>();
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
    const arrUser: any[] = users;
    const findUser = arrUser?.some((e) => e.user.id === id);
    if (arrUser.length > 3) {
      notification.error({
        message: t("switch-account-max-count-error"),
      });
    } else if (findUser) {
      notification.error({
        message: t("switch-account-some-login-failed"),
      });
    } else {
      const res = await handleOtherLogin(id);
      if (res.success) {
        localStorage.setItem("token", JSON.stringify(res?.data?.token));
        localStorage.setItem("user", JSON.stringify(res?.data));
        if (!findUser) {
          setUsers([...arrUser, res.data]);
          dispatch(userInfo(res?.data?.user));
          router.push("/dashboard");
        } else {
          dispatch(userInfo(res?.data?.user));
          router.push("/dashboard");
        }
      }
    }
  };

  const handleDeleteUser = async (id: string) => {
    const res = await deleteUser(id);
    if (res.success) {
      notification.success({ message: res.data?.title + " deleted" });
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
    } else {
      notification.error({
        message: res.data?.title + " could not be deleted",
      });
    }
  };

  const columns = [
    {
      title: t("user-table-name-surname"),
      dataIndex: "nameSurname",
      editable: true,
    },
    {
      title: t("user-table-department"),
      dataIndex: "department",
    },
    {
      title: t("user-table-company"),
      dataIndex: "company",
      render: (_: any, record: DataType) => {
        return <>{record?.company?.companyName}</>;
      },
    },
    {
      title: t("user-table-role"),
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
      title: t("user-table-email"),
      dataIndex: "email",
    },
    {
      title: t("user-table-language"),
      dataIndex: "language",
    },
    {
      title: t("user-table-lisance-start-date"),
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
      title: t("user-table-lisance-end-date"),
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
      title: t("user-table-lisance-operation"),
      dataIndex: "operation",
      render: (_: any, record: DataType) => {
        return (
          <>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() =>
                router.push("/dashboard/users/update/" + record._id)
              }
            >
              {t("resources-edit")}
            </Typography.Link>
            <Popconfirm
              title={t("delete-document", {
                document: t("menu-users"),
              })}
              className="ml-4 p-2 border"
              description={t("delete-document-2", {
                document: t("menu-users"),
              })}
              onConfirm={() => handleDeleteUser(record._id)}
              okText={t("yes-btn")}
              cancelText={t("no-btn")}
            >
              <Typography.Link type="danger">
                {" "}
                {t("delete-btn")}
              </Typography.Link>
            </Popconfirm>
            {user?.role === "superadmin" && (
              <Button
                color="primary"
                variant="text"
                className="ml-3"
                onClick={() => handleLogin(record._id)}
              >
                {t("login-loginButton")}
              </Button>
            )}
          </>
        );
      },
    },
  ];

  const onChange: TableProps<DataType>["onChange"] = async (
    pagination
    // filters,
    // sorter,
    // extra
  ) => {
    const res: any = await getResourceAll(
      pagination.pageSize,
      pagination.current,
      {}
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
          href={"/dashboard/users/add?companyId=" + id}
          className="bg-[#181140] text-white px-4 py-2 rounded-md"
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
            {t("add-user-excel")}
          </Button>
        </div>
      </div>
      <Table<DataType>
        loading={loading}
        bordered
        dataSource={data}
        columns={columns}
        onChange={onChange}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: ["10", "20", "30"],
          total: pagination?.totalItems,
          onChange: cancel,
        }}
      />
      <AddUserExel
        id={!!id ? id : !!user?.companyId ? user.companyId : ""}
        isAddUserModal={isAddUserModal}
        setIsAddUserModal={setIsAddUserModal}
      />
    </div>
  );
};

export default UserTable;
