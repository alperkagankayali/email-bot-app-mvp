"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Modal,
  notification,
  Space,
  Table,
  Tooltip,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchScenario, fetchScenarioType } from "@/redux/slice/scenario";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {  EyeOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import EducationListCheckBox from "./educationListCheckbox";
import { IEducationList } from "@/types/educationListType";
import {
  getScenario,
  updateScenarioEducationRelation,
} from "@/services/service/scenarioService";
import EdcutionPreview, { PreviewPreviewDataType } from "./edcutionPreview";

interface DataType {
  key: string;
  name: string;
  img: string;
  scenarioType: string;
  language: string;
  content: string;
  education: IEducationList[];
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
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [selected, setSelected] = useState<React.Key[]>([]);
  const [scenarioId, setScenarioId] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const [openDrawer, setOpenDrawer] = useState<{
    show: boolean;
    data: IEducationList[];
  }>({
    show: false,
    data: [],
  });

  const showDrawer = (data: IEducationList[]) => {
    setOpenDrawer({ show: true, data });
  };

  const onClose = () => {
    setSelected([]);
    setOpenDrawer({ show: false, data: [] });
  };

  const [isEdcutionPreview, setIsEdcutionPreview] = useState<{
    show: boolean;
    data: PreviewPreviewDataType[];
  }>({
    show: false,
    data: [],
  });

  const EdcutionPreviewShow = (data: PreviewPreviewDataType[]) => {
    setIsEdcutionPreview({ show: true, data });
    setLoadingButton(false);
  };

  const EdcutionPreviewClose = () => {
    setSelected([]);
    setLoadingButton(false);
    setIsEdcutionPreview({ show: false, data: [] });
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

  const handleEdcutionPreview = async (id: string) => {
    const res = await getScenario({ id });
    if (res.success) {
      setScenarioId(id);
      EdcutionPreviewShow(
        res.data.education.map((e: any) => {
          return {
            key: e._id,
            title: e.educations[0].title,
            description: e.educations[0].description,
            img: e.educations[0].img,
            language: e.educations[0].language,
          };
        })
      );
    }
  };

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
      render: (education, record) => {
        // Eğer education list boş değilse lengthini üzerine tıklanınca liste olarak göster modal ile
        if (education.length === 0) {
          return (
            <Tooltip title="Click to see education list and delete education in scenario list">
              <Button
                type="default"
                loading={record.key === scenarioId && loadingButton}
              >
                {education.length}
              </Button>
            </Tooltip>
          );
        }
        return (
          <Tooltip title="Click to see education list and delete education in scenario list">
            <Button
              type="default"
              loading={record.key === scenarioId && loadingButton}
              onClick={() => {
                if (education.length > 0) {
                  setLoadingButton(true);
                  handleEdcutionPreview(record.key);
                }
              }}
            >
              {education.length}
            </Button>
          </Tooltip>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-4 items-center">
          <EyeOutlined
            key="ellipsis"
            className="mr-5"
            onClick={() =>
              setOpen({
                show: true,
                data: record.content,
              })
            }
          />
          <Button
            type="primary"
            onClick={() => {
              setScenarioId(record.key);
              showDrawer(record.education);
            }}
          >
            Add Education Relationship{" "}
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

  const onSubmit = async (isDelete = false) => {
    setLoadingButton(true);
    const res = await updateScenarioEducationRelation(
      scenarioId,
      {
        education: selected,
      },
      isDelete
    );
    setLoadingButton(false);
    if (res.success) {
      notification.success({
        message: "Success",
        description: "Education Relationship updated successfully",
      });
      dispatch(fetchScenario({}));
    } else {
      notification.error({
        message: "Error",
        description: "Education Relationship updated failed",
      });
    }
    onClose();
    EdcutionPreviewClose();
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

      {openDrawer.show && (
        <Drawer
          title="Create a new account"
          width={1000}
          onClose={onClose}
          open={openDrawer.show}
          styles={{
            body: {
              paddingBottom: 80,
            },
          }}
          extra={
            <Space>
              <Button
                loading={loadingButton}
                onClick={() => onSubmit(false)}
                type="primary"
              >
                Submit
              </Button>
            </Space>
          }
        >
          <EducationListCheckBox
            selected={selected}
            setSelected={setSelected}
            educationList={openDrawer.data}
          />
        </Drawer>
      )}

      <EdcutionPreview
        educationList={isEdcutionPreview.data}
        selected={selected}
        setSelected={setSelected}
        onClose={EdcutionPreviewClose}
        show={isEdcutionPreview.show}
        onSubmit={() => onSubmit(true)}
      />

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
