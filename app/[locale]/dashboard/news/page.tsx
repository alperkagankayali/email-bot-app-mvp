import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NewsList from "@/components/news";

const News: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-news" />
        <div>
          <NewsList />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default News;
