import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NewsCampaignSteps from "@/components/campaign/form/news/newsCampaignSteps";
import Loader from "@/components/common/Loader";

const AddCampaignNews: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="create-news-campaign" />
        <div>
          <Suspense fallback={<Loader />}>
            <NewsCampaignSteps />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddCampaignNews;
