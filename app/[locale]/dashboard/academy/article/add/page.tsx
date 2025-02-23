import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ArticleForm from "@/components/education/form/articleForm";
import Loader from "@/components/common/Loader";

const ArticleAdd: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-academy-article" />
        <div>
          <Suspense fallback={<Loader />}>
            <ArticleForm />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ArticleAdd;
