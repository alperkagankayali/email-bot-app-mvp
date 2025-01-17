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
import TestCampaign from "./campaignDetail/testCampaign";
type IProps = {
  id?: string;
};
const CampaignDetailCom: React.FC<IProps> = ({ id }) => {
  const t = useTranslations("pages");
  const [data, setData] = useState<ICampaign>();
  const [open, setOpen] = useState(false);

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
              <CompassFilled
                onClick={() => setOpen(true)}
                className="!text-3xl"
              />
            </Popover>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-10 bg-white p-4 rounded-lg">
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
        {open && <TestCampaign open={open} setOpen={setOpen} />}
      </div>
    );
  } else return <Loader />;
};

export default CampaignDetailCom;
