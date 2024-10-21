"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import type { GetRef, InputRef, TableProps } from "antd";
import { Checkbox, Form, notification, Table } from "antd";
import { getLanguage, updateLanguage } from "@/services/service/generalService";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { PaginationType } from "@/types/paginationType";

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async (value: boolean) => {
    try {
      const values = await form.validateFields();
      values.isActive = value;
      const res = await updateLanguage(record.key, { isActive: value });
      if (res.success) {
        notification.open({
          message: "Başarıyla Kaydedildi",
          description: res?.data?.name + " dili alanı güncellendi",
        });
      }
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true }]}
      >
        <Checkbox
          ref={inputRef}
          onChange={(e) => save(e.target.checked)}
          checked={record[dataIndex] as any}
          onBlur={toggleEdit}
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

interface DataType {
  key: React.Key;
  name: string;
  code: string;
  isActive: boolean;
}

type ColumnTypes = Exclude<TableProps<DataType>["columns"], undefined>;

const Editable: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<PaginationType>();

  useEffect(() => {
    async function fetchLanguage() {
      const res: any = await getLanguage(10, 1, false);
      if (!!res?.data) {
        setDataSource(
          res?.data?.map((e: any) => {
            return { ...e, key: e._id };
          })
        );
        setPagination(res.pagination);
      }
    }
    fetchLanguage();
  }, []);

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "name",
      dataIndex: "name",
    },
    {
      title: "code",
      dataIndex: "code",
    },
    {
      title: "Active",
      dataIndex: "isActive",
      editable: true,
      render: (text, record) =>
        record.isActive ? (
          <CheckOutlined style={{ color: "green" }} />
        ) : (
          <CloseOutlined style={{ color: "red" }} />
        ),
    },
  ];

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const onChange: TableProps<DataType>["onChange"] = async (
    pagination
    // filters,
    // sorter,
    // extra
  ) => {
    const res: any = await getLanguage(
      pagination.pageSize,
      pagination.current,
      false
    );
    if (!!res?.data) {
      setDataSource(
        res.data.map((e: any) => {
          return { ...e, key: e._id };
        })
      );
    }
  };

  return (
    <div>
      <Table<DataType>
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        rowKey={(record) => record.key} // Benzersiz bir key
        dataSource={dataSource}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: ["10", "20", "30"],
          total: pagination?.totalItems,
        }}
        onChange={onChange}
        columns={columns as ColumnTypes}
      />
    </div>
  );
};

export default Editable;
