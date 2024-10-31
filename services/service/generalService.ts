import { jsonToQueryString } from "@/constants";
import { getRequest, postRequest } from "../client/client";
import finalConfig from "@/lib/config.json";
import headers from "@/lib/header.json";
import { IResourceDb } from "@/types/resourcesType";
import { IResponseType } from "@/types/responseType";
import { IUser } from "@/types/userType";

export const servicesBaseUrl =
  process.env.NODE_ENV === "production"
    ? "https://email-bot-app-mvp-mx28.vercel.app/api"
    : `http://localhost:${process.env.PORT || 3000}/api`;

export const getLanguage = async (limit = 10, page = 1, isActive = true) => {
  const queryParams = jsonToQueryString({ isActive, limit, page });
  const url = servicesBaseUrl + finalConfig.GET_LANGUAGES + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};

export const updateLanguage = async (id: string, updateData: any) => {
  const url = servicesBaseUrl + finalConfig.UPDATE_LANGUAGE;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(
    url,
    { id, updateData },
    config
  );
  return result;
};

export const getResource = async (code: string) => {
  const queryParams = jsonToQueryString({ code });
  const url = servicesBaseUrl + finalConfig.GET_RESOURCES + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};

export const getResourceAll = async (limit = 10, page = 1, code = "") => {
  const queryParams = jsonToQueryString({ code, limit, page });
  const url = servicesBaseUrl + finalConfig.GET_ALL_RESOURCES + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};

export const getAllUsers = async (limit = 10, page = 1) => {
  const queryParams = jsonToQueryString({ limit, page });
  const url = servicesBaseUrl + finalConfig.GET_ALL_USERS + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};
export const updateResource = async (id: string, updateData: any) => {
  const url = servicesBaseUrl + finalConfig.UPDATE_RESOURCE;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(
    url,
    { id, updateData },
    config
  );
  return result;
};

export const createResource = async (data: IResourceDb) => {
  const url = servicesBaseUrl + finalConfig.CREATE_RESOURCES;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, data, config);
  return result;
};
export const handleLogin = async (email: string, password: string) => {
  const url = servicesBaseUrl + finalConfig.LOGIN;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(
    url,
    { email, password },
    config
  );
  return result;
};

export const getAllCamponies = async (limit = 10, page = 1) => {
  const queryParams = jsonToQueryString({ limit, page });
  const url = servicesBaseUrl + finalConfig.GET_ALL_COMPANIES + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};

export const createCompany = async (data: any) => {
  const url = servicesBaseUrl + finalConfig.CREATE_COMPANY;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, data, config);
  return result;
};

export const updateCompany = async (updateData: any) => {
  const url = servicesBaseUrl + finalConfig.UPDATE_COMPANY;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(
    url,
    { id: updateData?.id, updateData },
    config
  );
  return result;
};

export const getUserById = async (id: string) => {
  const queryParams = jsonToQueryString({ id });
  const url = servicesBaseUrl + finalConfig.GET_USER_BY_ID + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};

export const getAuthorization = async (limit = 10, page = 1) => {
  const queryParams = jsonToQueryString({ limit, page });
  const url = servicesBaseUrl + finalConfig.GET_AUTHORIZATION + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};

export const createUser = async (data: IUser) => {
  const url = servicesBaseUrl + finalConfig.CREATE_USER;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, data, config);
  return result;
};

export const getUserFormat = async () => {
  const url = servicesBaseUrl + finalConfig.GET_EXEL_FORMAT;
  const config = headers.content_type["octet-stream"];
  const result: IResponseType = await getRequest(url, config);
  return result;
};

export const fileUploadAws = async (formData: any, file: string) => {
  const queryParams = jsonToQueryString({ file });
  const url = servicesBaseUrl + finalConfig.FILE_UPLOAD + queryParams;
  const config = headers.content_type.form_data;
  const result: IResponseType = await postRequest(url, formData, config);
  return result;
};


export const createUserExel = async (formData: any) => {
  const url = servicesBaseUrl + finalConfig.CREATE_USER_WITH_EXCEL ;
  const config = headers.content_type.form_data;
  const result: IResponseType = await postRequest(url, formData, config);
  return result;
};

export const getUserCsv = async (id: string) => {
  const queryParams = jsonToQueryString({ id });
  const url = servicesBaseUrl + finalConfig.GET_USER_WITH_EXCEL + queryParams ;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url,  config);
  return result;
};

export const getLandingPage = async (id: string) => {
  const queryParams = jsonToQueryString({ id });
  const url = servicesBaseUrl + finalConfig.GET_LANDING_PAGE + queryParams ;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url,  config);
  return result;
};

export const getDataEntries = async (id: string) => {
  const queryParams = jsonToQueryString({ id });
  const url = servicesBaseUrl + finalConfig.GET_DATA_ENTRY + queryParams ;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url,  config);
  return result;
};
export const getEmailTemplate = async (id: string) => {
  const queryParams = jsonToQueryString({ id });
  const url = servicesBaseUrl + finalConfig.GET_EMAIL_TEMPLATE + queryParams ;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url,  config);
  return result;
};
