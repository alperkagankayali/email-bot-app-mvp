import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import QuizList from "@/components/academy/quiz";

const Quiz: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-academy-quiz" />
        <div>
          <QuizList />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Quiz;
