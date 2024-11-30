import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import VideoForm from "@/components/education/form/videoForm";

const VideoAdd: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-academy-video" />
        <div>
          <VideoForm redirect={true} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default VideoAdd;
