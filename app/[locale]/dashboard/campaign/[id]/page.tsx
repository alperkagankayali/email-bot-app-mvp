import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CampaignDetailCom from "@/components/campaign/detail";
type Props = {
  params: { id: string };
};
const CampaignDetail: React.FC<Props> = async ({ params: { id } }) => {
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="menu-campaign" />
        <div>
          <CampaignDetailCom id={id} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CampaignDetail;
