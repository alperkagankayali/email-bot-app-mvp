import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import VideoList from "@/components/academy/video";

const Video: React.FC = async () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="menu-academy-video" />
        <div>
          <VideoList />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Video;
