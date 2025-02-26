import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ArticleForm from "@/components/education/form/articleForm";
import Loader from "@/components/common/Loader";

const ArticleUpdate: React.FC<{
  params: { id: string };
}> = async ({ params: { id } }) => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-[67rem]">
        <Breadcrumb pageName="menu-academy-article" />
        <div>
          <Suspense fallback={<Loader />}>
            <ArticleForm redirect={true} articleId={id} />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ArticleUpdate;
