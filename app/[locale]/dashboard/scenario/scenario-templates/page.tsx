import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ScenarioList from "@/components/scenarioTemplate";
import Loader from "@/components/common/Loader";

const EmailTemplates: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-[67rem]">
        <Breadcrumb pageName="menu-mail" />
        <div>
          <Suspense fallback={<Loader />}>
            <ScenarioList />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EmailTemplates;
