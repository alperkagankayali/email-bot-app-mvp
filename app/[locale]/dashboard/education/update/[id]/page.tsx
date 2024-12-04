import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EducationAddForm from "@/components/education/add";

const EducationUpdate: React.FC <{
  params: { id: string }
}>= async ({
  params: { id },
}) => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-academy-article" />
        <div>
        <EducationAddForm id={id} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EducationUpdate;
