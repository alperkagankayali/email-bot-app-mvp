import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import QuizForm from "@/components/education/form/quizForm";
import Loader from "@/components/common/Loader";

const QuizUpdate: React.FC<{
  params: { id: string };
}> = async ({ params: { id } }) => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-academy-quiz-update" />
        <div>
          <Suspense fallback={<Loader />}>
            <QuizForm redirect={true} quizId={id} />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default QuizUpdate;
