"use client";
import React, { useEffect, useState } from "react";
import { Button, Drawer, Modal, Space, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchScenario, fetchScenarioType } from "@/redux/slice/scenario";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import EducationListCheckBox from "./educationListCheckbox";
import { IEducationList } from "@/types/educationListType";

interface DataType {
  key: string;
  name: string;
  img: string;
  scenarioType: string;
  language: string;
  content: string;
  education: IEducationList;
}
const EducationRelationshipTable: React.FC = () => {
  const status = useSelector((state: RootState) => state.scenario.status);
  const scenarioTypeStatus = useSelector(
    (state: RootState) => state.scenario.scenarioTypeStatus
  );
  const data = useSelector((state: RootState) => state.scenario.scenario);
  const totalItems = useSelector(
    (state: RootState) => state.scenario.scenarioTotalItem
  );
  const [selected, setSelected] = useState<React.Key[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const onClose = () => {
    setOpenDrawer(false);
  };
  const t = useTranslations("pages");
  const [open, setOpen] = useState({
    show: false,
    data: "",
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchScenario({}));
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (scenarioTypeStatus === "idle") {
      dispatch(fetchScenarioType());
    }
  }, [scenarioTypeStatus, dispatch]);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "img",
      dataIndex: "img",
      key: "img",
      render: (img) => (
        <Image
          width={50}
          height={20}
          className="h-10 object-contain bg-[#03162b]"
          alt="img"
          src={img}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "scenarioType",
      dataIndex: "scenarioType",
      key: "scenarioType",
    },
    {
      title: "language",
      dataIndex: "language",
      key: "language",
    },
    {
      title: "Education",
      dataIndex: "education",
      key: "education",
      render: (education) => {
        // Eğer education list boş değilse lengthini üzerine tıklanınca liste olarak göster modal ile
        return <div>{education.length}</div>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-4 items-center">
          <Link href={"/dashboard/scenario/update/" + record.key}>
            <EditOutlined key="edit" />
          </Link>
          <EyeOutlined
            key="ellipsis"
            onClick={() =>
              setOpen({
                show: true,
                data: record.content,
              })
            }
          />
          <Button type="primary" onClick={showDrawer}>
            Education Relationship{" "}
          </Button>
        </div>
      ),
    },
  ];

  const onChange: TableProps<DataType>["onChange"] = async (pagination) => {
    dispatch(
      fetchScenario({
        limit: pagination.pageSize,
        page: pagination.current,
      })
    );
  };

  return (
    <div className="flex flex-col items-start">
      {!!data && (
        <Table<DataType>
          className="w-full"
          columns={columns}
          pagination={{
            defaultPageSize: 10,
            pageSizeOptions: ["10", "20", "30"],
            total: totalItems,
          }}
          onChange={onChange}
          dataSource={data.map((value) => {
            return {
              name: value.title,
              img: value.img,
              scenarioType: value.scenarioType.title,
              language: value.language.name,
              key: value._id,
              content: value.emailTemplate?.content ?? "",
              education: value.education ?? [],
            };
          })}
        />
      )}

      <Drawer
        title="Create a new account"
        width={1000}
        onClose={onClose}
        open={openDrawer}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={() => {
                console.log("selected", selected);
                onClose();
              }}
              type="primary"
            >
              Submit
            </Button>
          </Space>
        }
      >
        <EducationListCheckBox selected={selected} setSelected={setSelected} />
      </Drawer>
      <Modal
        title=""
        centered
        open={open.show}
        onOk={() => setOpen({ show: false, data: "" })}
        onCancel={() => setOpen({ show: false, data: "" })}
        width={1000}
      >
        <div dangerouslySetInnerHTML={{ __html: open.data }}></div>
      </Modal>
    </div>
  );
};

export default EducationRelationshipTable;
