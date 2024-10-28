import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CompaniesTable from "@/components/companies";
import { Metadata } from "next";
export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

const Campanies: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-companies" />
        <div>
          <CompaniesTable />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Campanies;
