import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EducationList from "@/components/education";

const Education: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="menu-education" />
        <div>
          <EducationList />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Education;
