import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NewsForm from "@/components/news/newsForm";

const AddNews: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-news-add" />
        <div>
            <NewsForm />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddNews;
