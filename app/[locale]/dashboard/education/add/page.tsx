import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EducationListAdd from "@/components/education/educationListAdd";

const EducationAdd: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-education-add" />
        <div>
          <EducationListAdd />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EducationAdd;
