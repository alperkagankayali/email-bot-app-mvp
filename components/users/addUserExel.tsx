"use client";

import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Modal, Tag, Upload } from "antd";
import { useTranslations } from "next-intl";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { useState } from "react";
import {
  createUserExel,
  fileUploadAws,
  servicesBaseUrl,
} from "@/services/service/generalService";
import finalConfig from "@/lib/config.json";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
type IProps = {
  isAddUserModal: boolean;
  setIsAddUserModal: (x: boolean) => void;
};
const AddUserExel = ({ isAddUserModal, setIsAddUserModal }: IProps) => {
  const t = useTranslations("pages");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", fileList[0] as FileType);
    setUploading(true);
   const res = createUserExel(formData);
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
    fileList,
  };

  const handleOk = () => {
    console.log("test");
  };
  return (
    <>
      <Modal
        title={t("user-exel-modal-title")}
        open={isAddUserModal}
        onOk={handleUpload}
        onCancel={() => setIsAddUserModal(false)}
      >
        <div className="flex items-start">
          {" "}
          <Tag color="#f50">**</Tag>
          <p>{t("user-exel-modal-rules")}</p>
        </div>
        <div className="mt-6">
          <Upload {...props} className="">
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </div>
      </Modal>
    </>
  );
};

export default AddUserExel;
