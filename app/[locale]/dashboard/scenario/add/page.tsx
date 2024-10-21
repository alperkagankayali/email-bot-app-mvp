import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import RinchTextEditor from "@/components/rinchTextEditor";

export const metadata: Metadata = {
  title: "Next.js Chart | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Chart page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const AddScenario: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-mail" />
        <div>
          <RinchTextEditor />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddScenario;
