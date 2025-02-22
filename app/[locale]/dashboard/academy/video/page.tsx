import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import VideoList from "@/components/academy/video";
import Loader from "@/components/common/Loader";

const Video: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-academy-video" />
        <div>
          <Suspense fallback={<Loader />}>
            <VideoList />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Video;
