import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PhishingCampaignSteps from "@/components/campaign/form/phishing/phishingCampaignSteps";

const PhishingCampaign: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="menu-campaign-phishing-add" />
        <div>
          <PhishingCampaignSteps />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default PhishingCampaign;
