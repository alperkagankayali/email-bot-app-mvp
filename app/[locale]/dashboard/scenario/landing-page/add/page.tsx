import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddLandingPageForm from "@/components/landingPage/add";
import Loader from "@/components/common/Loader";

const AddLandingPage: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="landing-page-add" />
        <div>
          <Suspense fallback={<Loader />}>
            <AddLandingPageForm />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddLandingPage;
