"use client";
import React, { useEffect, useState } from "react";
import type { TableProps } from "antd";
import {
  Button,
  Form,
  Input,
  InputNumber,
  notification,
  Popconfirm,
  Popover,
  Select,
  Table,
  Typography,
} from "antd";
import { PaginationType } from "@/types/paginationType";
import {
  deleteResource,
  getResourceAll,
  updateResource,
} from "@/services/service/generalService";
import AddResource from "./addResources";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { DeleteFilled, DeleteOutlined, DeleteTwoTone } from "@ant-design/icons";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/routing";
const { Option } = Select;
const { Search } = Input;
export interface DataType {
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

const ResourceTable: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<DataType[]>([]);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record: DataType) => record.key === editingKey;

  const edit = (record: Partial<DataType> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", age: "", address: "", ...record });
    setEditingKey(record.key);
  };
  const languages = useSelector((state: RootState) => state.language.language);
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [pagination, setPagination] = useState<PaginationType>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectLanguage, setSelectLanguage] = useState(
    searchParams.get("language") ?? ""
  );

  async function fetchLanguage() {
    const res: any = await getResourceAll(10, 1, {
      key: searchParams.get("key") ?? "",
      value: searchParams.get("value") ?? "",
      language: searchParams.get("language") ?? "",
    });
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

  useEffect(() => {
    async function fetchLanguage() {
      const res: any = await getResourceAll(10, 1, {});
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
      const updateRes = await updateResource(key as any, {
        key: row.langKey,
        value: row.value,
      });
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
  const handleDeleteResource = async (id: string) => {
    const res = await deleteResource(id);
    if (res.success) {
      await fetchLanguage();
      notification.info({ message: "Kayıt silindi" });
    } else {
      notification.error({ message: "Kayıt silinemedi" });
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
        return (
          <div className="flex justify-between">
            {editable ? (
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
            )}
            <Popconfirm
              title="Delete the article"
              description="Are you sure to delete this article?"
              onConfirm={() => handleDeleteResource(record.key)}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined className="text-xl cursor-pointer" />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const cancel = () => {
    setEditingKey("");
  };

  useEffect(() => {
    async function fetchLanguage() {
      const res: any = await getResourceAll(10, 1, {
        key: searchParams.get("key") ?? "",
        value: searchParams.get("value") ?? "",
        language: searchParams.get("language") ?? "",
      });
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
  }, [searchParams]);

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
    debugger;
    const res: any = await getResourceAll(
      pagination.pageSize,
      pagination.current,
      {
        key: searchParams.get("key") ?? "",
        value: searchParams.get("value") ?? "",
        language: searchParams.get("language") ?? "",
      }
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

  const handleSelect = (value: string, type: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const onSearch = (value: any, event: any, info: any, name: string) => {
    debugger;
    console.log("event", event);
    const params = new URLSearchParams(searchParams);
    if (value.length > 3) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <div className="flex justify-between w-full items-center mb-10">
        <div className="flex justify-between w-full items-center">
          <Button onClick={() => setIsModalOpen(true)} type="primary">
            Add a resource
          </Button>
          <span className="ml-2">Total {pagination?.totalItems} items</span>
        </div>
        {!!data && (
          <div className="flex items-center">
            <Search
              placeholder="input resource key"
              size="large"
              name="key"
              className="!w-64 mr-4 rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              allowClear
              onSearch={(value: any, event: any, info: any) =>
                onSearch(value, event, info, "key")
              }
              enterButton
            />
            <Search
              placeholder="input resource value"
              size="large"
              name="value"
              className="!w-64 mr-4 rounded-lg border  border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              allowClear
              onSearch={(value: any, event: any, info: any) =>
                onSearch(value, event, info, "value")
              }
              enterButton
            />
            <Select
              size="large"
              className="w-36 !ml-4"
              placeholder="Select language"
              value={selectLanguage}
              onChange={(value: string) => {
                setSelectLanguage(value);
                handleSelect(value, "language");
              }}
            >
              {languages.map((e) => {
                return (
                  <Option key={e.code} value={e.code}>
                    {e.name}
                  </Option>
                );
              })}
            </Select>
            <Popover content={"Clear filter"} title="">
              <DeleteFilled
                className="ml-2 cursor-pointer"
                onClick={() => {
                  setSelectLanguage("");
                  replace(`${pathname}`);
                }}
              />
            </Popover>
          </div>
        )}
      </div>

      <Form form={form} component={false} className="mt-10">
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
      <AddResource
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleAdd={handleAdd}
      />
    </div>
  );
};

export default ResourceTable;
