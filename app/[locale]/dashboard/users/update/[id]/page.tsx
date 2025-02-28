import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loader from "@/components/common/Loader";
import AddUser from "@/components/users/addUser";

type Props = {
  params: { id: string };
};
const UserUpdate = async ({ params: { id } }: Props) => {
  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Suspense fallback={<Loader />}>
          <Breadcrumb pageName="menu-users" />
          <AddUser id={id} />
        </Suspense>
      </div>
    </DefaultLayout>
  );
};

export default UserUpdate;
