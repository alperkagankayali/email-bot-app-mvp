import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PhishingCampaignSteps from "@/components/campaign/form/phishing/phishingCampaignSteps";
import Loader from "@/components/common/Loader";

const PhishingCampaign: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="menu-campaign-phishing-add" />
        <div>
          <Suspense fallback={<Loader />}>
            <PhishingCampaignSteps />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default PhishingCampaign;
