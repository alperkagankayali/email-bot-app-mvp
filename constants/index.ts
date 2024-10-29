import { IResponseType } from "@/types/responseType";
import xlsx from "json-as-xlsx";

export function jsonToQueryString(json: any) {
  return (
    "?" +
    Object.keys(json)
      .map(function (key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
      })
      .join("&")
  );
}

export const message200: IResponseType = {
  status: 200,
  color: "success",
  data: null,
  message: "success-200",
  success: true,
};
export const message201: IResponseType = {
  status: 201,
  color: "success",
  data: null,
  message: "success-201",
  success: true,
};
export const message401: IResponseType = {
  status: 401,
  color: "danger",
  data: null,
  message: "danger-401",
  success: false,
};
export const message404: IResponseType = {
  status: 404,
  color: "danger",
  data: null,
  message: "danger-404",
  success: false,
};
export const message500: IResponseType = {
  status: 500,
  color: "danger",
  data: null,
  message: "danger-500",
  success: false,
};
export const message403: IResponseType = {
  status: 403,
  color: "danger",
  data: null,
  message: "danger-403",
  success: false,
};

export const downloadFile = (company: string) => {
  let data = [
    {
      columns: [
        { label: "nameSurname", value: "nameSurname" }, // Top level data
        { label: "email", value: "email" }, // Custom format
        { label: "language", value: "language" }, // Custom format
        { label: "department", value: "department" }, // Custom format
        { label: "company", value: "company" }, // Custom format
        { label: "role", value: "role" }, // Custom format
      ],
      content: [
        {
          nameSurname: "",
          email: "",
          language: "",
          department: "",
          company: company,
          role: "",
        },
      ],
    },
  ];
  let settings = {
    fileName: "UserExel",
  };
  xlsx(data, settings);
};
