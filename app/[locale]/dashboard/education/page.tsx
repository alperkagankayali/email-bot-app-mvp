import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EducationList from "@/components/education";
import Loader from "@/components/common/Loader";

const Education: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-[67rem]">
        <Breadcrumb pageName="menu-education" />
        <div>
          <Suspense fallback={<Loader />}>
            <EducationList />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Education;
