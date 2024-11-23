import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ArticleList from "@/components/academy/article";
import ArticleForm from "@/components/education/form/articleForm";

const ArticleAdd: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-academy-article" />
        <div>
          <ArticleForm />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ArticleAdd;
