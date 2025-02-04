import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Drawer,
  Space,
  Table,
  TableColumnsType,
  TableProps,
  Tag,
  TransferProps,
} from "antd";
import { getUserById } from "@/services/service/generalService";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface IProps {
  open: boolean;
  setOpen: (x: boolean) => void;
}
interface DataType {
  key: string;
  title: string;
  description: string;
  tag: string;
  email: string;
  language: string;
}

const TestCampaign: React.FC<IProps> = ({ open, setOpen }) => {
  const [targetKeys, setTargetKeys] = useState<TransferProps["targetKeys"]>([]);
  const [users, setUsers] = useState([]);
  const currentUser = useSelector((state: RootState) => state.user.user);

  const onClose = () => {
    setOpen(false);
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
  const rowSelection: TableProps<DataType>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setTargetKeys(selectedRowKeys);
    },
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res: any = await getUserById(currentUser?.companyId ?? "", {
        isSelectUser: true,
        authorType: "user",
      });
      if (res.success) {
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

  return (
    <>
      <Drawer
        title="Select Test Admin"
        size="large"
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={onClose}>
              Test
            </Button>
          </Space>
        }
      >
        <Table<DataType>
          rowSelection={{ type: "checkbox", ...rowSelection }}
          columns={columns}
          dataSource={users}
        />
      </Drawer>
    </>
  );
};

export default TestCampaign;
