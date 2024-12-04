import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ArticleForm from "@/components/education/form/articleForm";
import QuizForm from "@/components/education/form/quizForm";

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
          <QuizForm redirect={true} quizId={id} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ArticleUpdate;
