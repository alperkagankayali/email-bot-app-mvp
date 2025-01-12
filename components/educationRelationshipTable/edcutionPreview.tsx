"use client";
import { languageColor, languageEnum, noImage } from "@/constants";
import { Drawer, Space, Tag } from "antd";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { Button, Flex, Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

export interface PreviewPreviewDataType {
  key: React.Key;
  title: string;
  levelOfDifficulty: string;
  languages: string[];
  description: string;
  img: string;
}

type IPorps = {
  selected: React.Key[];
  setSelected: (x: React.Key[]) => void;
  educationList: PreviewPreviewDataType[] | [];
  onClose: () => void;
  show: boolean;
  onSubmit: () => void;
};

const EdcutionPreview: React.FC<IPorps> = ({
  selected,
  setSelected,
  onClose,
  educationList,
  show,
  onSubmit,
}) => {
  const t = useTranslations("pages");

  const [loading, setLoading] = useState<boolean>(false);

  const columns: TableColumnsType<PreviewPreviewDataType> = [
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

  const rowSelection: TableRowSelection<PreviewPreviewDataType> = {
    selectedRowKeys: selected,
    onChange: onSelectChange,
  };

  const hasSelected = selected.length > 0;

  return (
    <div>
      <Drawer
        title="Edcution Preview Deleted"
        width={1000}
        onClose={onClose}
        key={"preview"}
        // id="preview"
        open={show}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onSubmit} type="primary">
              Submit
            </Button>
          </Space>
        }
      >
        {!!educationList && (
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
            <Table<PreviewPreviewDataType>
              rowSelection={rowSelection}
              columns={columns}
              dataSource={educationList}
            />
          </Flex>
        )}
      </Drawer>
    </div>
  );
};

export default EdcutionPreview;
