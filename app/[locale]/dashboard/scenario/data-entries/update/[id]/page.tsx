import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UpdateDataEntryForm from "@/components/dataEntries/update";
import Loader from "@/components/common/Loader";


type Props = {
  params: { id: string };
};
const UpdateLandingPage: React.FC<Props> = async ({ params: { id } }) => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-[67rem]">
        <Breadcrumb pageName="data-entry-update" />
        <div>
        <Suspense fallback={<Loader />}>
          <UpdateDataEntryForm id={id}/>
        </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UpdateLandingPage;
