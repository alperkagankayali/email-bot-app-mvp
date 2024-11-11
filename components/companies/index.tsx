"use client";
import React, { useEffect, useState } from "react";
import { Button, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { getAllCamponies } from "@/services/service/generalService";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import AddCompanies from "./addCompanies";
import dayjs from "dayjs";
interface DataType {
  key: string;
  companyName: string;
  logo: string;
  emailDomainAddress: string[];
  lisanceEndDate: Date;
  lisanceStartDate: Date;
}

const CompaniesTable: React.FC = () => {
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      render: (_, { logo, companyName, key }) => (
        <Link href={`/dashboard/users/${key}`}>
          <Image src={logo} alt={companyName} width={120} height={200} />
        </Link>
      ),
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "name",
      render: (_, { companyName, key }) => (
        <Link href={`/dashboard/users/${key}`}>{companyName}</Link>
      ),
    },

    {
      title: "Lisance Start Date",
      dataIndex: "lisanceStartDate",
      key: "lisanceStartDate",
      render: (text) => (
        <Tag color="#87d068">{dayjs(text).format("DD-MM-YYYY")}</Tag>
      ),
    },
    {
      title: "Lisance End Date",
      dataIndex: "lisanceEndDate",
      key: "lisanceEndDate",
      render: (text) => (
        <Tag color="#f50">{dayjs(text).format("DD-MM-YYYY")}</Tag>
      ),
    },
    {
      title: "Email Domain Address",
      key: "emailDomainAddress",
      dataIndex: "emailDomainAddress",
      render: (_, { emailDomainAddress }) => (
        <>
          {emailDomainAddress.map((tag) => {
            let color = tag.length > 10 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toLocaleLowerCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => (
        <Button
          onClick={() => {
            setisEditing({ edit: true, data: record });
            setIsModalOpen(true);
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  const [isEditing, setisEditing] = useState<{ edit: boolean; data: any }>({
    edit: false,
    data: {},
  });
  const [dataSoruce, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function fetchLanguage() {
      const res: any = await getAllCamponies(10, 1);
      if (!!res?.data) {
        setDataSource(
          res?.data?.map((e: any) => {
            return { ...e, key: e._id };
          })
        );
      }
    }
    fetchLanguage();
  }, []);

  const handleAdd = (newData: DataType) => {
    const findData = dataSoruce.some((x: any) => x.key === newData?.key);
    if (findData) {
      const findIndex = dataSoruce.findIndex(
        (x: any) => x.key === newData?.key
      );
      const newArr: any = [...dataSoruce];
      newArr[findIndex] = newData;
      setDataSource(newArr);
    }
  };

  return (
    <div>
      <Button
        onClick={() => setIsModalOpen(true)}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Add a compaines
      </Button>
      <AddCompanies
        isEditig={isEditing}
        setisEditing={setisEditing}
        isModalOpen={isModalOpen}
        handleAdd={handleAdd}
        setIsModalOpen={setIsModalOpen}
      />
      <Table<DataType> columns={columns} dataSource={dataSoruce} />
    </div>
  );
};

export default CompaniesTable;
