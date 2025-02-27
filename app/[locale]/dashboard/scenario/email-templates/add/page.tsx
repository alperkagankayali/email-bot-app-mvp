import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AddEmailTemplateForm from "@/components/emailTemplate/add";
import Loader from "@/components/common/Loader";


const AddLandingPage: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-[67rem]">
        <Breadcrumb pageName="email-template-add" />
        <div>
          <Suspense fallback={<Loader />}>
            <AddEmailTemplateForm />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddLandingPage;
