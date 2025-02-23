import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EducationListAdd from "@/components/education/educationListAdd";
import Loader from "@/components/common/Loader";

const EducationAdd: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-education-add" />
        <div>
          <Suspense fallback={<Loader />}>
            <EducationListAdd />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EducationAdd;
