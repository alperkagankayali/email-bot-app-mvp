import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CampaignList from "@/components/campaign";
import Loader from "@/components/common/Loader";

const Campaign: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="menu-campaign" />
        <div>
        <Suspense fallback={<Loader />}>
          <CampaignList />
        </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Campaign;
