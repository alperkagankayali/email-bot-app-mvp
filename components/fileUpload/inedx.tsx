"use client";
import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import finalConfig from "@/lib/config.json";
import type { GetProp } from "antd";
import { v4 as uuidv4 } from "uuid";
import { getBase64, servicesBaseUrl } from "@/constants";
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
      file.type === "image/webp";
    if (type === "video") {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
      }
      return isLt2M;
    } else {
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
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
    defaultFileList: !!defaultValue
      ? [{ url: defaultValue, name: "image", uid: uuidv4(), status: "done" }]
      : [],
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
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
  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading
        company data or other banned files.
      </p>
    </Dragger>
  );
};

export default FileUpload;
