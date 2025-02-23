import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CampaignDetailCom from "@/components/campaign/detail";
import Loader from "@/components/common/Loader";
type Props = {
  params: { id: string };
};
const CampaignDetail: React.FC<Props> = async ({ params: { id } }) => {
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="menu-campaign" />
        <div>
          <Suspense fallback={<Loader />}>
            <CampaignDetailCom id={id} />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CampaignDetail;
