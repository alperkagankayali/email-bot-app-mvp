"use client";
import { Link } from "@/i18n/routing";
import { fetchCampaign } from "@/redux/slice/campaign";

import { AppDispatch, RootState } from "@/redux/store";
import { getCampaign } from "@/services/service/campaignService";
import { ICampaign } from "@/types/campaignType";
import {
  BankOutlined,
  BookOutlined,
  CompassFilled,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  MailOutlined,
  PauseCircleFilled,
  PlayCircleFilled,
  SignalFilled,
} from "@ant-design/icons";
import {
  Button,
  List,
  PaginationProps,
  Popconfirm,
  Popover,
  Progress,
  Tooltip,
} from "antd";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../common/Loader";
type IProps = {
  id?: string;
};
const CampaignDetailCom: React.FC<IProps> = ({ id }) => {
  const t = useTranslations("pages");
  const [data, setData] = useState<ICampaign>();

  useEffect(() => {
    if (!!id) {
      const fetchCampaingById = async () => {
        const res = await getCampaign(10, 1, id);
        if (res.success) {
          setData(res.data);
        }
      };
      fetchCampaingById();
    }
  }, [id]);

  console.log("data", data, data?.type, data?.scenarioType.title);
  if (!!data) {
    return (
      <div>
        <div className="flex justify-between  w-full  mb-4">
          <span></span>
          <div>
            <Popover
              content={"Campaign start"}
              className="mr-2 cursor-pointer"
              title="Campaign"
            >
              <PlayCircleFilled className="!text-3xl" />
            </Popover>
            <Popover
              content={"Campaign fnish"}
              className="mr-2 cursor-pointer"
              title="Campaign"
            >
              <PauseCircleFilled className="!text-3xl" />
            </Popover>
            <Popover
              content={"Campaign report"}
              className="mr-2 cursor-pointer"
              title="Campaign"
            >
              <SignalFilled className="!text-3xl" />
            </Popover>
            <Popover
              content={"Campaign test"}
              className="mr-2 cursor-pointer"
              title="Campaign"
            >
              <CompassFilled className="!text-3xl" />
            </Popover>
          </div>
        </div>
        {/* <List bordered>
          <List.Item>
            <List.Item.Meta
              avatar={
                data.type === "phishing" ? (
                  <MailOutlined
                    className="text-[40px] !text-[#3d50e0]"
                    color="#3d50e0"
                  />
                ) : data.type === "education" ? (
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
                <Link href={"/dashboard/campaign/" + data._id}>
                  {data.title}
                </Link>
              }
              description={data.description}
            />
            <div className="flex datas-center">
              <div className="mr-6">
                <p
                  className={clsx("capitalize font-bold text-base", {
                    "text-[#3d50e0]": data.type === "phishing",
                    "text-[#b328df]": data.type === "education",
                    "!text-[#ce192a]": data.type === "news",
                  })}
                >
                  {data.type}
                </p>
              </div>
              <div className="flex flex-col">
                <p>
                  {data.isActive ? (
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
        </List> */}
        <div className="grid grid-cols-3 gap-10">
          <div className="flex flex-col justify-center items-center border p-4 rounded-lg">
            <div className="flex flex-row-reverse mb-4">
              <Tooltip title="prompt text">
                <ExclamationCircleOutlined className="text-xl" />
              </Tooltip>
              <p className="mr-2">SEND</p>
            </div>
            <p className="my-2 font-bold">4</p>
            <Progress
              type="circle"
              percent={75}
              size={100}
              strokeColor="#ee6055"
            />
          </div>
          <div className="flex flex-col justify-center items-center border p-4 rounded-lg">
            <div className="flex flex-row-reverse mb-4">
              <Tooltip title="prompt text">
                <ExclamationCircleOutlined className="text-xl" />
              </Tooltip>
              <p className="mr-2">OPEND</p>
            </div>
            <p className="my-2 font-bold">0</p>
            <Progress
              type="circle"
              percent={0}
              size={100}
              strokeColor="#60d394"
            />
          </div>
          {data.type === "phishing" &&
            data.scenarioType.title !== "clickable_link" && (
              <div className="flex flex-col justify-center items-center border p-4 rounded-lg">
                <div className="flex flex-row-reverse mb-4">
                  <Tooltip title="prompt text">
                    <ExclamationCircleOutlined className="text-xl" />
                  </Tooltip>
                  <p className="mr-2">DATA ENTRY</p>
                </div>
                <p className="my-2 font-bold">10</p>
                <Progress
                  type="circle"
                  strokeColor="#aaf683"
                  percent={75}
                  size={100}
                />
              </div>
            )}
          <div className="flex flex-col justify-center items-center border p-4 rounded-lg">
            <div className="flex flex-row-reverse mb-4">
              <Tooltip title="prompt text">
                <ExclamationCircleOutlined className="text-xl" />
              </Tooltip>
              <p className="mr-2">CLIKED</p>
            </div>
            <p className="my-2 font-bold">6</p>
            <Progress type="circle" strokeColor="#ffd97d" percent={75} />
          </div>
          <div className="flex flex-col justify-center items-center border p-4 rounded-lg">
            <div className="flex flex-row-reverse mb-4">
              <Tooltip title="prompt text">
                <ExclamationCircleOutlined className="text-xl" />
              </Tooltip>
              <p className="mr-2">ATTACHEMENT</p>
            </div>
            <p className="my-2 font-bold">4</p>
            <Progress
              percent={25}
              strokeColor="#ff9b85"
              size={100}
              type="circle"
            />
          </div>
          <div className="flex flex-col justify-center items-center border p-4 rounded-lg">
            <div className="flex flex-row-reverse mb-4">
              <Tooltip title="prompt text">
                <ExclamationCircleOutlined className="text-xl" />
              </Tooltip>
              <p className="mr-2">REPORTED</p>
            </div>
            <p className="my-2 font-bold">1</p>
            <Progress
              type="circle"
              percent={100}
              size={100}
              strokeColor="#ff6392"
            />
          </div>
        </div>
      </div>
    );
  } else return <Loader />;
};

export default CampaignDetailCom;
