import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UpdateScenarioForm from "@/components/scenarioForm/update";
import Loader from "@/components/common/Loader";

type Props = {
  params: { id: string };
};
const UpdateScenario: React.FC<Props> = async ({ params: { id } }) => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="scenario-template-update" />
        <div>
          <Suspense fallback={<Loader />}>
            <UpdateScenarioForm id={id} />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UpdateScenario;
