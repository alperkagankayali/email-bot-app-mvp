import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CampaignList from "@/components/campaign";

const Campaign: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="menu-campaign" />
        <div>
          <CampaignList />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Campaign;
