"use client";
import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import finalConfig from "@/lib/config.json";
import type { GetProp } from "antd";
import { v4 as uuidv4 } from "uuid";
import { servicesBaseUrl } from "@/constants";
import { useTranslations } from "next-intl";
const { Dragger } = Upload;
type IProps = {
  handleUploadFile: (x: string) => void;
  defaultValue?: string;
  type?: "video" | "image";
};
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const FileUpload = ({ handleUploadFile, defaultValue, type }: IProps) => {
  const beforeUpload = (file: FileType) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/svg+xml" ||
      file.type === "image/webp";
    if (type === "video") {
      const isLt2M = file.size / 1024 / 1024 < 50;
      if (!isLt2M) {
        message.error(t("error-file-size", { size: "50MB" }));
      }
      return isLt2M;
    } else {
      if (!isJpgOrPng) {
        message.error(t("error-image-upload"));
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error(t("error-file-size", { size: "2MB" }));
      }
      return isJpgOrPng && isLt2M;
    }
  };
  const props: UploadProps = {
    name: "file",
    multiple: false,
    listType: "picture",
    action: servicesBaseUrl + finalConfig.FILE_UPLOAD + "?file=upload",
    beforeUpload: beforeUpload,
    maxCount: 1,
    defaultFileList: !!defaultValue
      ? type === "video"
        ? [{ url: defaultValue, name: "video", uid: uuidv4(), status: "done" }]
        : [{ url: defaultValue, name: "image", uid: uuidv4(), status: "done" }]
      : [],
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        handleUploadFile(info.file.response.data.url);
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  const t = useTranslations("pages");

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">{t("file-upload-title")}</p>
      <p className="ant-upload-hint">{t("file-upload-description")}</p>
    </Dragger>
  );
};

export default FileUpload;
