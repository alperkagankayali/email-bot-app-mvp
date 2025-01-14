import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddLandingPageForm from "@/components/landingPage/add";

export const metadata: Metadata = {
  title: "Next.js Chart | prePhish - Next.js Dashboard Template",
  description:
    "This is Next.js Chart page for prePhish - Next.js Tailwind CSS Admin Dashboard Template",
};

const AddLandingPage: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="landing-page-add" />
        <div>
          <AddLandingPageForm />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddLandingPage;
