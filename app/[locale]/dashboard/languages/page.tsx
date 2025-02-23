import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Editable from "@/components/Editable";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loader from "@/components/common/Loader";

const BasicChartPage: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-language" />
        <div>
        <Suspense fallback={<Loader />}>
          <Editable />
        </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default BasicChartPage;
