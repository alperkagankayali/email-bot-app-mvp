import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EducationRelationshipTable from "@/components/educationRelationshipTable";
import Loader from "@/components/common/Loader";

const EducationRelationship: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-[67rem]">
        <Breadcrumb pageName="menu-scenario-education-relationship" />
        <div>
          <Suspense fallback={<Loader />}>
            <EducationRelationshipTable />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EducationRelationship;
