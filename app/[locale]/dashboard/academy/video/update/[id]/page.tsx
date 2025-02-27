import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import VideoForm from "@/components/education/form/videoForm";
import Loader from "@/components/common/Loader";

const VideoUpdate: React.FC<{
  params: { id: string };
}> = async ({ params: { id } }) => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-[67rem]">
        <Breadcrumb pageName="menu-academy-article" />
        <div>
          <Suspense fallback={<Loader />}>
            <VideoForm redirect={true} videoId={id} />
          </Suspense>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default VideoUpdate;
