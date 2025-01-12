import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EducationRelationshipTable from "@/components/educationRelationshipTable";

const EducationRelationship: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-scenario-education-relationship" />
        <div>
          <EducationRelationshipTable />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EducationRelationship;
