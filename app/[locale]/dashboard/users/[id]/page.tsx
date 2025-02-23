import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UserTable from "@/components/users";
import Loader from "@/components/common/Loader";


type Props = {
  params: { id: string };
};
const Resource = async ({ params: { id } }: Props) => {
  return (
    <DefaultLayout>
      <div className="mx-auto">
      <Suspense fallback={<Loader />}>
        <Breadcrumb pageName="menu-users" />
        <UserTable id={id} />
      </Suspense>
      </div>
    </DefaultLayout>
  );
};

export default Resource;
