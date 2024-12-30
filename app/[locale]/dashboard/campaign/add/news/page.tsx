import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NewsCampaignSteps from "@/components/campaign/form/news/newsCampaignSteps";

const AddCampaignNews: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="create-news-campaign" />
        <div>
          <NewsCampaignSteps />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddCampaignNews;
