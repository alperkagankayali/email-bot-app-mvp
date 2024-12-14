import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NewsDetail from "@/components/news/detail";
type Props = {
  params: { id: string };
};
const UpdateNews: React.FC<Props> = async ({ params: { id } }) => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5 pb-10">
        <Breadcrumb pageName="menu-news-update" />
        <div>
          <NewsDetail id={id} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UpdateNews;
