"use client";
import { noImage } from "@/constants";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { fetchCampaign } from "@/redux/slice/campaign";
import { fetchEducationList } from "@/redux/slice/education";
import { AppDispatch, RootState } from "@/redux/store";
import { DeleteFilled, DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Pagination, PaginationProps, Popconfirm, Popover, Tag } from "antd";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const { Meta } = Card;

const CampaignList: React.FC = () => {
  const t = useTranslations("pages");
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState<{ show: boolean; data: any }>({
    show: false,
    data: {},
  });
  const status = useSelector((state: RootState) => state.campaign.status);
  const data = useSelector((state: RootState) => state.campaign.campaign);
  const user = useSelector((state: RootState) => state.user.user);
  const totalItems = useSelector(
    (state: RootState) => state.campaign.totalItems
  );

  const [pageSize, setPageSize] = useState(8);
  const [filter, setFilter] = useState({
    title: searchParams.get("title") ?? "",
    description: searchParams.get("description") ?? "",
    levelOfDifficulty: searchParams.get("levelOfDifficulty") ?? "",
    authorType: searchParams.get("authorType")?.split("&") ?? [],
    language: searchParams.get("language")?.split("&") ?? [],
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCampaign(10));
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
    dispatch(
      fetchEducationList({
        limit: pageNumber,
        page,
        language: searchParams.get("language") ?? "",
        title: searchParams.get("title") ?? "",
        description: searchParams.get("description") ?? "",
        levelOfDifficulty: searchParams.get("levelOfDifficulty") ?? "",
        authorType: searchParams.get("authorType") ?? "",
      })
    );
    setPageSize(pageNumber);
  };

  return (
    <div>
      <div className="flex justify-between w-full items-center mb-4">
        <span></span>
        <Link href="/dashboard/campaign/add">
          <Button type="primary"> {t("menu-campaign-add")}</Button>
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-8 mt-4">
        {data?.map((scenario) => {
          const actions: React.ReactNode[] = [
            <Link href={"/dashboard/scenario/update/" + scenario._id}>
              <EditOutlined key="edit" />
            </Link>,
            <EyeOutlined
              key="ellipsis"
              onClick={() =>
                setOpen({
                  show: true,
                  data:"",
                  // data: scenario.?.content ?? "",
                })
              }
            />,
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
            <Badge.Ribbon
              className="card-title-ribbon"
              color={scenario?.authorType === "superadmin" ? "green" : "red"}
              text={scenario?.authorType === "superadmin" ? "Global" : "Local"}
              key={scenario._id}
            >
              <Card
                actions={actions}
                key={scenario._id}
                hoverable
                loading={status === "loading"}
                style={{ width: 240 }}
                rootClassName="flex h-full"
                className="flex flex-col "
                cover={
                  <Image
                    width={240}
                    height={120}
                    className="h-30 object-contain bg-[#03162b]"
                    alt={scenario.title}
                    src={status === "loading" ? noImage :""}
                  />
                }
              >
                <Meta
                  className="card-meta"
                  title={scenario.title}
                  description={
                    <div className="">
                      {/* <p>{scenario.scenarioType.title}</p>
                      <p>{scenario?.language.name}</p> */}
                    </div>
                  }
                />
              </Card>
            </Badge.Ribbon>
          );
        })}
      </div>
      <div className="mt-10 mb-20 w-full">
        {!!totalItems && (
          <Pagination
            onChange={onChangePagitnation}
            total={totalItems}
            pageSize={pageSize}
            showTotal={(total) => `Total ${total} items`}
            showSizeChanger
            defaultPageSize={8}
            align="center"
            pageSizeOptions={[8, 16, 24]}
          />
        )}
      </div>
    </div>
  );
};

export default CampaignList;
