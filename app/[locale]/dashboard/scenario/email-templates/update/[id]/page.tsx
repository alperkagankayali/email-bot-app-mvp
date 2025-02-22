import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UpdateEmailTemplateForm from "@/components/emailTemplate/update";
import Loader from "@/components/common/Loader";

type Props = {
  params: { id: string };
};
const UpdateLandingPage: React.FC<Props> = async ({ params: { id } }) => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="email-template-update" />
        <div>
          <Suspense fallback={<Loader />}>
            <UpdateEmailTemplateForm id={id} />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UpdateLandingPage;
