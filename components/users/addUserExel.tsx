"use client";

import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Modal, Tag, Upload, Progress, Table } from "antd";
import { useTranslations } from "next-intl";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { useState, useEffect } from "react";
import {
  createUserExel,
  getUserCsv,
  getImportLog,
} from "@/services/service/generalService";
import { io } from "socket.io-client";
import { http } from "@/services/client/https";

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
  const [importStatus, setImportStatus] = useState<any>(null);
  const [errors, setErrors] = useState<any[]>([]);
  const [socket, setSocket] = useState<any>(null);
  const [importHistory, setImportHistory] = useState<any[]>([]);

  // Import geçmişini yükle
  useEffect(() => {
    const loadImportHistory = async () => {
      try {
        const response = await http.get(`/import-log/company/${id}`);
        if (response.data?.success) {
          setImportHistory(response.data.data);
        }
      } catch (error) {
        console.error("Import history load error:", error);
      }
    };

    if (isAddUserModal) {
      loadImportHistory();
    }
  }, [isAddUserModal, id]);

  // Socket.io bağlantısı
  useEffect(() => {
    if (!isAddUserModal) return;

    console.log("Initializing socket connection");
    const newSocket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000",
      {
        path: "/api/socket",
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: true,
        forceNew: true,
      }
    );

    newSocket.on("connect", () => {
      console.log("Socket connected successfully", newSocket.id);
      // Bağlantı başarılı olduğunda mevcut import varsa odaya katıl
      if (importStatus?._id) {
        newSocket.emit("joinImportRoom", importStatus._id);
      }
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      message.error("Bağlantı hatası oluştu. Lütfen sayfayı yenileyin.");
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      message.warning("Bağlantı kesildi. Yeniden bağlanılıyor...");
    });

    // Import güncellemelerini dinle
    newSocket.on("importUpdate", (data: any) => {
      console.log("Received import update:", data);

      if (!data) return;

      // ImportStatus'u güncelle
      setImportStatus(data);

      // Hataları güncelle
      if (data.importErrors && data.importErrors.length > 0) {
        setErrors(data.importErrors);
      }

      // Import geçmişini güncelle
      setImportHistory((prev) => {
        const index = prev.findIndex((item) => item._id === data._id);
        if (index !== -1) {
          const newHistory = [...prev];
          newHistory[index] = data;
          return newHistory;
        }
        return [data, ...prev];
      });

      // İşlem tamamlandığında bildirim göster
      if (data.status === "success") {
        message.success(`${data.processedRows} kayıt başarıyla içe aktarıldı.`);
      } else if (data.status === "error") {
        message.error(`İçe aktarma ${data.failedRows} hata ile tamamlandı.`);
      }
    });

    setSocket(newSocket);

    return () => {
      console.log("Cleaning up socket connection");
      if (newSocket) {
        if (importStatus?._id) {
          newSocket.emit("leaveImportRoom", importStatus._id);
        }
        newSocket.disconnect();
      }
    };
  }, [isAddUserModal]);

  const handleUpload = async () => {
    if (!fileList.length) {
      message.error("Lütfen bir dosya seçin");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileList[0] as FileType);
    setUploading(true);
    setErrors([]);
    setImportStatus(null);

    try {
      const res = await createUserExel(formData);
      console.log("Upload response:", res);

      if (res.data?.importLogId) {
        // Import durumunu takip et
        const logStatus: any = await getImportLog(res.data.importLogId);
        console.log("Initial import status:", logStatus);

        if (logStatus.data) {
          setImportStatus(logStatus.data);
          // Socket odaya katıl
          if (socket?.connected) {
            socket.emit("joinImportRoom", logStatus.data._id);
          }
          setImportHistory((prev) => [logStatus.data, ...prev]);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Dosya yükleme sırasında hata oluştu");
    } finally {
      setUploading(false);
    }
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
        message.error(t("error-image-upload"));
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 40;
      if (!isLt2M) {
        message.error(t("error-file-size", { size: "40MB" }));
        return false;
      }
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const downloadCSV = (csvData: string) => {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDowloandCsv = async () => {
    const res = await getUserCsv(id);
    downloadCSV(res.data);
  };

  const errorColumns = [
    {
      title: t("row"),
      dataIndex: "row",
      key: "row",
    },
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("error"),
      dataIndex: "error",
      key: "error",
    },
  ];

  const importHistoryColumns = [
    {
      title: t("date"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: t("total-rows"),
      dataIndex: "totalRows",
      key: "totalRows",
    },
    {
      title: t("processed-rows"),
      dataIndex: "processedRows",
      key: "processedRows",
    },
    {
      title: t("failed-rows"),
      dataIndex: "failedRows",
      key: "failedRows",
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "success" ? "green" : status === "error" ? "red" : "blue"
          }
        >
          {status === "success"
            ? t("success")
            : status === "error"
              ? t("error")
              : t("processing")}
        </Tag>
      ),
    },
    {
      title: t("actions"),
      key: "actions",
      render: (record: any) => (
        <Button
          type="link"
          onClick={() => {
            setImportStatus(record);
            setErrors(record.importErrors || []);
          }}
        >
          {t("view-details")}
        </Button>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={t("user-exel-modal-title")}
        open={isAddUserModal}
        onOk={handleUpload}
        confirmLoading={uploading}
        centered
        width={1000}
        onCancel={() => {
          setIsAddUserModal(false);
          setImportStatus(null);
          setErrors([]);
          setFileList([]);
        }}
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
          {t("dowloand-csv")}
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
            <th className="border border-gray-200 text-center p-2">
              {t("login-emailInput")}
            </th>
            <th className="border border-gray-200 text-center p-2">
              {t("resources-language")}
            </th>
            <th className="border border-gray-200 text-center p-2">
              {t("user-table-department")}
            </th>
            <th className="border border-gray-200 text-center p-2">
              {t("user-table-role")}
            </th>
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
            <Button icon={<UploadOutlined />}>{t("select-file")}</Button>
          </Upload>
        </div>

        {importStatus && (
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <span>{t("import-status")}:</span>
              <Tag
                color={
                  importStatus.status === "success"
                    ? "green"
                    : importStatus.status === "error"
                      ? "red"
                      : "blue"
                }
              >
                {importStatus.status === "success"
                  ? t("success")
                  : importStatus.status === "error"
                    ? t("error")
                    : t("processing")}
              </Tag>
            </div>
            <Progress
              percent={Math.round(
                (importStatus.processedRows / (importStatus.totalRows || 1)) *
                  100
              )}
              status={importStatus.status === "error" ? "exception" : "active"}
            />
            <div className="mt-2 text-sm text-gray-500">
              {t("processed")}: {importStatus.processedRows} /{" "}
              {importStatus.totalRows}
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <div className="mt-4">
            <h3 className="text-red-500 mb-2">{t("import-errors")}</h3>
            <Table
              dataSource={errors}
              columns={errorColumns}
              pagination={{ pageSize: 5 }}
              size="small"
              rowKey={(record) => `${record.row}-${record.email}`}
            />
          </div>
        )}

        {importHistory.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">
              {t("import-history")}
            </h3>
            <Table
              dataSource={importHistory}
              columns={importHistoryColumns}
              pagination={{ pageSize: 5 }}
              rowKey="_id"
              loading={!importHistory.length}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default AddUserExel;
