import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CompaniesTable from "@/components/companies";
import { Metadata } from "next";
import Loader from "@/components/common/Loader";
export const metadata: Metadata = {
  title: "Next.js E-commerce Dashboard | prePhish - Next.js Dashboard Template",
  description: "This is Next.js Home for prePhish Dashboard Template",
};

const Campanies: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-companies" />
        <div>
          <Suspense fallback={<Loader />}>
            <CompaniesTable />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Campanies;
