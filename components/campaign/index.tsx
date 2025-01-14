"use client";
import { Link } from "@/i18n/routing";
import { fetchCampaign } from "@/redux/slice/campaign";

import { AppDispatch, RootState } from "@/redux/store";
import {
  BankOutlined,
  BookOutlined,
  DeleteOutlined,
  EditOutlined,
  MailOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  List,
  PaginationProps,
  Popconfirm,
  Select,
  Tag,
} from "antd";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import Loader from "../common/Loader";

interface DataType {
  key: React.Key;
  _id: string;
  type: string;
  title: string;
  description: string;
  active: string;
  startDate: Date;
  endDate: Date;
}

const CampaignList: React.FC = () => {
  const t = useTranslations("pages");
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [pageSize, setPageSize] = useState(4);
  const status = useSelector((state: RootState) => state.campaign.status);
  const data = useSelector((state: RootState) => state.campaign.campaign);
  const totalItems = useSelector(
    (state: RootState) => state.campaign.totalItems
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCampaign({ limit: 4, page: 1 }));
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status !== "idle") {
    }
  }, [searchParams, dispatch]);

  const onChangePagitnation: PaginationProps["onChange"] = async (
    page,
    pageNumber
  ) => {
    dispatch(fetchCampaign({ limit: pageNumber, page }));
    setPageSize(pageNumber);
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "Icon",
      dataIndex: "",
      key: "y",
      render: (value, record) => (
        <div>
          <Link href={"/dashboard/campaign/" + record._id}>
            {value.type === "phishing" ? (
              <MailOutlined
                className="text-[40px] !text-[#3d50e0]"
                color="#3d50e0"
              />
            ) : value.type === "education" ? (
              <BankOutlined
                className="text-[40px] !text-[#b328df]"
                color="#b328df"
              />
            ) : (
              <BookOutlined
                className="text-[40px] !text-[#ce192a]"
                color="#ce192a"
              />
            )}
          </Link>
        </div>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      showSorterTooltip: { target: "full-header" },
      filters: [
        {
          text: "Joe",
          value: "Joe",
        },
        {
          text: "Jim",
          value: "Jim",
        },
        {
          text: "Submenu",
          value: "Submenu",
          children: [
            {
              text: "Green",
              value: "Green",
            },
            {
              text: "Black",
              value: "Black",
            },
          ],
        },
      ],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) => record.title.indexOf(value as string) === 0,
      sorter: (a, b) => a.title.length - b.title.length,
      sortDirections: ["descend"],
      render: (value, record) => {
        return (
          <div>
            <Link href={"/dashboard/campaign/" + record._id}>
              <p>{value}</p>
              <p className="!opacity-70 line-clamp-3 text-black">
                {record.description}
              </p>
            </Link>
          </div>
        );
      },
    },
    {
      title: "type",
      dataIndex: "type",
    },
    {
      title: "active",
      dataIndex: "active",
      render: (value, record) => {
        return (
          <Tag color={value === "active" ? "green" : "default"}>{value}</Tag>
        );
      },
    },
    {
      title: "startDate",
      dataIndex: "startDate",
    },
    {
      title: "endDate",
      dataIndex: "endDate ",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (value, record) => (
        <div className="flex justify-between">
          <Link href={"/dashboard/scenario/update/" + record._id}>
            <EditOutlined key="edit" />
          </Link>
          <Popconfirm
            title={t("delete-document")}
            description={t("delete-document-2")}
            // onConfirm={() => handleDeleteEmailTemplate(scenario._id)}
            okText={t("yes-btn")}
            cancelText={t("no-btn")}
          >
            <DeleteOutlined />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  if (!!data)
    return (
      <div>
        <div className="flex justify-between w-full items-center mb-4">
          <span></span>
          <div className="flex flex-col">
            <Link href="/dashboard/campaign/add">
              <Button type="primary" className="!bg-[#181140] w-full"> {t("menu-campaign-add")}</Button>
            </Link>
            <Select
              className="!mt-4 w-40"
              placeholder="Order"
              onChange={(value) => {
                dispatch(
                  fetchCampaign({ limit: 4, page: 1, filter: { order: value } })
                );
              }}
              options={[
                { value: "default", label: "Varsayılan" },
                { value: "isActive", label: "Aktif Olanlar" },
                { value: "created_at", label: "En son eklenenler" },
                { value: "endDate", label: "Bitiş tarihine göre" },
              ]}
            />
          </div>
        </div>

        <Table<DataType>
          columns={columns}
          bordered
          loading={status === "loading"}
          pagination={{
            total: totalItems,
            pageSizeOptions: [4, 16, 24],
            showTotal: (total) => (
              <p className="opacity-70">Total {total} items</p>
            ),
            defaultPageSize: 4,

            showSizeChanger: true,
            pageSize: pageSize,
            onChange: onChangePagitnation,
          }}
          size="large"
          className="campaign-table"
          rowClassName={(record, index) => {
            if (record.active === "active") return "active h-40";
            if (record.endDate < new Date()) return "closed h-40";
            return "h-40";
          }}
          dataSource={data.map((value) => {
            return {
              key: value._id,
              _id: value._id,
              type: value.type as string,
              title: value.title,
              description: value.description,
              active: value.isActive
                ? "active"
                : value.endDate < new Date()
                  ? "closed"
                  : "pasive",
              startDate: value.startDate,
              endDate: value.endDate,
            };
          })}
          onChange={onChange}
          showSorterTooltip={{ target: "sorter-icon" }}
        />
        {/* <List
          itemLayout="horizontal"
          dataSource={data}
          size="large"
          loading={status === "loading"}
          footer={
            <div>
              <b>Total Items</b> {totalItems}
            </div>
          }
          pagination={{
            total: totalItems,
            pageSizeOptions: [4, 16, 24],
            showTotal: (total) => `Total ${total} items`,
            defaultPageSize: 4,
            pageSize: pageSize,
            onChange: onChangePagitnation,
          }}
          bordered
          renderItem={(item, index) => {
            const actions: React.ReactNode[] = [
              <Link href={"/dashboard/scenario/update/" + item._id}>
                <EditOutlined key="edit" />
              </Link>,
              <Popconfirm
                title={t("delete-document")}
                description={t("delete-document-2")}
                // onConfirm={() => handleDeleteEmailTemplate(scenario._id)}
                okText={t("yes-btn")}
                cancelText={t("no-btn")}
              >
                <DeleteOutlined />
              </Popconfirm>,
            ];
            return (
              <List.Item
                actions={actions}
                className={clsx("", {
                  "!border-red-700 !border-[1px] rounded-t-md": item.isActive,
                })}
              >
                <List.Item.Meta
                  avatar={
                    item.type === "phishing" ? (
                      <MailOutlined
                        className="text-[40px] !text-[#3d50e0]"
                        color="#3d50e0"
                      />
                    ) : item.type === "education" ? (
                      <BankOutlined
                        className="text-[40px] !text-[#b328df]"
                        color="#b328df"
                      />
                    ) : (
                      <BookOutlined
                        className="text-[40px] !text-[#ce192a]"
                        color="#ce192a"
                      />
                    )
                  }
                  title={
                    <Link href={"/dashboard/campaign/" + item._id}>
                      {item.title}
                    </Link>
                  }
                  description={item.description}
                />
                <div className="flex items-center">
                  <div className="mr-6">
                    <p
                      className={clsx("capitalize font-bold text-base", {
                        "text-[#3d50e0]": item.type === "phishing",
                        "text-[#b328df]": item.type === "education",
                        "!text-[#ce192a]": item.type === "news",
                      })}
                    >
                      {item.type}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p>
                      {item.isActive ? (
                        <span className="text-red-700">Active</span>
                      ) : (
                        "Passive"
                      )}
                    </p>
                    <p>StartDate: </p>
                    <p>EndDate: </p>
                  </div>
                </div>
              </List.Item>
            );
          }}
        /> */}
      </div>
    );
  else return <Loader />;
};

export default CampaignList;
