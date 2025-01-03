"use client";
import Loader from "@/components/common/Loader";
import { noImage } from "@/constants";
import { Link } from "@/i18n/routing";
import { getScenario } from "@/services/service/generalService";
import { IScenario } from "@/types/scenarioType";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import {
  Badge,
  Card,
  Checkbox,
  Modal,
  Pagination,
  PaginationProps,
  Radio,
} from "antd";
import Meta from "antd/es/card/Meta";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
const CheckboxGroup = Checkbox.Group;

type IPorps = {
  selected: string[];
  setSelected: (x: string[]) => void;
  scenarioType: string;
};

const CampaignScenarioList: React.FC<IPorps> = ({
  selected,
  setSelected,
  scenarioType,
}) => {
  const t = useTranslations("pages");
  const [open, setOpen] = useState({
    show: false,
    data: "",
  });

  const [data, setData] = useState<IScenario[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageSize, setPageSize] = useState(8);

  const fetchScenario = async (limit: number, page: number) => {
    const res = await getScenario({ scenarioType, limit, page });
    setLoading(false);
    if (res.success) {
      setTotalItems(res?.totalItems ?? 0);
      setData(res.data);
    }
  };

  useEffect(() => {
    const fetchScenario = async (limit: number, page: number) => {
      const res = await getScenario({ scenarioType, limit, page });
      setLoading(false);
      if (res.success) {
        setTotalItems(res?.totalItems ?? 0);
        setData(res.data);
      }
    };
    fetchScenario(8, 1);
  }, []);

  const onChangePagitnation: PaginationProps["onChange"] = async (
    page,
    pageNumber
  ) => {
    await fetchScenario(pageNumber, page);
    setPageSize(pageNumber);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div>
        <CheckboxGroup
          onChange={(value) => setSelected(value)}
          className={"card-checkbox !grid grid-cols-4 gap-10"}
          value={selected}
        >
          {data?.map((scenario) => {
            const selectScenario = selected.some((e) => e === scenario._id);
            const actions: React.ReactNode[] = [
              <Link href={"/dashboard/scenario/update/" + scenario._id}>
                <EditOutlined key="edit" />
              </Link>,
              <EyeOutlined
                key="ellipsis"
                onClick={() =>
                  setOpen({
                    show: true,
                    data: scenario.emailTemplate?.content ?? "",
                  })
                }
              />,
            ];
            return (
              <Checkbox
                value={scenario._id}
                key={scenario._id}
                className="card-checkbox-check"
              >
                <Badge.Ribbon
                  className="card-title-ribbon"
                  color={
                    scenario?.authorType === "superadmin" ? "green" : "red"
                  }
                  text={
                    scenario?.authorType === "superadmin" ? "Global" : "Local"
                  }
                  key={scenario._id}
                >
                  <Card
                    actions={actions}
                    key={scenario._id}
                    hoverable
                    className={clsx("!h-full !pt-2", {
                      "!border !border-blue-700": selectScenario,
                    })}
                    loading={loading}
                    style={{
                      width: 240,
                      boxShadow: selectScenario
                        ? "0 1px 2px -2px rgba(0, 0, 0, 0.16),0 3px 6px 0 rgba(0, 0, 0, 0.12),0 5px 12px 4px rgba(0, 0, 0, 0.09)"
                        : "inherit",
                    }}
                    rootClassName="flex h-full"
                    cover={
                      <Image
                        width={240}
                        height={120}
                        className="h-30 object-contain bg-[#03162b]"
                        alt={scenario.title}
                        src={loading ? noImage : scenario.img}
                      />
                    }
                  >
                    <Meta
                      className="card-meta"
                      title={scenario.title}
                      description={
                        <div className="">
                          <p>{scenario.scenarioType.title}</p>
                          <p>{scenario?.language.name}</p>
                        </div>
                      }
                    />
                  </Card>
                </Badge.Ribbon>
              </Checkbox>
            );
          })}
        </CheckboxGroup>
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

export default CampaignScenarioList;
