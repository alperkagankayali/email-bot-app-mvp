import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import ResourceTable from "@/components/Resource/editableRow";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loader from "@/components/common/Loader";

export const metadata: Metadata = {
  title: "Next.js Chart | prePhish - Next.js Dashboard Template",
  description:
    "This is Next.js Chart page for prePhish - Next.js Tailwind CSS Admin Dashboard Template",
};

const Resource: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-resource" />
        <div>
          <Suspense fallback={<Loader />}>
            <ResourceTable />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Resource;
