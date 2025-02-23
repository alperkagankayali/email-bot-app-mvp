import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ScenarioList from "@/components/scenario";
import Loader from "@/components/common/Loader";

export const metadata: Metadata = {
  title: "Next.js Chart | prePhish - Next.js Dashboard Template",
  description:
    "This is Next.js Chart page for prePhish - Next.js Tailwind CSS Admin Dashboard Template",
};

const Scenario: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="menu-scenario" />
        <div>
          <Suspense fallback={<Loader />}>
            <ScenarioList />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Scenario;
