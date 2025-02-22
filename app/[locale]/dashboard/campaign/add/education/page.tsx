import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EducationCampaignSteps from "@/components/campaign/form/education/educationCampaignSteps";
import Loader from "@/components/common/Loader";

const AddCampaignEducation: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="menu-campaign-education-add" />
        <div>
          <Suspense fallback={<Loader />}>
            <EducationCampaignSteps />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddCampaignEducation;
