"use client";
import React, { useEffect, useState } from "react";
import { Checkbox, Flex, Table, Tag, Transfer } from "antd";
import type {
  GetProp,
  TableColumnsType,
  TableProps,
  TransferProps,
} from "antd";
import { getUserById } from "@/services/service/generalService";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import type { CollapseProps } from "antd";
import { Collapse, theme } from "antd";
const CheckboxGroup = Checkbox.Group;
type TransferItem = GetProp<TransferProps, "dataSource">[number];
type TableRowSelection<T extends object> = TableProps<T>["rowSelection"];

interface DataType {
  key: string;
  title: string;
  description: string;
  tag: string;
  email: string;
  language: string;
}

interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: DataType[];
  leftColumns: TableColumnsType<DataType>;
  rightColumns: TableColumnsType<DataType>;
}

// Customize Table Transfer
const TableTransfer: React.FC<TableTransferProps> = (props) => {
  const { leftColumns, rightColumns, ...restProps } = props;
  return (
    <Transfer style={{ width: "100%" }} {...restProps}>
      {({
        direction,
        filteredItems,
        onItemSelect,
        onItemSelectAll,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
        const columns = direction === "left" ? leftColumns : rightColumns;
        const rowSelection: TableRowSelection<TransferItem> = {
          getCheckboxProps: () => ({ disabled: listDisabled }),
          onChange(selectedRowKeys) {
            onItemSelectAll(selectedRowKeys, "replace");
          },
          selectedRowKeys: listSelectedKeys,
          selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
          ],
        };

        return (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredItems}
            size="small"
            style={{ pointerEvents: listDisabled ? "none" : undefined }}
            onRow={({ key, disabled: itemDisabled }) => ({
              onClick: () => {
                if (itemDisabled || listDisabled) {
                  return;
                }
                onItemSelect(key, !listSelectedKeys.includes(key));
              },
            })}
          />
        );
      }}
    </Transfer>
  );
};

const columns: TableColumnsType<DataType> = [
  {
    dataIndex: "title",
    title: "Name",
  },
  {
    dataIndex: "tag",
    title: "Tag",
    render: (tag: string) => (
      <Tag style={{ marginInlineEnd: 0 }} color="cyan">
        {tag.toUpperCase()}
      </Tag>
    ),
  },
  {
    dataIndex: "language",
    title: "language",
  },
  {
    dataIndex: "email",
    title: "email",
  },
  {
    dataIndex: "description",
    title: "Description",
  },
];

const filterOption = (input: string, item: DataType) =>
  item.title?.includes(input) || item.email?.includes(input);

type IProps = {
  targetKeys: React.Key[] | undefined;
  setTargetKeys: React.Dispatch<React.SetStateAction<React.Key[] | undefined>>;
};
const SelectUserForm: React.FC<IProps> = ({ targetKeys, setTargetKeys }) => {
  const t = useTranslations("pages");
  const currentUser = useSelector((state: RootState) => state.user.user);
  const [department, setDepartment] = useState([]);
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);
  const [checkedList, setCheckedList] = useState<string[]>([]);

  const onChange2 = (list: string[]) => {
    const newListarr: any = [];
    list.forEach((value) => {
      const isData = data.some((element: any) => element?._id === value);
      if (isData) {
        const findData: any = data.find(
          (element: any) => element?._id === value
        );
        newListarr.push(...findData.users.map((element: any) => element._id));
      }
    });
    setCheckedList(list);
    newListarr.concat(targetKeys);
    setTargetKeys(newListarr);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res: any = await getUserById(currentUser?.companyId ?? "", {
        isSelectUser: true,
        authorType: "admin",
      });
      if (res.success) {
        setDepartment(
          res.department?.map((e: any) => {
            return e._id;
          })
        );
        setData(res.department);
        setUsers(
          res.data?.map((e: any, i: number) => {
            return {
              key: e?._id,
              title: e.nameSurname,
              email: e.email,
              language: e.language,
              description: e.department,
              tag: e.role,
            };
          })
        );
      }
    };
    fetchUsers();
  }, []);

  const onChange: TransferProps["onChange"] = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const { token } = theme.useToken();

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    textAlign: "left",
    justifyContent: "flex-start",
    border: "none",
  };

  const getItems: (panelStyle: CSSProperties) => CollapseProps["items"] = (
    panelStyle
  ) => [
    {
      key: "1",
      label: t("user-department-groups"),
      children: (
        <CheckboxGroup
          options={department}
          value={checkedList}
          onChange={onChange2}
        />
      ),
      style: panelStyle,
    },
  ];
  return (
    <>
      <div className="w-full !mb-4 border-2 !p-5 !text-3xl">
        <p className="mb-4">{t("user-groups")}</p>
        <Collapse
          bordered={false}
          defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          style={{ background: token.colorBgContainer }}
          items={getItems(panelStyle)}
        />
      </div>

      <Flex align="start" gap="middle" vertical>
        <TableTransfer
          dataSource={users}
          targetKeys={targetKeys}
          showSearch
          showSelectAll={false}
          onChange={onChange}
          filterOption={filterOption}
          leftColumns={columns}
          rightColumns={columns}
        />
      </Flex>
    </>
  );
};

export default SelectUserForm;
