import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NewsForm from "@/components/news/newsForm";
import Loader from "@/components/common/Loader";

const AddNews: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-news-add" />
        <div>
          <Suspense fallback={<Loader />}>
            <NewsForm />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddNews;
