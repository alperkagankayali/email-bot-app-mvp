import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import LandingPageList from "@/components/landingPage";
import Loader from "@/components/common/Loader";

const LandingPage: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-[67rem]">
        <Breadcrumb pageName="menu-landing-pages" />
        <div>
          <Suspense fallback={<Loader />}>
            <LandingPageList />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default LandingPage;
