import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import EmailTemplateList from "@/components/emailTemplate";

export const metadata: Metadata = {
  title: "Next.js Chart | prePhish - Next.js Dashboard Template",
  description:
    "This is Next.js Chart page for prePhish - Next.js Tailwind CSS Admin Dashboard Template",
};

const EmailTemplates: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-mail" />
        <div>
         <EmailTemplateList />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EmailTemplates;
