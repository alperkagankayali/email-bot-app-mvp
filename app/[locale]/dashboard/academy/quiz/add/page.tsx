import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import QuizForm from "@/components/education/form/quizForm";
import Loader from "@/components/common/Loader";

const QuizAdd: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-academy-quiz-add" />
        <div>
          <Suspense fallback={<Loader />}>
            <QuizForm redirect={true} />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default QuizAdd;
