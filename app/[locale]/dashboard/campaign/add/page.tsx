import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CampaignForm from "@/components/campaign/form";
import Loader from "@/components/common/Loader";

const Campaign: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="menu-campaign-add" />
        <div>
          <Suspense fallback={<Loader />}>
            <CampaignForm />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Campaign;
