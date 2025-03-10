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
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const { Dragger } = Upload;
type IProps = {
  handleUploadFile: (x: string) => void;
  defaultValue?: string;
  type?: "video" | "image";
};
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

const FileUpload = ({ handleUploadFile, defaultValue, type }: IProps) => {
  const customRequest = async ({ file, onSuccess, onError }: any) => {
    debugger;
    try {
      const FILE_NAME = `uploads/${file.name}-${uuidv4()}`;
      const body = file.stream ? file.stream() : file;

      const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
        Key: FILE_NAME,
        Body: body, // ReadableStream dönebiliyorsa file.stream() kullanıyoruz.
        ContentType: file.type,
      };
  
      const command = new PutObjectCommand(params);
      await s3.send(command);
  
      const fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${FILE_NAME}`;
      handleUploadFile(fileUrl);
      onSuccess("ok");
  
    } catch (error) {
      console.error(error);
      onError("error");
    }
  };

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
  const actionUrl =
    type !== "video"
      ? servicesBaseUrl + finalConfig.FILE_UPLOAD + "?file=upload"
      : "";

  const props: UploadProps = {
    name: "file",
    multiple: false,
    listType: "picture",
    ...(type === "video"
      ? { customRequest: customRequest } // 🔥 Video yüklerken AWS S3 kullan
      : { action: actionUrl }), // 🔥 Görsellerde doğrudan action kullan
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
