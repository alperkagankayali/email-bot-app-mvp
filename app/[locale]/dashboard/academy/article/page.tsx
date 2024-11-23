import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ArticleList from "@/components/academy/article";

const Article: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-academy-article" />
        <div>
          <ArticleList />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Article;
