import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CampaignForm from "@/components/campaign/form";

const Campaign: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="menu-campaign-add" />
        <div>
          <CampaignForm />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Campaign;
