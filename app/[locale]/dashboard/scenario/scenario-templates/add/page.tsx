import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddScenarioTemplate from "@/components/scenarioTemplate/add";
import Loader from "@/components/common/Loader";


const AddScenario: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-[67rem]">
        <Breadcrumb pageName="landing-page-add" />
        <div>
          <Suspense fallback={<Loader />}>
            <AddScenarioTemplate />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddScenario;
