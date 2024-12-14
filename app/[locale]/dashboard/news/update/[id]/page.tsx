import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NewsForm from "@/components/news/newsForm";
type Props = {
  params: { id: string };
};
const UpdateNews: React.FC<Props> = async ({ params: { id } }) => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-news-update" />
        <div>
          <NewsForm id={id} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UpdateNews;
