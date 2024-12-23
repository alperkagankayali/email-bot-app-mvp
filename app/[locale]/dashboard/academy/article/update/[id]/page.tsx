import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ArticleForm from "@/components/education/form/articleForm";

const ArticleUpdate: React.FC <{
  params: { id: string }
}>= async ({
  params: { id },
}) => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-academy-article" />
        <div>
          <ArticleForm redirect={true} articleId={id} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ArticleUpdate;
