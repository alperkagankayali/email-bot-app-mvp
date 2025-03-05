import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loader from "@/components/common/Loader";
import dynamic from "next/dynamic";
const ArticleForm = dynamic(
  () => import("@/components/education/form/articleForm"),
  {
    ssr: false,
  }
);
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
