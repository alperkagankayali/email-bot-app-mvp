import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NewsList from "@/components/news";
import Loader from "@/components/common/Loader";

const News: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-[67rem]">
        <Breadcrumb pageName="menu-news" />
        <div>
          <Suspense fallback={<Loader />}>
            <NewsList />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default News;
