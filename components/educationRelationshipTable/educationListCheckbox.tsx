"use client";
import Loader from "@/components/common/Loader";
import { languageColor, languageEnum, noImage } from "@/constants";
import { getEducationListContent } from "@/services/service/educationService";
import { IEducationList } from "@/types/educationListType";
import { PaginationProps, Tag } from "antd";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, Flex, Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";

type IPorps = {
  selected: React.Key[];
  setSelected: (x: React.Key[]) => void;
  educationList: IEducationList[] | [];
};

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

interface DataType {
  key: React.Key;
  title: string;
  levelOfDifficulty: string;
  languages: string[];
  authorType: string;
  description: string;
  img: string;
}

const EducationListCheckBox: React.FC<IPorps> = ({
  selected,
  setSelected,
  educationList,
}) => {
  const t = useTranslations("pages");

  const [data, setData] = useState<IEducationList[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageSize, setPageSize] = useState(10);

  const fetchEducationList = async (limit = 10, page = 1) => {
    const res = await getEducationListContent(limit, page, "");
    setLoading(false);
    if (res.success) {
      if (data.some((e) => res.data?.some((d: any) => d._id === e._id))) {
        return;
      } else {
        setTotalItems(res?.totalItems ?? 0);
        setData([...data, ...res.data]);
      }
    }
  };

  useEffect(() => {
    const fetchEducationList = async (limit: number, page: number) => {
      const res = await getEducationListContent(limit, page, "");
      setLoading(false);
      if (res.success) {
        setTotalItems(res?.totalItems ?? 0);
        setData(res.data);
      }
    };
    fetchEducationList(10, 1);
  }, []);

  const columns: TableColumnsType<DataType> = [
    {
      title: "Img",
      dataIndex: "img",
      render: (img) => (
        <Image
          src={img === "" || img === undefined ? noImage : img}
          width={50}
          height={50}
          alt=""
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (title, record) => (
        <>
          <p className="text-sm">{title}</p>
          <span className="opacity-60 text-xs line-clamp-3 ">
            {record.description}
          </span>
        </>
      ),
    },
    {
      title: "Level of Difficulty",
      dataIndex: "levelOfDifficulty",
      render: (levelOfDifficulty) => (
        <Tag
          className="!m-0 !pl-1"
          color={
            levelOfDifficulty === "hard"
              ? "#cd201f"
              : levelOfDifficulty === "medium"
                ? "#108ee9"
                : "#87d068"
          }
        >
          {levelOfDifficulty}
        </Tag>
      ),
    },
    {
      title: "languages",
      dataIndex: "languages",
      render: (languages) =>
        languages?.map((e: any) => (
          <Tag key={e} color={languageColor[e as languageEnum] ?? "blue"}>
            {e}
          </Tag>
        )),
    },
    {
      title: "Author",
      dataIndex: "authorType",
      render: (authorType) =>
        authorType === "superadmin" ? "Global" : "Local",
    },
  ];

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelected([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange: (newSelectedRowKeys: React.Key[]) => void = (
    newSelectedRowKeys: React.Key[]
  ) => {
    setSelected(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys: selected,
    onChange: onSelectChange,
  };

  const hasSelected = selected.length > 0;

  const onChangePagitnation: PaginationProps["onChange"] = async (
    page,
    pageNumber
  ) => {
    await fetchEducationList(pageNumber, page);
    setPageSize(pageNumber);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {!!data && (
        <Flex gap="middle" vertical>
          <Flex align="center" gap="middle">
            <Button
              type="primary"
              onClick={start}
              disabled={!hasSelected}
              loading={loading}
            >
              Reload
            </Button>
            {hasSelected ? `Selected ${selected.length} items` : null}
          </Flex>
          <Table<DataType>
            rowSelection={rowSelection}
            columns={columns}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSize: pageSize,
              pageSizeOptions: ["10", "20", "30"],
              total: totalItems,
              onChange: onChangePagitnation,
            }}
            dataSource={data.map((e) => {
              const education = e.educations[0];
              return {
                key: e._id,
                img: education.img,
                description: education.description,
                title: education.title,
                levelOfDifficulty: education.levelOfDifficulty,
                languages: e.languages,
                authorType: e.authorType,
              };
            })}
          />
        </Flex>
      )}
    </div>
  );
};

export default EducationListCheckBox;
