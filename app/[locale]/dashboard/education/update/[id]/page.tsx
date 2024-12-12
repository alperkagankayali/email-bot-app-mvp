import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EducationListAdd from "@/components/education/educationListAdd";

const EducationUpdate: React.FC <{
  params: { id: string ,locale:string}
}>= async ({
  params: { id ,locale},
}) => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-academy-education-Edit" />
        <div>
        <EducationListAdd id={id} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EducationUpdate;
