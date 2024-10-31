import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UpdateEmailTemplateForm from "@/components/emailTemplate/update";

export const metadata: Metadata = {
  title: "Next.js Chart | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Chart page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

type Props = {
  params: { id: string };
};
const UpdateLandingPage: React.FC<Props> = async ({ params: { id } }) => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="email-template-update" />
        <div>
          <UpdateEmailTemplateForm id={id}/>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UpdateLandingPage;
