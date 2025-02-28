import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddUser from "@/components/users/addUser";
import Loader from "@/components/common/Loader";

export const metadata: Metadata = {
  title: "Next.js Chart | prePhish - Next.js Dashboard Template",
  description:
    "This is Next.js Chart page for prePhish - Next.js Tailwind CSS Admin Dashboard Template",
};
const Resource = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-[67rem]">
        <Breadcrumb pageName="menu-users" />
        <div>
          <Suspense fallback={<Loader />}>
            <AddUser id=""/>
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Resource;
