import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NewsDetail from "@/components/news/detail";
import Loader from "@/components/common/Loader";
type Props = {
  params: { id: string };
};
const UpdateNews: React.FC<Props> = async ({ params: { id } }) => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5 pb-10">
        <Breadcrumb pageName="menu-news-update" />
        <div>
          <Suspense fallback={<Loader />}>
            <NewsDetail id={id} />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UpdateNews;
