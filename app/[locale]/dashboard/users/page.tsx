import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UserTable from "@/components/users";
import Loader from "@/components/common/Loader";

const Users = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="menu-users" />
        <Suspense fallback={<Loader />}>
          <UserTable />
        </Suspense>
      </div>
    </DefaultLayout>
  );
};

export default Users;
