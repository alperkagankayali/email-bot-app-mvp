"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  Modal,
  notification,
  Pagination,
  PaginationProps,
  Radio,
  Badge,
  Result,
} from "antd";
import { noImage } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  changeContentStatus,
  fetchDataEntry,
  fetchEmailTemplate,
  fetchLandingPage,
  handleChangeScenarioData,
} from "@/redux/slice/scenario";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { CloseCircleOutlined, EyeOutlined } from "@ant-design/icons";
import {
  getDataEntries,
  getEmailTemplate,
  getLandingPage,
} from "@/services/service/generalService";
import clsx from "clsx";
import Loader from "../common/Loader";
import EmailTemplateFilter from "../emailTemplate/filter";
const { Meta } = Card;
type IProps = {
  type: "emailTemplate" | "landingPage" | "dataEntry";
  next: () => void;
  prev: () => void;
  current: number;
};
const TemplateList: React.FC<IProps> = ({ type, next, prev, current }) => {
  const itemName = type + "TotalItem";
  const [pageSize, setPageSize] = useState(6);
  const emailTemplateStatus = useSelector(
    (state: RootState) => state.scenario.emailTemplateStatus
  );
  const landingPageStatus = useSelector(
    (state: RootState) => state.scenario.landingPageStatus
  );
  const dataEntryStatus = useSelector(
    (state: RootState) => state.scenario.dataEntryStatus
  );
  const emailTemplate = useSelector(
    (state: RootState) => state.scenario.emailTemplate
  );
  const landingPage = useSelector(
    (state: RootState) => state.scenario.landingPage
  );
  const dataEntries = useSelector(
    (state: RootState) => state.scenario.dataEntries
  );
  const scenarioData: any = useSelector(
    (state: RootState) => state.scenario.creteScenario
  );
  const allstate: any = useSelector((state: RootState) => state.scenario);
  const dispatch = useDispatch<AppDispatch>();
  const t = useTranslations("pages");
  const [open, setOpen] = useState({
    show: false,
    data: "",
  });
  const [selected, setSelected] = useState(scenarioData[type] ?? "");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<{
    name: string;
    language: string;
    authorType: string[];
  }>({
    name: "",
    language: "",
    authorType: [],
  });

  const onChange: PaginationProps["onChange"] = async (page, pageNumber) => {
    let filterTemp: any = {
      limit: pageNumber,
      page: page,
      ...filter,
    };
    if (page === 1) {
      filterTemp.orderId = selected;
    }
    if (type === "emailTemplate") {
      dispatch(fetchEmailTemplate(filterTemp));
    } else if (type === "landingPage") {
      dispatch(fetchLandingPage(filterTemp));
    } else if (type === "dataEntry") {
      dispatch(fetchDataEntry(filterTemp));
    } else {
      notification.error({ message: "type is not defined" });
    }
    setPage(page);
    setPageSize(pageNumber);
  };

  useEffect(() => {
    if (type === "emailTemplate" && emailTemplateStatus === "idle") {
      dispatch(
        fetchEmailTemplate({ limit: 6, page: 1, orderId: scenarioData[type] })
      );
    }
    if (type === "dataEntry" && dataEntryStatus === "idle") {
      dispatch(
        fetchDataEntry({ limit: 6, page: 1, orderId: scenarioData[type] })
      );
    }
    if (type === "landingPage" && landingPageStatus === "idle") {
      dispatch(
        fetchLandingPage({ limit: 6, page: 1, orderId: scenarioData[type] })
      );
    }
  }, [
    emailTemplateStatus,
    landingPageStatus,
    dataEntryStatus,
    dispatch,
    current,
  ]);

  useEffect(() => {
    if (!!scenarioData[type]) {
      dispatch(
        changeContentStatus({
          status:
            type === "landingPage"
              ? "landingPageStatus"
              : type === "dataEntry"
                ? "dataEntryStatus"
                : "emailTemplateStatus",
          value: "idle",
        })
      );
      setPage(1);
      setPageSize(6);
      setSelected(scenarioData[type]);
    }
  }, [type]);

  const selectData =
    type === "dataEntry"
      ? dataEntries
      : type === "emailTemplate"
        ? emailTemplate
        : landingPage;

  if (
    type === "dataEntry"
      ? dataEntryStatus == "loading"
      : type === "emailTemplate"
        ? emailTemplateStatus === "loading"
        : landingPageStatus === "loading"
  ) {
    return (
      <div className="h-[700px] bg-white flex items-center justify-center">
        <Loader className="!h-auto" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start bg-white">
      {type === "emailTemplate" && (
        <EmailTemplateFilter
          filter={filter}
          setFilter={setFilter}
          pageSize={1}
          isPage={false}
        />
      )}
      {selectData !== null && !!selectData && selectData?.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 p-8 mt-4 w-full bg-white">
          {selectData?.slice(0, 6).map((list) => {
            const actions: React.ReactNode[] = [
              <EyeOutlined
                key="ellipsis"
                onClick={() => setOpen({ show: true, data: list.content })}
              />,
            ];
            return (
              <Radio.Group
                onChange={(e) => {
                  dispatch(
                    handleChangeScenarioData({
                      ...scenarioData,
                      [type]: e.target.value,
                    })
                  );
                  setSelected(e.target.value);
                }}
                key={list._id}
                buttonStyle="solid"
                className={
                  selected === list._id
                    ? "template-list h-auto selected"
                    : "template-list h-auto"
                }
                value={selected}
              >
                <Radio value={list._id} className="h-full flex">
                  <Badge.Ribbon
                    className="card-title-ribbon"
                    color={list?.authorType === "superadmin" ? "green" : "red"}
                    text={
                      list?.authorType === "superadmin" ? "Global" : "Local"
                    }
                    key={list._id}
                  >
                    <Card
                      actions={actions}
                      className={clsx("flex flex-col", {
                        "!border !border-blue-700": selected === list._id,
                      })}
                      rootClassName="flex h-full"
                      key={list._id}
                      hoverable
                      loading={
                        emailTemplateStatus === "loading" ||
                        dataEntryStatus === "loading" ||
                        landingPageStatus === "loading"
                      }
                      style={{
                        width: 240,
                        boxShadow:
                          selected === list._id
                            ? "0 1px 2px -2px rgba(0, 0, 0, 0.16),0 3px 6px 0 rgba(0, 0, 0, 0.12),0 5px 12px 4px rgba(0, 0, 0, 0.09)"
                            : "inherit",
                      }}
                      cover={
                        <Image
                          width={240}
                          height={120}
                          className="bg-[#03162b] h-30 object-contain "
                          alt={list.title}
                          src={
                            (emailTemplateStatus === "loading" ||
                            dataEntryStatus === "loading" ||
                            landingPageStatus === "loading"
                              ? noImage
                              : list.img) || noImage
                          }
                        />
                      }
                    >
                      <Meta title={list.title} />
                    </Card>
                  </Badge.Ribbon>
                </Radio>
              </Radio.Group>
            );
          })}
        </div>
      ) : (
        <div className="h-[700px] bg-white w-full flex items-center justify-center">
          {" "}
          <Result
            status="404"
            icon={
              <CloseCircleOutlined className="site-result-demo-error-icon" />
            }
            title={t("not-found") + "!"}
          />
        </div>
      )}
      <div className="mt-10 mb-20 w-full">
        {!!allstate[itemName] && (
          <Pagination
            onChange={onChange}
            current={page}
            total={allstate[itemName]}
            pageSize={pageSize}
            showTotal={(total) => t("total-count", { count: total })}
            showSizeChanger={false}
            defaultPageSize={6}
            align="center"
          />
        )}
      </div>
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

export default TemplateList;
