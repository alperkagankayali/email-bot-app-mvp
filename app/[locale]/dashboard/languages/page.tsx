import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Editable from "@/components/Editable";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const BasicChartPage: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-language" />
        <div>
          <Editable />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default BasicChartPage;
