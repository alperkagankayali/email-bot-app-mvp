import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EducationAddForm from "@/components/education/add";

const EducationAdd: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-education-add" />
        <div>
          <EducationAddForm />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EducationAdd;
