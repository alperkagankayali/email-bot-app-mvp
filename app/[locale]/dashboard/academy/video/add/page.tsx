import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import VideoForm from "@/components/education/form/videoForm";
import Loader from "@/components/common/Loader";

const VideoAdd: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-academy-video" />
        <div>
          <Suspense fallback={<Loader />}>
            <VideoForm redirect={true} />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default VideoAdd;
