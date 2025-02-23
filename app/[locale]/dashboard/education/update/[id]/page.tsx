import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EducationListAdd from "@/components/education/educationListAdd";
import Loader from "@/components/common/Loader";

const EducationUpdate: React.FC<{
  params: { id: string; locale: string };
}> = async ({ params: { id, locale } }) => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-academy-education-Edit" />
        <div>
          <Suspense fallback={<Loader />}>
            <EducationListAdd id={id} />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EducationUpdate;
