import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import NewsForm from "@/components/news/newsForm";
import Loader from "@/components/common/Loader";
type Props = {
  params: { id: string };
};
const UpdateNews: React.FC<Props> = async ({ params: { id } }) => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-[67rem]">
        <Breadcrumb pageName="menu-news-update" />
        <div>
          <Suspense fallback={<Loader />}>
            <NewsForm id={id} />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UpdateNews;
