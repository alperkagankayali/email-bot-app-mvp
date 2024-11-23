import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import QuizForm from "@/components/education/form/quizForm";

const QuizAdd: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-academy-quiz-add" />
        <div>
          <QuizForm redirect={true} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default QuizAdd;
