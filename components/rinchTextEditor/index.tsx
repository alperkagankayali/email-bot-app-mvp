"use client";
import React from "react";
import JoditEditor from "jodit-react";
import { servicesBaseUrl } from "@/services/service/generalService";
import finalConfig from "@/lib/config.json";

type ImageHandlerProps = {
  onUpload?: (file: File) => Promise<string>;
  content: string;
  setContent: (x: string) => void;
};

const config: any = {
  uploader: {
    insertImageAsBase64URI: false,
    imagesExtensions: ["jpg", "png", "jpeg", "gif"],
    withCredentials: false,
    format: "json",
    method: "POST",
    url: servicesBaseUrl + finalConfig.FILE_UPLOAD + "?file=emailtemplate",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    prepareData: function (data: any) {
      data.append("file", data);
      return data;
    },
    isSuccess: function (resp: any) {
      return !resp.error;
    },
    getMsg: function (resp: any) {
      return resp.msg.join !== undefined ? resp.msg.join(" ") : resp.msg;
    },
    process: function (resp: any) {
      return {
        files: [resp.data],
        path: "",
        baseurl: "",
        error: resp.error ? 1 : 0,
        msg: resp.msg,
      };
    },
    defaultHandlerSuccess: function (data: any, resp: any) {
      const files = data.files || [];
      console.log("default", files);
    },
    defaultHandlerError: function (resp: any) {
      console.log("default", resp);
    },
  },
};
const RinchTextEditor: React.FC<ImageHandlerProps> = ({
  content,
  setContent,
}) => {
  const uploadToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("File upload failed");
    }

    const data = await response.json();
    return data.imageUrl; // Sunucudan dönen görüntü URL'si
  };

  return (
    <div>
      <JoditEditor
        value={content}
        config={config}
        onChange={(newContent) => setContent(newContent)}
      />
    </div>
  );
};

export default RinchTextEditor;
