import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import QuizList from "@/components/academy/quiz";
import Loader from "@/components/common/Loader";

const Quiz: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-[67rem]">
        <Breadcrumb pageName="menu-academy-quiz" />
        <div>
          <Suspense fallback={<Loader />}>
            <QuizList />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Quiz;
