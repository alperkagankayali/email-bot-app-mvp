"use client";

import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Modal, Tag, Upload } from "antd";
import { useTranslations } from "next-intl";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { useState } from "react";
import { createUserExel, getUserCsv } from "@/services/service/generalService";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
type IProps = {
  isAddUserModal: boolean;
  setIsAddUserModal: (x: boolean) => void;
  id: string;
};
const AddUserExel = ({ isAddUserModal, setIsAddUserModal, id }: IProps) => {
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
      const isJpgOrPng = file.type === "text/csv";
      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
        return false;
      }
      setFileList([...fileList, file]);

      return false;
    },
    fileList,
  };
  const downloadCSV = (csvData: string) => {
    // Blob oluştur
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

    // Blob URL'si oluştur
    const url = URL.createObjectURL(blob);

    // Gizli bir <a> elementi oluştur
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.csv"); // İndirilecek dosya adı

    // Elementi dokümana ekle ve tıkla
    document.body.appendChild(link);
    link.click();

    // Temizlik yap
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDowloandCsv = async () => {
    const res = await getUserCsv(id);
    downloadCSV(res.data);
  };

  return (
    <>
      <Modal
        title={t("user-exel-modal-title")}
        open={isAddUserModal}
        onOk={handleUpload}
        centered
        width={800}
        onCancel={() => setIsAddUserModal(false)}
      >
        <div className="flex items-start">
          <p>{t("user-exel-modal-rules")}</p>
        </div>
        <ul className="list-disc mt-4">
          <li className="ml-6">{t("csv-rule-1")}</li>
          <li className="ml-6">{t("csv-rule-2")}</li>
          <li className="ml-6">{t("csv-rule-3")}</li>
        </ul>
        <Button
          className="float-right my-4 !bg-[#181140] !text-white"
          onClick={handleDowloandCsv}
        >
          Dowloand Example CSV
        </Button>
        <p></p>
        <p></p>
        <table className="w-full mt-4">
          <tr>
            <th className="border border-gray-200 text-center p-2">
              {t("user-table-name-surname")?.split(" ")[0]}
            </th>
            <th className="border border-gray-200 text-center p-2">
              {t("user-table-name-surname")?.split(" ")[1]}
            </th>
            <th className="border border-gray-200 text-center p-2">email</th>
            <th className="border border-gray-200 text-center p-2">language</th>
            <th className="border border-gray-200 text-center p-2">
              department
            </th>
            <th className="border border-gray-200 text-center p-2">role</th>
          </tr>
          <tr>
            <td className="border border-gray-200 bg-slate-500 text-white p-2 text-center"></td>
            <td className="border border-gray-200 bg-slate-500 text-white p-2 text-center"></td>
            <td className="border border-gray-200 bg-slate-500 text-white p-2 text-center">
              (ex: tr | en)
            </td>
            <td className="border border-gray-200 bg-slate-500 text-white p-2 text-center"></td>
            <td className="border border-gray-200 bg-slate-500 text-white p-2 text-center">
              admin | user
            </td>
            <td className="border border-gray-200 bg-slate-500 text-white p-2 text-center"></td>
          </tr>
        </table>
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
