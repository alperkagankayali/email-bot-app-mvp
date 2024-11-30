import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import VideoForm from "@/components/education/form/videoForm";

const VideoUpdate: React.FC <{
  params: { id: string }
}>= async ({
  params: { id },
}) => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-academy-article" />
        <div>
          <VideoForm redirect={true} videoId={id} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default VideoUpdate;
