import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AuthorizationTable from "@/components/authorization/editableRow";
import Loader from "@/components/common/Loader";

const Authorization: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-user-authorization" />
        <div>
          <Suspense fallback={<Loader />}>
            <AuthorizationTable />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Authorization;
