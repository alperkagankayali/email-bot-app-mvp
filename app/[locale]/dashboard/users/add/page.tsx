import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
  title: "Next.js Chart | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Chart page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const Resource = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="menu-users" />

      </div>
    </DefaultLayout>
  );
};

export default Resource;
