import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EducationCampaignSteps from "@/components/campaign/form/education/educationCampaignSteps";


const AddCampaignEducation: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="menu-campaign-education-add" />
        <div>
          <EducationCampaignSteps />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddCampaignEducation;
