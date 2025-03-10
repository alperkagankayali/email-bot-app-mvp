import { jsonToQueryString, servicesBaseUrl } from "@/constants";
import { getRequest, postRequest } from "../client/client";
import finalConfig from "@/lib/config.json";
import headers from "@/lib/header.json";
import { IResourceDb } from "@/types/resourcesType";
import { IResponseType } from "@/types/responseType";
import { IUser } from "@/types/userType";
import { ILandingPage } from "@/types/scenarioType";

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

export const deleteResource = async (id: string) => {
  const url = servicesBaseUrl + finalConfig.DELETE_RESOURCES;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, { id }, config);
  return result;
};

export const getResource = async (code: string) => {
  const queryParams = jsonToQueryString({ code });
  const url = servicesBaseUrl + finalConfig.GET_RESOURCES + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};

export const getResourceAll = async (limit = 10, page = 1, filter: any) => {
  const queryParams = jsonToQueryString({ limit, page, ...filter });
  const url = servicesBaseUrl + finalConfig.GET_ALL_RESOURCES + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};

export const getAllUsers = async (id = "") => {
  const queryParams = jsonToQueryString({ id });
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
export const handleOtherLogin = async (id: string) => {
  const url = servicesBaseUrl + finalConfig.OTHER_LOGIN;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, { id }, config);
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

export const getUserById = async (id: string, filter?: {}) => {
  const queryParams = jsonToQueryString({ id, ...filter });
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
  const url = servicesBaseUrl + finalConfig.CREATE_USER_WITH_EXCEL;
  const config = headers.content_type.form_data;
  const result: IResponseType = await postRequest(url, formData, config);
  return result;
};

export const getUserCsv = async (id: string) => {
  const queryParams = jsonToQueryString({ id });
  const url = servicesBaseUrl + finalConfig.GET_USER_WITH_EXCEL + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};

export const getLandingPage = async (filter: any) => {
  const queryParams = jsonToQueryString({ ...filter });
  const url = servicesBaseUrl + finalConfig.GET_LANDING_PAGE + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};

export const getDataEntries = async (filter: any) => {
  const queryParams = jsonToQueryString({ ...filter });
  const url = servicesBaseUrl + finalConfig.GET_DATA_ENTRY + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};

export const getEmailTemplate = async (filter: any) => {
  const queryParams = jsonToQueryString({ ...filter });
  const url = servicesBaseUrl + finalConfig.GET_EMAIL_TEMPLATE + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await getRequest(url, config);
  return result;
};

export const createLandingPage = async (data: ILandingPage) => {
  const url = servicesBaseUrl + finalConfig.CREATE_LANDING_PAGE;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, data, config);
  return result;
};
export const createEmailTemplate = async (data: ILandingPage) => {
  const url = servicesBaseUrl + finalConfig.CREATE_EMAIL_TEMPLATE;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, data, config);
  return result;
};
export const createDataEntry = async (data: ILandingPage) => {
  const url = servicesBaseUrl + finalConfig.CREATE_DATA_ENTRY;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, data, config);
  return result;
};

export const updateLandingPage = async (id: string, updateData: any) => {
  const url = servicesBaseUrl + finalConfig.UPDATE_LANDING_PAGE;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(
    url,
    { id, updateData },
    config
  );
  return result;
};

export const updateDataEntry = async (id: string, updateData: any) => {
  const url = servicesBaseUrl + finalConfig.UPDATE_DATA_ENTRY;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(
    url,
    { id, updateData },
    config
  );
  return result;
};
export const updateEmailTemplate = async (id: string, updateData: any) => {
  const url = servicesBaseUrl + finalConfig.UPDATE_EMAIL_TEMPLATE;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(
    url,
    { id, updateData },
    config
  );
  return result;
};
export const updateUser = async (id: string, updateData: any) => {
  const url = servicesBaseUrl + finalConfig.UPDATE_USER;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(
    url,
    { id, updateData },
    config
  );
  return result;
};

export const deleteEmailTemplate = async (id: string) => {
  const url = servicesBaseUrl + finalConfig.DELETE_EMAIL_TEMPLATE;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, { id }, config);
  return result;
};

export const deleteDataEntry = async (id: string) => {
  const url = servicesBaseUrl + finalConfig.DELETE_LANDING_PAGE;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, { id }, config);
  return result;
};

export const deleteLandingPage = async (id: string) => {
  const url = servicesBaseUrl + finalConfig.DELETE_DATA_ENTRY;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, { id }, config);
  return result;
};

export const deleteUser = async (id: string) => {
  const url = servicesBaseUrl + finalConfig.DELETE_USER;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, { id }, config);
  return result;
};


export const updatePassword = async (id: string, password: string) => {
  const url = servicesBaseUrl + finalConfig.UPDATE_PASSWORD;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(
    url,
    { id, password },
    config
  );
  return result;
};

export const setCookie = async (name: string, token: string) => {
  const queryParams = jsonToQueryString({ name, token });
  const url = servicesBaseUrl + finalConfig.SET_COOKIE + queryParams;
  const config = headers.content_type.application_json;
  const result: IResponseType = await postRequest(url, {}, config);
  return result;
};
