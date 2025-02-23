import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddLandingPageForm from "@/components/landingPage/add";
import UpdateLandingPageForm from "@/components/landingPage/update";
import Loader from "@/components/common/Loader";

export const metadata: Metadata = {
  title: "Next.js Chart | prePhish - Next.js Dashboard Template",
  description:
    "This is Next.js Chart page for prePhish - Next.js Tailwind CSS Admin Dashboard Template",
};

type Props = {
  params: { id: string };
};
const UpdateLandingPage: React.FC<Props> = async ({ params: { id } }) => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="landing-page-update" />
        <div>
          <Suspense fallback={<Loader />}>
            <UpdateLandingPageForm id={id} />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UpdateLandingPage;
