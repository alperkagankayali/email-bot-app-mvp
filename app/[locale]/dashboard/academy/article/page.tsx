import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ArticleList from "@/components/academy/article";
import Loader from "@/components/common/Loader";

const Article: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-academy-article" />
        <div>
          <Suspense fallback={<Loader />}>
            <ArticleList />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Article;
